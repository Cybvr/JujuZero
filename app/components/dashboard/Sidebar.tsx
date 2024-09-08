'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HomeIcon, CompassIcon, FolderIcon, MenuIcon, HelpCircle, PanelLeftOpen, PanelLeftClose, FileIcon, Star, List, User, Briefcase } from 'lucide-react'; 
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { usePricingDialog } from '@/context/PricingDialogContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

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

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setIsPricingOpen } = usePricingDialog();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [myList, setMyList] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedMyList = JSON.parse(localStorage.getItem('myList') || '[]');
    setFavorites(savedFavorites);
    setMyList(savedMyList);
  }, []);

  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);

  const isActive = (path: string) => pathname === path;
  const buttonClasses = (path: string) => `w-full justify-start ${isActive(path) ? 'bg-blue-100 dark:bg-blue-900' : ''}`;
  const iconClasses = (path: string) => `text-blue-500 ${isActive(path) ? 'text-blue-700 dark:text-blue-300' : ''}`;

  const renderNavItems = () => (
    <>
      <Link href="/dashboard" passHref legacyBehavior>
        <a>
          <Button variant="ghost" className={buttonClasses('/dashboard')}>
            <HomeIcon className={`mr-2 h-4 w-4 ${iconClasses('/dashboard')}`} />
            {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Home</span>}
          </Button>
        </a>
      </Link>
      <Separator className="my-2" />
      {discover.map((item) => (
        <Link key={item.path} href={item.path} passHref legacyBehavior>
          <a>
            <Button variant="ghost" className={buttonClasses(item.path)}>
              <item.icon className={`mr-2 h-4 w-4 ${iconClasses(item.path)}`} />
              {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>}
            </Button>
          </a>
        </Link>
      ))}
      <Link href="/dashboard/tools/myTools" passHref legacyBehavior>
        <a>
          <Button variant="ghost" className={buttonClasses('/dashboard/tools/myList')}>
            <List className={`mr-2 h-4 w-4 ${iconClasses('/dashboard/tools/myList')}`} />
            {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap overflow-hidden text-ellipsis">My Tools</span>}
          </Button>
        </a>
      </Link>
      <Separator className="my-2" />
      {folders.map((item) => (
        <Link key={item.path} href={item.path} passHref legacyBehavior>
          <a>
            <Button variant="ghost" className={buttonClasses(item.path)}>
              <item.icon className={`mr-2 h-4 w-4 ${iconClasses(item.path)}`} />
              {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>}
            </Button>
          </a>
        </Link>
      ))}
      <Link href="/dashboard/projects" passHref legacyBehavior>
        <a>
          <Button variant="ghost" className={buttonClasses('/dashboard/projects')}>
            <Briefcase className={`mr-2 h-4 w-4 ${iconClasses('/dashboard/projects')}`} />
            {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Projects</span>}
          </Button>
        </a>
      </Link>
      {(isSidebarOpen || isMobile) && (
        <>
          <Separator className="my-2" />
          <div className="px-3 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">⭐ Favorite Tools</h2>
            <ScrollArea className="h-[100px]">
              {favorites.length > 0 ? (
                favorites.map((slug) => (
                  <Link key={slug} href={`/dashboard/tools/${slug}`} passHref legacyBehavior>
                    <a>
                      <Button variant="ghost" className="w-full justify-start">
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{slug}</span>
                      </Button>
                    </a>
                  </Link>
                ))
              ) : (
                <p className="text-xs px-2">No favorite tools</p>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </>
  )

  return (
    <>
      <div className="md:hidden flex justify-between p-2 border-b items-center fixed top-0 left-0 right-0 bg-gray-100 dark:bg-[#1e1e1e] z-20">
        <Link href="/dashboard" className="flex items-center">
          <Image 
            src="/images/logox.png" 
            alt="Logo" 
            width={96} 
            height={24} 
            className="w-24 h-6 object-contain"
          />
        </Link>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={handleDropdownToggle} className="mr-2">
            {isDropdownOpen ? <PanelLeftClose className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </Button>
          <Link href="/dashboard/account">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      {isMobile && (
        <div className={`md:hidden fixed top-12 left-0 right-0 bg-gray-100 dark:bg-[#1e1e1e] p-4 pb-0 space-y-0 z-30 transition-all ${isDropdownOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
          {renderNavItems()}
        </div>
      )}
      {!isMobile && (
        <aside className={`hidden md:flex flex-col h-full transition-all ${isSidebarOpen ? 'w-64' : 'w-16'} border-r bg-gray-100 dark:bg-[#1e1e1e]`}>
          <div className="p-4 border-b flex justify-between items-center">
            {isSidebarOpen && (
              <Link href="/dashboard" className="flex-shrink-0">
                <Image
                  src="/images/logox.png" 
                  alt="Logo" 
                  width={96} 
                  height={24} 
                  className="w-24 h-6 object-contain"
                />
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={isSidebarOpen ? '' : 'mx-auto'}>
              {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
          </div>
          <ScrollArea className="flex-grow">
            <div className="p-2 space-y-1">
              {renderNavItems()}
            </div>
          </ScrollArea>
          <div className="p-4 border-t mt-auto">
            {isSidebarOpen && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2">👋 Try Pro!  Upgrade for more tools and task assistants.</p>
                  <Button variant="default" size="sm" className="w-full" onClick={() => setIsPricingOpen(true)}>
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            )}
            <Link href="/help" passHref legacyBehavior>
              <Button variant="ghost" size="default" className="w-full justify-start">
                <HelpCircle className="mr-2 h-4 w-4 text-blue-500" />
                {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Support</span>}
              </Button>
            </Link>

            {(isSidebarOpen || isMobile) && (
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <div className="flex space-x-2">
                  <Link href="/about">About</Link>
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  )
}