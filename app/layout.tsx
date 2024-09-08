"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Script id="chatbase-widget" strategy="afterInteractive">
          {`
            window.embeddedChatbotConfig = {
              chatbotId: "TB6IwCsYnWV0nUh-XJxPF",
              domain: "www.chatbase.co"
            }
          `}
        </Script>
        <Script src="https://www.chatbase.co/embed.min.js?chatbotId=TB6IwCsYnWV0nUh-XJxPF" strategy="afterInteractive" />
      </body>
    </html>
  );
}