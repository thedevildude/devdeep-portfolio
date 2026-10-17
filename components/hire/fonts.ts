import { Barlow_Semi_Condensed } from "next/font/google";

/** Real light italic for highlighted headline phrases; only the hire and blog pages load it. */
export const barlowItalic = Barlow_Semi_Condensed({
  variable: "--font-barlow-italic",
  subsets: ["latin"],
  weight: "300",
  style: "italic",
  display: "swap",
});
