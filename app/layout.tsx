"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { PricingDialogProvider } from '@/context/PricingDialogContext';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="space-y-4 w-[300px]">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PricingDialogProvider>
            {isLoading ? <LoadingScreen /> : children}
            <Toaster />
          </PricingDialogProvider>
        </AuthProvider>
        <Script id="chatbase-widget" strategy="afterInteractive">
          {`
            window.embeddedChatbotConfig = {
              chatbotId: "TB6IwCsYnWV0nUh-XJxPF",
              domain: "www.chatbase.co"
            }
          `}
        </Script>
        <Script
          src="https://www.chatbase.co/embed.min.js"
          chatbotId="TB6IwCsYnWV0nUh-XJxPF"
          domain="www.chatbase.co"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}