"use client";

import './globals.css';
import React, { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import FeedbackDialog from '@/components/ui/FeedbackDialog';
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
        <Button className="bg-violet-800 text-white rounded-full shadow-md hover:shadow-lg transition-shadow" size="icon">
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

    const metaOgTitle = document.createElement('meta');
    metaOgTitle.setAttribute('property', 'og:title');
    metaOgTitle.content = 'Juju: Simple tools for everyone';
    document.head.appendChild(metaOgTitle);

    const metaOgDescription = document.createElement('meta');
    metaOgDescription.setAttribute('property', 'og:description');
    metaOgDescription.content = 'Updates from the shrine';
    document.head.appendChild(metaOgDescription);

    const metaOgImage = document.createElement('meta');
    metaOgImage.setAttribute('property', 'og:image');
    metaOgImage.content = '/images/logos/cover.png'; // Replace with the path to your thumbnail image
    document.head.appendChild(metaOgImage);

    const metaOgUrl = document.createElement('meta');
    metaOgUrl.setAttribute('property', 'og:url');
    metaOgUrl.content = 'https://jujuagi.com'; // Replace with your website's URL
    document.head.appendChild(metaOgUrl);

    const twitterCard = document.createElement('meta');
    twitterCard.name = 'twitter:card';
    twitterCard.content = 'summary_large_image';
    document.head.appendChild(twitterCard);

    const twitterTitle = document.createElement('meta');
    twitterTitle.name = 'twitter:title';
    twitterTitle.content = 'Juju: Simple tools for everyone';
    document.head.appendChild(twitterTitle);

    const twitterDescription = document.createElement('meta');
    twitterDescription.name = 'twitter:description';
    twitterDescription.content = 'Updates from the shrine';
    document.head.appendChild(twitterDescription);

    const twitterImage = document.createElement('meta');
    twitterImage.name = 'twitter:image';
    twitterImage.content = '/images/marketing/feature1.png'; // Replace with the path to your thumbnail image
    document.head.appendChild(twitterImage);

    const twitterUrl = document.createElement('meta');
    twitterUrl.name = 'twitter:url';
    twitterUrl.content = 'https://yourwebsite.com'; // Replace with your website's URL
    document.head.appendChild(twitterUrl);

    return () => {
      document.head.removeChild(metaDescription);
      document.head.removeChild(linkManifest);
      document.head.removeChild(metaThemeColor);
      document.head.removeChild(metaViewport);
      document.head.removeChild(metaOgTitle);
      document.head.removeChild(metaOgDescription);
      document.head.removeChild(metaOgImage);
      document.head.removeChild(metaOgUrl);
      document.head.removeChild(twitterCard);
      document.head.removeChild(twitterTitle);
      document.head.removeChild(twitterDescription);
      document.head.removeChild(twitterImage);
      document.head.removeChild(twitterUrl);
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
            <div className="pb-16 md:pb-0">
              {children}
            </div>
            <FooterMenu />
            <QuestionButton />
            <FeedbackDialog isOpen={false} onClose={() => {}} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}