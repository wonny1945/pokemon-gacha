import type { Metadata } from "next";
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import "./globals.css";

export const metadata: Metadata = {
    title: 'Pokemon Gacha Game',
    description: 'Draw your own special Pokemon!',
    openGraph: {
        title: 'Pokemon Gacha Game',
        description: 'Draw your own special Pokemon!',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Pokemon Gacha Game Preview',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pokemon Gacha Game',
        description: 'Draw your own special Pokemon!',
        images: ['/images/og-image.png'],
    },
    icons: {
        icon: [
            {
                url: '/favicon.svg',
                type: 'image/svg+xml',
            },
        ],
        shortcut: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
        apple: [
            {
                url: '/favicon.svg',
                type: 'image/svg+xml',
            },
        ],
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link 
          rel="icon" 
          href="/favicon.svg" 
          type="image/svg+xml"
        />
      </head>
      <body className="bg-gradient-to-b from-emerald-200 via-green-400 to-emerald-600">
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
