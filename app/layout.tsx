import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Gateway Chat',
  description: 'Multi-provider AI chat application using Vercel AI Gateway',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
