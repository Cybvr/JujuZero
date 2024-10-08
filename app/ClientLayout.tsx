"use client";

import './globals.css';
import React, { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wand2, User, Plus, MessageSquare, FolderIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import QuestionButton from '@/components/dashboard/QuestionButton';
import Script from 'next/script';
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
  const shouldHideFooter = pathname === '/dashboard/projects';

  if (shouldHideFooter) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 md:hidden">
      <div className="flex justify-around items-center">
        <FooterMenuItem href="/dashboard" icon={Home} label="Home" />
        <FooterMenuItem href="/dashboard/tools" icon={Wand2} label="Apps" />
        <FooterMenuItem href="/dashboard/documents" icon={FolderIcon} label="Documents" />
        <FooterMenuItem href="/dashboard/projects" icon={MessageSquare} label="Projects" />
      </div>
    </nav>
  );
};

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="font-geist">
      <body className="bg-background text-foreground">
        <Script
          src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <div className="pb-16 md:pb-0">
                {children}
              </div>
              <FooterMenu />
              <div className="hidden md:block">
                <QuestionButton />
              </div>
              <Toaster />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}