'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HelpPageData {
  title: string;
  categories: string[];
  content: {
    intro: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
}

export default function HelpPage() {
  const { pageId } = useParams();
  const [pageData, setPageData] = useState<HelpPageData>({
    title: '',
    categories: [],
    content: { intro: '', sections: [] }
  });

  useEffect(() => {
    const fetchContent = async () => {
      if (typeof pageId !== 'string') return;

      const docRef = doc(db, 'help_pages', pageId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPageData({
          title: data.title || '',
          categories: data.categories || [],
          content: {
            intro: data.content?.intro || '',
            sections: data.content?.sections || []
          }
        });
      } else {
        console.log("No such document!");
      }
    };

    fetchContent();
  }, [pageId]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{pageData.title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {pageData.categories.map((category, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {category}
          </span>
        ))}
      </div>

      <div dangerouslySetInnerHTML={{ __html: pageData.content.intro }} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pageData.content.sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}