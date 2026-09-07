import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";
import { AuthProvider } from "@/components/AuthProvider";
import { getPublicFeatureFlags } from "@/lib/feature-flags";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tourink.kr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tourink — Korea Travel Feed",
    template: "%s · Tourink"
  },
  description:
    "Instagram-style Korea travel feed with routes, nightlife, hangouts, community forum, and discovery for inbound travelers.",
  openGraph: {
    title: "Tourink — Korea Travel Feed",
    description:
      "Feed-first Korea travel for foreigners — meet locals, browse routes & nightlife, ask the forum.",
    url: siteUrl,
    siteName: "Tourink",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tourink — Korea Travel Feed",
    description: "Korea travel, feed-first. Routes, nightlife, hangouts, and community."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = getPublicFeatureFlags();
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <AppChrome flags={flags}>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
