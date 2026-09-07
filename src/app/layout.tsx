import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";
import { AuthProvider } from "@/components/AuthProvider";

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
    "Instagram-style Korea travel feed with routes, hotels, nightlife, hangouts, community forum, and bookable experiences for inbound travelers.",
  openGraph: {
    title: "Tourink — Korea Travel Feed",
    description:
      "Feed-first Korea travel for foreigners — book stays & experiences, meet locals, ask the forum.",
    url: siteUrl,
    siteName: "Tourink",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tourink — Korea Travel Feed",
    description: "Korea travel, feed-first. Hotels, experiences, hangouts, and community."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
