"use client";

import './globals.css';
import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import FeedbackDialog from '@/components/ui/FeedbackDialog';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wand2, User, Plus, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import QuestionButton from '@/components/dashboard/QuestionButton';
import Script from 'next/script';

const FooterMenuItem = ({ href, icon: Icon, label, isRounded = false }: { href: string; icon: React.ElementType; label?: string; isRounded?: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex flex-col items-center justify-center space-y-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      {isRounded ? (
        <Button
          className="bg-violet-800 text-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          size="icon"
        >
          <Icon className="w-6 h-6" />
        </Button>
      ) : (
        <>
          <Icon className="w-5 h-5" />
          {label && <span className="text-xs">{label}</span>}
        </>
      )}
    </Link>
  );
};

const FooterMenu = () => {
  const pathname = usePathname();
  const shouldHideFooter = pathname === '/dashboard/sidekick';

  if (shouldHideFooter) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 md:hidden">
      <div className="flex justify-around items-center">
        <FooterMenuItem href="/dashboard" icon={Home} label="Home" />
        <FooterMenuItem href="/dashboard/tools" icon={Wand2} label="Tools" />
        <FooterMenuItem href="/dashboard/projects/new" icon={Plus} isRounded={true} />
        <FooterMenuItem href="/dashboard/sidekick" icon={MessageSquare} label="Sidekick" />
        <FooterMenuItem href="/dashboard/account" icon={User} label="Account" />
      </div>
    </nav>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsBrowser(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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

    if (typeof window !== 'undefined' && 'PusherPushNotifications' in window) {
      const beamsClient = new (window as any).PusherPushNotifications.Client({
        instanceId: '2e5482d3-7571-44eb-b157-b9cc5f37662b',
      });

      beamsClient.start()
        .then(() => beamsClient.addDeviceInterest('hello'))
        .then(() => console.log('Successfully registered and subscribed!'))
        .catch(console.error);
    }

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
        <Script
          src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"
          strategy="beforeInteractive"
        />
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
              <>
                <div className="pb-16 md:pb-0">
                  {children}
                </div>
                <FooterMenu />
                {isBrowser && pathname !== '/dashboard/sidekick' && <QuestionButton />}
              </>
            )}
            <FeedbackDialog
              isOpen={isFeedbackDialogOpen}
              onClose={() => setIsFeedbackDialogOpen(false)}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}