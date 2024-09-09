"use client";

import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Delay loading of the Chatbase script
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.src = "https://www.chatbase.co/embed.min.js?chatbotId=TB6IwCsYnWV0nUh-XJxPF";
      script.async = true;
      document.body.appendChild(script);

      // Set up the configuration after the script has loaded
      script.onload = () => {
        window.embeddedChatbotConfig = {
          chatbotId: "TB6IwCsYnWV0nUh-XJxPF",
          domain: "www.chatbase.co"
        };
      };
    }, 5000); // Load after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className="font-geist">
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}