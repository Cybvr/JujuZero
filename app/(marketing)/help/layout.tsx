'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-64 bg-gray-100 p-4 md:p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Help Topics</h2>
        <nav>
          {categoryGroups && Object.entries(categoryGroups).map(([category, pages]) => (
            <div key={category} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{category}</h3>
              <ul className="space-y-1">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link 
                      href={`/help/${page.id}`}
                      className={`block p-2 rounded text-sm ${
                        pathname === `/help/${page.id}` ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                      }`}
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}