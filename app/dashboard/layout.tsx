"use client";
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PricingDialog from '@/components/dashboard/PricingDialog';
import { PricingDialogProvider } from '@/context/PricingDialogContext';
import { useTheme } from 'next-themes';
import Script from 'next/script';
import { FaPlus } from 'react-icons/fa';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    // Check the screen size on initial load
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Update theme color
    const updateThemeColor = () => {
      const themeColor = resolvedTheme === 'dark' ? '#000000' : '#ffffff';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    };
    updateThemeColor();

    // Handle click outside dropdown to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [resolvedTheme]);

  return (
    <PricingDialogProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isSmallScreen && <DashboardHeader />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            {children}
          </main>
          {isSmallScreen && (
            <div className="fixed bottom-6 right-6" ref={dropdownRef}>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[#5c20b8] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center focus:outline-none"
                >
                  <FaPlus className="w-5 h-5 text-normal" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute bottom-16 right-0 bg-white text-black rounded-lg shadow-md w-48 py-2">
                    <a href="/dashboard/documents/new" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">New Document</a>
                    <a href="/dashboard/projects/new" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">New Project</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <PricingDialog />
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
      />
    </PricingDialogProvider>
  );
}