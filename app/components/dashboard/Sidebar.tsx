'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HomeIcon, CompassIcon, FolderIcon, MenuIcon, HelpCircle, PanelLeftOpen, PanelLeftClose, FileIcon, Star, List, User, Briefcase, Moon, Sun, FileText, MessageSquare } from 'lucide-react'; 
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePricingDialog } from '@/context/PricingDialogContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

const discover = [
  { name: 'Discover', icon: CompassIcon, path: '/dashboard/tools' },
];

const folders = [
  { name: 'Documents', icon: FolderIcon, path: '/dashboard/documents' },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

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
      alt="Logo" 
      width={96} 
      height={24} 
      className="w-24 h-6 object-contain"
    />
  );
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { setIsPricingOpen } = usePricingDialog();
  const { user } = useAuth();
  const [myList, setMyList] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMyList = JSON.parse(localStorage.getItem('myList') || '[]');
      setMyList(savedMyList);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const isActive = (path: string) => pathname === path;
  const buttonClasses = (path: string) => `w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} ${isActive(path) ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`;
  const iconClasses = (path: string) => `h-4 w-4 ${isActive(path) ? 'text-secondary-foreground' : 'text-muted-foreground'}`;

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderNavItems = () => (
    <>
      <Link href="/dashboard" className={buttonClasses('/dashboard')}>
        <Button variant="ghost" className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`} onClick={handleLinkClick}>
          <HomeIcon className={iconClasses('/dashboard')} />
          {isSidebarOpen && <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-small">Home</span>}
        </Button>
      </Link>
      <Separator className="my-2" />
      {discover.map((item) => (
        <Link key={item.path} href={item.path} className={buttonClasses(item.path)}>
          <Button variant="ghost" className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`} onClick={handleLinkClick}>
            <item.icon className={iconClasses(item.path)} />
            {isSidebarOpen && <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-small">{item.name}</span>}
          </Button>
        </Link>
      ))}
      <Link href="/dashboard/tools/myTools" className={buttonClasses('/dashboard/tools/myList')}>
        <Button variant="ghost" className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`} onClick={handleLinkClick}>
          <List className={iconClasses('/dashboard/tools/myList')} />
          {isSidebarOpen && <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-small">My Apps</span>}
        </Button>
      </Link>
      <Link href="/dashboard/sidekick" className={buttonClasses('/dashboard/sidekick')}>
        <Button variant="ghost" className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`} onClick={handleLinkClick}>
          <MessageSquare className={iconClasses('/dashboard/sidekick')} />
          {isSidebarOpen && <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-small">Sidekick</span>}
        </Button>
      </Link>
      <Separator className="my-2" />
      {folders.map((item) => (
        <Link key={item.path} href={item.path} className={buttonClasses(item.path)}>
          <Button variant="ghost" className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`} onClick={handleLinkClick}>
            <item.icon className={iconClasses(item.path)} />
            {isSidebarOpen && <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-small">{item.name}</span>}
          </Button>
        </Link>
      ))}
      <Link href="/dashboard/projects" className={buttonClasses('/dashboard/projects')}>
        <Button variant="ghost" className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`} onClick={handleLinkClick}>
          <Briefcase className={iconClasses('/dashboard/projects')} />
          {isSidebarOpen && <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-small">Projects</span>}
        </Button>
      </Link>
    </>
  )

  return (
    <>
      <div className="md:hidden flex justify-between p-2 border-b items-center fixed top-0 left-0 right-0 bg-background z-20">
        <Link href="/dashboard" className="flex items-center">
          <LogoWrapper />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {renderNavItems()}
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
      {!isMobile && (
        <aside className={`hidden md:flex flex-col h-full transition-all ${isSidebarOpen ? 'w-64' : 'w-16'} border-r bg-background`}>
          <div className="p-4 border-b flex justify-between items-center">
            {isSidebarOpen && (
              <Link href="/dashboard" className="flex-shrink-0">
                <LogoWrapper />
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`text-muted-foreground hover:text-foreground ${isSidebarOpen ? '' : 'mx-auto'}`}>
              {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
          </div>
          <ScrollArea className="flex-grow">
            <div className="p-2 space-y-1">
              {renderNavItems()}
            </div>
          </ScrollArea>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between mt-2">
              {isSidebarOpen && (
                <span className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              )}
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} className={isSidebarOpen ? '' : 'mx-auto'} />
            </div>
            {isSidebarOpen && (
              <div className="mt-2 flex justify-between items-center text-small text-muted-foreground">
                <div className="flex space-x-2">
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  )
}