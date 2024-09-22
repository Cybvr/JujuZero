"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import Footer from '@/(marketing)/components/Footer'; // Import the Footer component

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Breadcrumbs>
            {pathSegments.map((segment, index) => {
              const isActive = index === pathSegments.length - 1;
              return (
                <BreadcrumbItem key={index} isActive={isActive}>
                  <Link 
                    href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                    className={`text-sm ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </Link>
                </BreadcrumbItem>
              );
            })}
          </Breadcrumbs>
        </div>
      </header>
      <main className="flex-grow container mx-auto py-6 px-6 bg-background">
        {children}
      </main>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}