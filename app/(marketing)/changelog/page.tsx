// @app/(marketing)/changelog/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ChangelogEntry {
  id: string;
  name: string;
  categories: string[];
  content: string;
  images: string[];
  isPublished: boolean;
  updatedAt: Timestamp;
}

export default function ChangelogPage() {
  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    const fetchChangelogEntries = async () => {
      try {
        const q = query(
          collection(db, "changelog"),
          orderBy("updatedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            categories: data.categories,
            content: data.content,
            images: data.images,
            isPublished: data.isPublished,
            updatedAt: data.updatedAt,
          } as ChangelogEntry;
        });
        setChangelogEntries(entries.filter(entry => entry.isPublished));
      } catch (error) {
        console.error("Error fetching changelog entries:", error);
      }
    };
    fetchChangelogEntries();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl text-gray-700 dark:text-gray-300">
      <h1 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">JujuDrops</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Updates from the shrine</p>
      {changelogEntries.map((entry, index) => (
        <React.Fragment key={entry.id}>
          {index > 0 && <Separator className="my-8" />}
          <div className="overflow-hidden">
            <div className="p-6">
              <div className="flex">
                <div className="w-1/4 pr-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.updatedAt instanceof Timestamp 
                      ? entry.updatedAt.toDate().toLocaleDateString()
                      : new Date(entry.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="w-3/4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {entry.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="text-gray-600 dark:text-gray-300">{category}</Badge>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{entry.name}</h2>
                  <div 
                    className="prose dark:prose-invert max-w-none mb-4 text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: entry.content }} 
                  />
                  {entry.images && entry.images.length > 0 && (
                    <div className="mt-4">
                      <img 
                        src={entry.images[0]} 
                        alt={`Changes in ${entry.name}`} 
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}