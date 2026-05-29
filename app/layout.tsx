import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Rapport Cybersécurité 2026 — EHPAD Les 7 Fontaines',
  description:
    'Diagnostic cybersécurité interactif — EHPAD Les 7 Fontaines, France Horizon, Gaillac (81). Mai 2026.',
  authors: [{ name: 'Dhouha Dahen' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-page-bg">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}