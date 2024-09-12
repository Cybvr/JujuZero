"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Help', href: '/help' },
  { name: 'FAQ', href: '/faq' },
];

const legalLinks = [
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Cookies', href: '/cookies' },
];

const toolLinks = [
  { name: 'QR Code Generator', href: '/dashboard/tools/qr-code-generator' },
  { name: 'Remove Background', href: '/dashboard/tools/remove-background' },
  { name: 'Compress Image', href: '/dashboard/tools/compress-image' },
  { name: 'Video to MP4', href: '/dashboard/tools/video-to-mp4' },
];

function LogoWrapper() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === 'dark' ? "/images/logoy.png" : "/images/logox.png";

  return (
    <Image 
      src={logoSrc}
      alt="JujuAGI Logo" 
      width={96} 
      height={24} 
      className="h-6 sm:h-6 md:h-6 w-auto"
    />
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Add Chatbase script
    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js?chatbotId=TB6IwCsYnWV0nUh-XJxPF";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log('Chatbase script loaded');
      window.embeddedChatbotConfig = {
        chatbotId: "TB6IwCsYnWV0nUh-XJxPF",
        domain: "www.chatbase.co"
      };
      console.log('Chatbase configuration set');
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-background shadow-sm border-b border-border z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-3 flex items-center justify-between">
            <div className="flex items-center px-2 sm:px-0">
              <Link href="/">
                <span className="sr-only">Juju</span>
                <LogoWrapper />
              </Link>
              <div className="hidden ml-10 space-x-8 lg:flex">
                {navigation.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium ${
                      pathname === link.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="ml-10 space-x-4 flex items-center">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="default" size="sm">
                    <LayoutDashboard className="mr-2 h-4 w-4 bg-violet-800" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="hidden sm:flex space-x-4">
                  <Link href="/login">
                    <Button variant="outline" size="sm">Sign in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="default" size="sm" className="bg-violet-800 hover:bg-violet-900 text-white">Get Started</Button>
                  </Link>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </nav>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">JujuAGI</span>
                  <LogoWrapper />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {user ? (
                      <Link href="/dashboard">
                        <Button variant="default" size="sm" className="w-full">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Go to Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/signup">
                        <Button variant="default" size="sm" className="w-full bg-violet-800 hover:bg-violet-900 text-white">Get Started</Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="w-full mt-2"
                    >
                      {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:max-w-md">
              <LogoWrapper />
              <p className="text-sm text-gray-400 mt-4">
                Juju is your all-in-one platform for file conversion and editing tasks. 
                We offer a suite of tools including PDF conversion, image editing, text tools, 
                data conversion, and AI-powered features.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">
                  Legal
                </h3>
                <ul className="space-y-2">
                  {legalLinks.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">
                  Tools
                </h3>
                <ul className="space-y-2">
                  {toolLinks.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-center text-sm text-gray-400">
              &copy; 2024 Juju, Inc. All rights reserved. Powered by VisualHQ
            </p>
          </div>
        </div>
      </footer>
      <div id="chatbase-widget"></div>
    </div>
  );
}