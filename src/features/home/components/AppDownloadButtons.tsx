"use client";

import { useSyncExternalStore } from "react";
import { APP_DOWNLOAD } from "@/lib/app-download";

type Platform = "ios" | "android" | null;

const subscribeNoop = () => () => {};

/** Best-effort platform guess so the right button can be marked "for this device".
 *  Purely cosmetic — both buttons always work and stay visible. */
function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPadOS reports as Mac; touch points disambiguate.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return null;
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.2 1.11-.04 1.53-.71 2.87-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.15.84-1.23 1.19-2.43 1.2-2.49-.03-.01-2.3-.88-2.34-3.52ZM14.2 6.13c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.55.64-1.05 1.69-.92 2.68.98.08 1.97-.49 2.58-1.23Z" />
    </svg>
  );
}

function AndroidGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22a11.4 11.4 0 0 0-9.84 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52ZM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
    </svg>
  );
}

function StoreButton({
  href,
  isFile,
  glyph,
  kicker,
  label,
  recommended,
}: {
  href: string;
  isFile: boolean;
  glyph: React.ReactNode;
  kicker: string;
  label: string;
  recommended: boolean;
}) {
  return (
    <a
      href={href}
      {...(isFile ? { download: "" } : { target: "_blank", rel: "noopener noreferrer" })}
      aria-label={`${kicker} ${label}`}
      className={`group relative flex min-h-[64px] flex-1 items-center gap-4 border px-5 py-3.5 transition-colors duration-300 sm:min-w-[15rem] sm:flex-none ${
        recommended
          ? "border-antique-gold bg-antique-gold text-rich-black hover:bg-gold-bright"
          : "border-bronze/50 text-ivory hover:border-antique-gold hover:text-antique-gold"
      }`}
    >
      {glyph}
      <span className="flex flex-col text-left">
        <span className="font-ui text-[0.62rem] uppercase tracking-[0.24em] opacity-75">{kicker}</span>
        <span className="font-display text-xl leading-tight">{label}</span>
      </span>
      <span
        aria-hidden="true"
        className="ml-auto font-ui text-sm transition-transform duration-300 group-hover:translate-y-0.5"
      >
        ↓
      </span>
      {recommended && (
        <span className="absolute -top-2.5 left-4 bg-rich-black px-2 font-ui text-[0.58rem] uppercase tracking-[0.24em] text-antique-gold">
          For this device
        </span>
      )}
    </a>
  );
}

export function AppDownloadButtons() {
  // Read once on the client; the server (and first paint) renders the neutral order.
  const platform = useSyncExternalStore(subscribeNoop, detectPlatform, () => null);

  const ios = (
    <StoreButton
      key="ios"
      href={APP_DOWNLOAD.ios.href}
      isFile={APP_DOWNLOAD.ios.isFile}
      glyph={<AppleGlyph />}
      kicker="Download for"
      label="iPhone"
      recommended={platform === "ios"}
    />
  );
  const android = (
    <StoreButton
      key="android"
      href={APP_DOWNLOAD.android.href}
      isFile={APP_DOWNLOAD.android.isFile}
      glyph={<AndroidGlyph />}
      kicker="Download for"
      label="Android"
      recommended={platform === "android"}
    />
  );

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      {platform === "android" ? [android, ios] : [ios, android]}
    </div>
  );
}
