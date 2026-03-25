import type { Metadata, Viewport } from 'next'
import { Oswald } from 'next/font/google' 
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: 'OH Leuven Attendance AI',
  description: 'AI-powered matchday attendance prediction for OH Leuven',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#E20613',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* This line applies the font to the whole app */}
      <body className={`${oswald.variable} ${oswald.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
