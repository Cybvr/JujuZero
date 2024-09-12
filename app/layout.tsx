"use client";

import './globals.css';
import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import FeedbackDialog from '@/components/ui/FeedbackDialog';
import { Skeleton } from "@/components/ui/skeleton";

// Note: Metadata can't be used in a Client Component, so we'll need to handle it differently

interface EmbeddedChatbotConfig {
  chatbotId: string;
  domain: string;
}

declare global {
  interface Window {
    embeddedChatbotConfig?: EmbeddedChatbotConfig;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this time as needed

    // Load the Chatbase script immediately
    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js?chatbotId=TB6IwCsYnWV0nUh-XJxPF";
    script.async = true;
    document.body.appendChild(script);

    // Set up the configuration after the script has loaded
    script.onload = () => {
      console.log('Chatbase script loaded');
      window.embeddedChatbotConfig = {
        chatbotId: "TB6IwCsYnWV0nUh-XJxPF",
        domain: "www.chatbase.co"
      };
      console.log('Chatbase configuration set');
    };

    return () => {
      clearTimeout(timer);
      // Remove the script when the component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Since we're in a Client Component, we need to manually add the metadata
  useEffect(() => {
    document.title = 'Juju: Simple tools for everyone';
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Updates from the shrine';
    document.head.appendChild(metaDescription);

    const linkManifest = document.createElement('link');
    linkManifest.rel = 'manifest';
    linkManifest.href = '/manifest.json';
    document.head.appendChild(linkManifest);

    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#ffffff';
    document.head.appendChild(metaThemeColor);

    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    document.head.appendChild(metaViewport);

    return () => {
      if (document.head.contains(metaDescription)) {
        document.head.removeChild(metaDescription);
      }
      if (document.head.contains(linkManifest)) {
        document.head.removeChild(linkManifest);
      }
      if (document.head.contains(metaThemeColor)) {
        document.head.removeChild(metaThemeColor);
      }
      if (document.head.contains(metaViewport)) {
        document.head.removeChild(metaViewport);
      }
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className="font-geist">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {isLoading ? (
              <div className="p-8">
                <Skeleton className="w-full h-12 mb-4" />
                <Skeleton className="w-3/4 h-8 mb-4" />
                <Skeleton className="w-1/2 h-8 mb-4" />
                <Skeleton className="w-full h-64" />
              </div>
            ) : (
              children
            )}
            <FeedbackDialog
              isOpen={isFeedbackDialogOpen}
              onClose={() => setIsFeedbackDialogOpen(false)}
            />
            {/* Add this div for Chatbase */}
            <div id="chatbase-widget"></div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}