import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { AppDownloadButtons } from "./AppDownloadButtons";

// Screenshot of the app's opening screen.
const SCREEN_ART = "/images/app-screen.jpg";

// What the app genuinely does today (mirrors the mobile app's real features).
const FEATURES = [
  {
    title: "Track every order",
    body: "Live status from atelier to your door.",
  },
  {
    title: "Save your favourites",
    body: "Your wishlist, synced to your account.",
  },
  { title: "Checkout in moments", body: "Saved addresses and secure payment." },
];

/**
 * "Carry the Maison" — invites visitors to install the Al Madina Ittar app.
 * Left: a phone frame showing a real screenshot of the app. Right: copy, real feature list and iPhone / Android downloads
 * (links configured in `lib/app-download.ts`, served from `public/download/`).
 */
export function AppDownload() {
  return (
    <section
      id="app"
      aria-labelledby="app-download-title"
      className="relative overflow-hidden border-t border-bronze/15 bg-rich-black"
    >
      {/* warm glow behind the device */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 70% at 28% 55%, rgba(154,123,51,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1600px] items-center gap-16 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-12 lg:gap-10 lg:px-16">
        {/* Device */}
        <Reveal className="order-2 flex justify-center lg:order-1 lg:col-span-5">
          <PhoneMockup />
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="overline">The Al Madina App</p>
            <h2
              id="app-download-title"
              className="mt-5 font-display text-4xl leading-[1.03] text-ivory sm:text-6xl"
            >
              Carry the Maison
              <br />
              <span className="italic text-antique-gold">in your pocket</span>
            </h2>
            <p className="mt-6 max-w-md font-ui text-sm leading-relaxed text-stone sm:text-base">
              Discover new compositions, keep your shortlist close and follow
              every order — the full Al Madina Ittar experience, made for your
              phone.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-10 grid gap-px border border-bronze/20 bg-bronze/20 sm:grid-cols-3">
              {FEATURES.map((f, i) => (
                <li key={f.title} className="bg-rich-black p-5">
                  <span className="font-ui text-[0.65rem] tracking-[0.24em] text-antique-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-display text-lg leading-snug text-ivory">
                    {f.title}
                  </p>
                  <p className="mt-1.5 font-ui text-xs leading-relaxed text-stone">
                    {f.body}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180}>
            <AppDownloadButtons />
            <p className="mt-5 font-ui text-xs leading-relaxed text-stone/80">
              Free to download · iOS and Android
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The app's real opening screen inside a titanium-style phone frame. */
function PhoneMockup() {
  return (
    <div className="relative" aria-hidden="true">
      {/* side buttons */}
      <span className="absolute -left-0.75 top-28 h-8 w-0.75 rounded-l bg-ivory/25" />
      <span className="absolute -left-0.75 top-44 h-14 w-0.75 rounded-l bg-ivory/25" />
      <span className="absolute -left-0.75 top-64 h-14 w-0.75 rounded-l bg-ivory/25" />
      <span className="absolute -right-0.75 top-52 h-20 w-0.75 rounded-r bg-ivory/25" />

      <div className="relative w-75 rounded-[3.4rem] border border-ivory/25 bg-linear-to-b from-ivory/20 via-obsidian to-ivory/10 p-[5px] shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(0,0,0,0.6)] sm:w-[340px] lg:w-[380px]">
        <div className="overflow-hidden rounded-[3.1rem] border-[7px] border-black bg-black">
          <Image
            src={SCREEN_ART}
            alt=""
            width={1206}
            height={2622}
            sizes="(min-width:1024px) 380px, 340px"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
