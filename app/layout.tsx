import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-providers'
import { cn } from '@/lib/utils'
import ModalProvider from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import QueryProvider from '@/components/providers/query-provider'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buzzline - A Discord Clone',
  description: 'Clone of Discord made using Next.js and TailwindCSS with TypeScript and Shadcn/ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider >
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-gray-800")}>
          <ThemeProvider attribute="class"
            defaultTheme="light"
            storageKey='buzzline-theme'
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
