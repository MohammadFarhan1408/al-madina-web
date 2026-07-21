import { Playfair_Display, Jost } from "next/font/google";
import localFont from "next/font/local";

// Fugi — brand display face (local, single weight). Used for hero/display type.
export const fugi = localFont({
  src: "../../public/fonts/Fugi.otf",
  variable: "--ff-display",
  weight: "400",
  display: "swap",
  // ponytail: .otf is the fuller of the two supplied files; .woff2 conversion is a Phase-2 perf win.
});

// Playfair Display — editorial prose / fragrance storytelling.
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--ff-editorial",
  display: "swap",
  style: ["normal", "italic"],
});

// Jost — clean UI face: nav, buttons, prices, labels, metadata.
export const jost = Jost({
  subsets: ["latin"],
  variable: "--ff-ui",
  display: "swap",
});
