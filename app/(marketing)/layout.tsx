"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Moon, Sun, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';
import NavigationMenuWrapper from './components/NavigationMenuWrapper';
import Footer from './components/Footer';

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
      alt="Juju Logo" 
      width={96} 
      height={24} 
      className="h-6 sm:h-6 md:h-6 w-auto"
    />
  );
}

const navigation = [
  { name: 'Tools', href: '#', dropdown: true },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Help', href: '/help' },
  { name: 'FAQ', href: '/faq' },
];

const tools = [
  { name: 'Grammar Checker', slug: 'grammar-checker', description: 'Check and improve your text\'s grammar.' },
  { name: 'Paraphraser', slug: 'paraphraser', description: 'Rephrase your text in different styles with AI.' },
  { name: 'Text Summarizer', slug: 'text-summarizer', description: 'Quickly summarize long texts with AI.' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create custom QR codes easily.' },
  { name: 'Remove Background', slug: 'remove-background', description: 'Easily remove image backgrounds.' },
  { name: 'Compress Image', slug: 'compress-image', description: 'Reduce image file size without losing quality.' },
  { name: 'Video to MP4', slug: 'video-to-mp4', description: 'Convert various video formats to MP4.' },
  { name: 'Audio to MP3', slug: 'audio-to-mp3', description: 'Convert audio files to MP3 format.' },
];

const groupedTools = {
  'Text Tools': tools.slice(0, 3),
  'Image Tools': tools.slice(3, 6),
  'Conversion Tools': tools.slice(6),
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsSubmenuOpen, setToolsSubmenuOpen] = useState(false);
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
      window.embeddedChatbotConfig = {
        chatbotId: "TB6IwCsYnWV0nUh-XJxPF",
        domain: "www.chatbase.co"
      };
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
              <div className="hidden lg:flex items-center ml-6">
                <NavigationMenuWrapper />
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
          <div className="lg:hidden z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="fixed inset-y-0 right-0 w-full sm:max-w-sm p-6 bg-background">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Juju</span>
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
              <div className="mt-6">
                <div className="divide-y divide-border space-y-6 pb-6">
                  {navigation.map((item) => (
                    item.dropdown ? (
                      <div key={item.name}>
                        <button
                          onClick={() => setToolsSubmenuOpen(!toolsSubmenuOpen)}
                          className="flex justify-between w-full items-center py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted rounded-lg pr-3"
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${toolsSubmenuOpen ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                        {toolsSubmenuOpen && (
                          <div className="mt-2 pl-4">
                            {Object.entries(groupedTools).map(([category, categoryTools]) => (
                              <div key={category} className="mb-4">
                                <h3 className="mb-2 text-sm font-medium text-muted-foreground">{category}</h3>
                                <ul className="space-y-1">
                                  {categoryTools.map((tool) => (
                                    <li key={tool.slug}>
                                      <Link
                                        href={`/dashboard/tools/${tool.slug}`}
                                        className="block text-sm leading-7 text-foreground hover:bg-muted rounded-lg py-1 pl-6 pr-3"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {tool.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted rounded-lg px-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                  {user ? (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="default" size="sm" className="w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full mb-2">Sign in</Button>
                      </Link>
                      <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="default" size="sm" className="w-full bg-violet-800 hover:bg-violet-900 text-white">Get Started</Button>
                      </Link>
                    </>
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
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <div id="chatbase-widget"></div>
    </div>
  );
}