import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elite Properties | Design System Preview",
  description:
    "Internal design-system and motion foundation for Elite Properties in Vrindavan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
