"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
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