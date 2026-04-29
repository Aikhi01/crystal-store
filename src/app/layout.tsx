import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'lsle of Mist — Healing Crystal Bracelets · Where Nature Meets Calm',
    template: '%s | lsle of Mist',
  },
  description:
    'Handcrafted healing crystal bracelets made from ethically sourced natural gemstones. lsle of Mist — soothe anxiety, restore inner peace. Free shipping over $50.',
  keywords: ['healing crystals', 'crystal bracelet', 'lsle of Mist', 'amethyst bracelet', 'rose quartz', 'chakra bracelet', 'natural gemstone jewelry'],
    icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'lsle of Mist',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
