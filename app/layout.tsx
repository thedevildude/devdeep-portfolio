import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Hepta_Slab } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import SmoothScroll from "@/components/ui/SmoothScroll";

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
      className={`${barlow.variable} ${heptaSlab.variable} h-full antialiased`}
    >
      <body className="flex min-h-svh w-full flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
