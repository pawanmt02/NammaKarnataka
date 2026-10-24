import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ನಮ್ಮ ಕನ್ನಡ - Regional Language Explorer",
  description:
    "An interactive platform to explore, preserve, and celebrate Karnataka's rich linguistic diversity. Discover regional dialects, contribute phrases, play language quizzes, and explore the cultural heritage of Kannada.",
  keywords: [
    "Kannada",
    "Karnataka",
    "dialect",
    "regional language",
    "Dharwad",
    "Kundapura",
    "Havyaka",
    "Soliga",
    "cultural heritage",
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "ನಮ್ಮ ಕನ್ನಡ - Regional Language Explorer",
    description: "Explore Karnataka's linguistic diversity",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kn" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
