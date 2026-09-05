import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* Inter is a drop-in stand-in for Apple's SF Pro. It loads here at the
   layout level so the whole app shares one font instance. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// PLACEHOLDER: swap juliusmatro.dev below for the real production domain.
export const metadata: Metadata = {
  metadataBase: new URL("https://juliusmatro.dev"),
  title: "Julius Matro — Software Developer",
  description:
    "Julius Matro is a full-time software developer based in the Philippines, building fast, reliable native and cross-platform software for Android, iOS, macOS, and the web — engineered to make businesses faster.",
  authors: [{ name: "Julius Matro" }],
  keywords: [
    "software developer",
    "cross-platform development",
    "Android",
    "iOS",
    "macOS",
    "desktop software",
    "web development",
    "Philippines",
    "workflow automation",
  ],
  robots: { index: true, follow: true },
  icons: {
    // Adaptive circuit-board icon: ink on light, white on dark (SVG media
    // queries are honored by Chrome/Edge/Firefox; Safari uses the PNGs).
    icon: [
      {
        url: "/favicon-light.svg",
        sizes: "any",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.svg",
        sizes: "any",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Julius Matro",
    title: "Julius Matro — Software Developer",
    description:
      "Fast, reliable software for Android, iOS, macOS, and the web — built to make business faster.",
    url: "https://juliusmatro.dev",
  },
  twitter: {
    card: "summary",
    title: "Julius Matro — Software Developer",
    description:
      "Fast, reliable software for Android, iOS, macOS, and the web — built to make business faster.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d1d1f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full bg-white text-ink">{children}</body>
    </html>
  );
}