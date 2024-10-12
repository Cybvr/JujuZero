"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PricingDialog from '@/components/dashboard/PricingDialog';
import { PricingDialogProvider } from '@/context/PricingDialogContext';
import { useTheme } from 'next-themes';
import Script from 'next/script';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { theme, resolvedTheme } = useTheme();

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

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
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