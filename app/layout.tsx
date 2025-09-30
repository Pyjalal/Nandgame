import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Logic Gates Puzzle - Computer Science Society',
  description: 'Learn digital logic through interactive puzzles. Build circuits with AND, OR, XOR, and NOT gates.',
  keywords: 'logic gates, digital logic, puzzle game, educational, Computer Science Society, Nottingham',
  authors: [{ name: 'Computer Science Society of Nottingham' }],
  openGraph: {
    title: 'Logic Gates Puzzle',
    description: 'Master digital logic through interactive circuit puzzles',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-charcoal via-violet/80 to-lavender/40">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}
