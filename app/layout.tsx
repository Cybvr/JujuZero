"use client";

import './globals.css';
import React, { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wand2, User, Plus, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import QuestionButton from '@/components/dashboard/QuestionButton';
import Script from 'next/script';
import GoogleTag from '@/components/GoogleTag';
import usePageTracking from '@/hooks/usePageTracking';
import Head from 'next/head';
import { Toaster } from "@/components/ui/toaster";

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
  usePageTracking();

  return (
    <html lang="en" suppressHydrationWarning className="font-geist">
      <Head>
        <title>Juju: Simple tools for simple tasks</title>
        <meta name="description" content="Juju is your all-in-one platform for file conversion and editing tasks. We offer a suite of tools including PDF conversion, image editing, text tools, data conversion, and AI-powered features." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="Juju: Simple tools for simple tasks" />
        <meta property="og:description" content="Juju is your all-in-one platform for file conversion and editing tasks. We offer a suite of tools including PDF conversion, image editing, text tools, data conversion, and AI-powered features." />
        <meta property="og:image" content="https://jujuagi.com/images/logos/cover.png" />
        <meta property="og:url" content="https://jujuagi.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Juju: Simple tools for everyone" />
        <meta name="twitter:description" content="Juju is your all-in-one platform for file conversion and editing tasks. We offer a suite of tools including PDF conversion, image editing, text tools, data conversion, and AI-powered features." />
        <meta name="twitter:image" content="https://jujuagi.com/images/marketing/feature1.png" />
        <meta name="twitter:url" content="https://jujuagi.com" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>
      <body className="bg-background text-foreground">
        <GoogleTag />
        <Script
          src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="pb-16 md:pb-0">
              {children}
            </div>
            <FooterMenu />
            <QuestionButton />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}