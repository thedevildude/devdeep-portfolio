import type { Metadata } from "next";
import {
  Barlow_Semi_Condensed,
  Hepta_Slab,
  Noto_Sans_Devanagari,
} from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { SITE } from "@/lib/constants";
import AnalyticsEvents from "@/components/ui/AnalyticsEvents";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const barlow = Barlow_Semi_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const heptaSlab = Hepta_Slab({
  variable: "--font-hepta-slab",
  subsets: ["latin"],
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        barlow.variable,
        heptaSlab.variable,
        devanagari.variable,
        "h-full antialiased",
      )}
    >
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      <body className="flex min-h-svh w-full flex-col">
        <AnalyticsEvents />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
