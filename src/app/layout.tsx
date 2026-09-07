import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: {
    default: "Tourink — Korea Travel Feed",
    template: "%s · Tourink"
  },
  description:
    "Instagram-style Korea travel feed with routes, hotels, nightlife, community, and bookable experiences."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col md:max-w-2xl lg:max-w-6xl lg:flex-row lg:gap-8 lg:px-6">
          <SiteNav />
          <main className="flex-1 pb-24 lg:pb-10 lg:pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
