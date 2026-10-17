/**
 * Where the mobile app is downloaded from.
 *
 * Initially the builds are served straight from `public/download/` — drop the files
 * there with exactly these names. When the app is published to the stores, change
 * these two URLs to the App Store / Google Play listings; nothing else needs to change.
 *
 *   public/download/al-madina-ittar.apk   → Android
 *   public/download/al-madina-ittar.ipa   → iOS
 */
export const APP_DOWNLOAD = {
  android: {
    href: "/download/al-madina-ittar.apk",
    /** True while the link is a direct file (adds the `download` attribute). */
    isFile: true,
  },
  ios: {
    href: "/download/al-madina-ittar.ipa",
    isFile: true,
  },
} as const;
