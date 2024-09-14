'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HelpCategory {
  id: string;
  title: string;
  summary: string;
  categories: string[];
}

export default function Help() {
  const [helpCategories, setHelpCategories] = useState<HelpCategory[]>([]);

  useEffect(() => {
    const fetchHelpCategories = async () => {
      const q = query(collection(db, "help_pages"), orderBy("sortOrder", "asc"), limit(4));
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        summary: doc.data().content.intro.slice(0, 100) + '...', // Create a brief summary
        categories: doc.data().categories,
      }));
      setHelpCategories(categories);
    };

    fetchHelpCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-xl font-bold mb-2">Help Center</h1>
      <p className="text-muted-foreground mb-6 text-sm">Find answers to your questions and learn how to make the most of Juju.</p>
      <Separator className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpCategories.map((category) => (
          <Link href={`/help/${category.id}`} key={category.id}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">{category.summary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {category.categories.map((cat, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">Need more help?</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          If you can't find what you're looking for, our support team is here to assist you.
        </p>
        <Link href="/support" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm">
          Contact Support
        </Link>
      </div>
    </div>
  );
}