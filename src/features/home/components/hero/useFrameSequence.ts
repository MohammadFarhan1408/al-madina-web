"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "desktop" | "mobile";

const SEQUENCES: Record<Variant, { count: number; dir: string }> = {
  desktop: { count: 176, dir: "/animations/oud-black/desktop" },
  mobile: { count: 30, dir: "/animations/oud-black/mobile" },
};

const framePath = (dir: string, i: number) =>
  `${dir}/frame-${String(i).padStart(3, "0")}.jpg`;

/** Draw `img` to fill (cover) a cw×ch box, centered. Bottle is centered in
 *  every frame, so center-cover keeps it fully visible on any aspect. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = cw / ch;
  let dw: number, dh: number;
  if (cr > ir) {
    dw = cw;
    dh = cw / ir;
  } else {
    dh = ch;
    dw = ch * ir;
  }
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

/**
 * Loads a scroll-scrubbed JPEG frame sequence and renders it to a canvas.
 * - Picks desktop (176) or mobile (30) set ONCE on mount (no mid-session swap).
 * - Preloads every frame (files are tiny: ~3.4MB desktop / 680KB mobile total).
 * - Draws frame 0 the instant it decodes; while scrubbing, falls back to the
 *   nearest already-loaded frame so the canvas never flashes blank.
 *
 * // ponytail: holds all Image objects — worst-case decoded memory for 176
 * // 1376×768 frames is high, but files are tiny and browsers evict decodes.
 * // Upgrade path if profiling shows pressure: sliding-window decode. Mobile is
 * // already bounded by the 30-frame set.
 */
export function useFrameSequence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const cssSizeRef = useRef({ w: 0, h: 0 });
  const lastDrawnRef = useRef(-1);
  // Stable ref the GSAP timeline calls on every scrub tick. `.current` is
  // reassigned inside the effect once the canvas/loaders are wired.
  const drawProgress = useRef<(p: number) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const isDesktop =
      window.matchMedia("(min-width: 1024px)").matches &&
      window.matchMedia("(pointer: fine)").matches;
    const variant: Variant = isDesktop ? "desktop" : "mobile";
    const { count, dir } = SEQUENCES[variant];
    setFrameCount(count);

    const images: HTMLImageElement[] = new Array(count);
    const loaded: boolean[] = new Array(count).fill(false);
    imagesRef.current = images;
    loadedRef.current = loaded;
    let disposed = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const sizeCanvas = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      cssSizeRef.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Find nearest loaded frame to `idx` (search outward).
    const nearestLoaded = (idx: number): number => {
      if (loaded[idx]) return idx;
      for (let r = 1; r < count; r++) {
        if (idx - r >= 0 && loaded[idx - r]) return idx - r;
        if (idx + r < count && loaded[idx + r]) return idx + r;
      }
      return -1;
    };

    const drawIndex = (idx: number) => {
      const src = nearestLoaded(idx);
      if (src < 0) return;
      const { w, h } = cssSizeRef.current;
      if (!w || !h) return;
      drawCover(ctx, images[src], w, h);
      lastDrawnRef.current = idx;
    };

    const progressToIndex = (p: number) =>
      Math.max(0, Math.min(count - 1, Math.round(p * (count - 1))));

    drawProgress.current = (p: number) => {
      const idx = progressToIndex(p);
      if (idx === lastDrawnRef.current && loaded[idx]) return;
      drawIndex(idx);
    };

    // Load frame 1 first, draw + mark ready ASAP, then load the rest.
    const loadFrame = (i: number, onFirst?: () => void) => {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(dir, i + 1);
      const done = () => {
        if (disposed) return;
        loaded[i] = true;
        images[i] = img;
        // Redraw if this frame is the one we currently want (or first paint).
        if (i === 0 && lastDrawnRef.current < 0) {
          sizeCanvas();
          drawIndex(0);
          setReady(true);
        } else if (i === lastDrawnRef.current) {
          drawIndex(i);
        }
        onFirst?.();
      };
      images[i] = img;
      if (img.complete && img.naturalWidth) done();
      else {
        img.onload = done;
        img.onerror = () => {
          if (!disposed) loaded[i] = false;
        };
      }
    };

    sizeCanvas();
    loadFrame(0, () => {
      for (let i = 1; i < count; i++) loadFrame(i);
    });

    const ro = new ResizeObserver(() => {
      sizeCanvas();
      const idx = lastDrawnRef.current < 0 ? 0 : lastDrawnRef.current;
      drawIndex(idx);
    });
    ro.observe(canvas);
    const onOrient = () => {
      sizeCanvas();
      drawIndex(lastDrawnRef.current < 0 ? 0 : lastDrawnRef.current);
    };
    window.addEventListener("orientationchange", onOrient);

    return () => {
      disposed = true;
      ro.disconnect();
      window.removeEventListener("orientationchange", onOrient);
      images.length = 0;
      loaded.length = 0;
    };
  }, []);

  return { canvasRef, ready, frameCount, drawProgress };
}
