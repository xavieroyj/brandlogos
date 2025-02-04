import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavHeader from "@/components/shared/NavHeader";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BrandLogos",
  description: "Creating logos has never been easier",
  openGraph: {
    title: "BrandLogos",
    description: "Creating logos has never been easier",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "BrandLogos",
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="BrandLogos" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <NavHeader/>

        {/* Account for the nav height */}
        <main className="pt-16">
          {children}
        </main>

        <Footer />

        <Toaster />
      </body>
    </html>
  );
}