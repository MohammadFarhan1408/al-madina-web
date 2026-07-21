"use client";

import type { RefObject } from "react";

/** Full-bleed canvas with a warm-dark poster underneath so there's never a
 *  blank flash before the first frame decodes. Poster + canvas both use
 *  center-cover, so they align. */
export function FrameCanvas({
  canvasRef,
  ready,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  ready: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-rich-black">
      {/* warm glow matching the frame background, top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 82% 8%, rgba(154,123,51,0.30), rgba(11,11,11,0) 55%)",
        }}
      />
      <img
        src="/animations/oud-black/desktop/frame-001.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: ready ? 0 : 1 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
