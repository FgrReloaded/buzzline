import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discord Clone',
  description: 'Clone of Discord made using Next.js and TailwindCSS with TypeScript and Shadcn/ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider >
      <html lang="en">
        <body className={font.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
