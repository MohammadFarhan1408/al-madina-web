/**
 * Where the mobile app is downloaded from.
 *
 * The Android APK is attached to a GitHub Release on the al-madina-ittar repo (too
 * large to commit here). For a new version, bump the tag in the URL — or mark the
 * release non-prerelease and use `/releases/latest/download/al-madina-ittar.apk`.
 * The iOS build is still served from `public/download/al-madina-ittar.ipa`.
 * When the app is published to the stores, change these two URLs to the App Store /
 * Google Play listings; nothing else needs to change.
 */
export const APP_DOWNLOAD = {
  android: {
    href: "https://github.com/MohammadFarhan1408/al-madina-ittar/releases/download/v1.0.0/al-madina-ittar.apk",
    /** True while the link is a direct file (adds the `download` attribute). */
    isFile: true,
  },
  ios: {
    href: "/download/al-madina-ittar.ipa",
    isFile: true,
  },
} as const;
