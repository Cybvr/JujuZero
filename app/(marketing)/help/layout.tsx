'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScrollArea } from "@/components/ui/scroll-area";

interface HelpPage {
  id: string;
  title: string;
  sortOrder: number;
  categories: string[];
}

interface CategoryGroup {
  [category: string]: HelpPage[];
}

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchHelpPages = async () => {
      const q = query(collection(db, "help_pages"), orderBy("sortOrder", "asc"));
      const querySnapshot = await getDocs(q);
      const pages: HelpPage[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title as string,
        sortOrder: doc.data().sortOrder as number,
        categories: doc.data().categories as string[] || [],
      }));

      const groups: CategoryGroup = {};
      pages.forEach(page => {
        if (page.categories.length === 0) {
          if (!groups['Uncategorized']) groups['Uncategorized'] = [];
          groups['Uncategorized'].push(page);
        } else {
          page.categories.forEach(category => {
            if (!groups[category]) groups[category] = [];
            groups[category].push(page);
          });
        }
      });

      setCategoryGroups(groups);
    };

    fetchHelpPages();
  }, []);

  const renderSidebar = () => (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Help Topics</h2>
        <nav>
          {categoryGroups && Object.entries(categoryGroups).map(([category, pages]) => (
            <div key={category} className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</h3>
              <ul className="space-y-1">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link 
                      href={`/help/${page.id}`}
                      className={`block p-2 rounded text-sm ${
                        pathname === `/help/${page.id}` 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'text-foreground hover:bg-secondary/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-4 text-foreground"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
      </button>

      {/* Sidebar for mobile */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {renderSidebar()}
      </aside>

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 border-r border-border">
        {renderSidebar()}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}