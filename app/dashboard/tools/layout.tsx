"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Breadcrumbs>
            {pathSegments.map((segment, index) => {
              const isActive = index === pathSegments.length - 1;
              return (
                <BreadcrumbItem key={index} isActive={isActive}>
                  <Link href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                    {segment}
                  </Link>
                </BreadcrumbItem>
              );
            })}
          </Breadcrumbs>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-1 px-6 rounded-md mt-6">
        {children}
      </main>

      <footer className="border-t border-border mt-6 py-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">Simple tools for charmers 👻</p>
        </div>
      </footer>
    </div>
  );
}