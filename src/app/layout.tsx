import type { Metadata } from "next";
import { IBM_Plex_Sans, Syne } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/providers/AppProviders";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jeethesh Reddy · Software / AI Engineer",
    template: "%s · Jeethesh Reddy",
  },
  description:
    "Portfolio of Jeethesh Reddy Gattupalli Singalreddy — Software / AI Engineer building distributed systems and grounded AI products.",
  metadataBase: new URL("https://vectorvoyager358.github.io"),
  openGraph: {
    title: "Jeethesh Reddy · Software / AI Engineer",
    description:
      "Distributed systems, production RAG, realtime voice AI, and a grounded portfolio assistant.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeethesh Reddy · Software / AI Engineer",
    description:
      "Software / AI Engineer portfolio with selected work, experience, and Ask Jeethesh.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${ibmPlex.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
