"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AUPPage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=aup');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched content:", data);

        let parsedContent = data.content;
        if (typeof parsedContent === 'string') {
          try {
            parsedContent = JSON.parse(parsedContent);
          } catch (e) {
            console.error("Error parsing JSON content:", e);
          }
        }
        if (parsedContent && typeof parsedContent === 'object' && parsedContent.value) {
          parsedContent = parsedContent.value;
        }
        setContent(parsedContent || '');
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Error loading content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 max-w-4xl text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Acceptable Use Policy</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Acceptable Use Policy</CardTitle>
        </CardHeader>
        <CardContent>
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p>No content available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}