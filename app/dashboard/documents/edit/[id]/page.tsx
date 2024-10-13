'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { doc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs'
import { ChevronLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from "@/components/ui/skeleton"
import CustomEditor from '../../../../components/dashboard/CustomEditor'

export default function DocumentEditPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { id } = params
  const { user } = useAuth();
  const { toast } = useToast()

  useEffect(() => {
    if (user === null) {
      toast({
        title: "Authentication required",
        description: "Please log in to edit documents",
        variant: "destructive",
      });
      router.push('/login');
    } else if (id !== 'new') {
      fetchDocument();
    } else {
      setIsLoading(false);
    }
  }, [id, user, router, toast]);

  const fetchDocument = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "documents", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setContent(data.content);
      } else {
        toast({
          title: "Document not found",
          description: "The requested document does not exist.",
          variant: "destructive",
        });
        router.push('/dashboard/documents');
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      toast({
        title: "Error",
        description: "Failed to load document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = useCallback((newContent: string) => {
    setContent(newContent)
    debouncedSave(newContent, title)
  }, [title])

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    debouncedSave(content, newTitle)
  }, [content])

  const saveDocument = async (contentToSave: string, titleToSave: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save changes",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    try {
      const docRef = id === 'new' 
        ? doc(collection(db, "documents")) 
        : doc(db, "documents", id);

      const documentData = {
        title: titleToSave,
        content: contentToSave,
        userId: user.uid,
        lastModified: new Date().toISOString()
      };

      if (id === 'new') {
        await setDoc(docRef, documentData);
        // Update the URL to include the new document ID
        router.replace(`/dashboard/projects/${docRef.id}/edit`);
      } else {
        await updateDoc(docRef, documentData);
      }

      //Removed Success Toast
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const debouncedSave = useCallback(
    debounce((contentToSave: string, titleToSave: string) => saveDocument(contentToSave, titleToSave), 3000),
    []
  );

  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  if (user === null) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background py-12">
        <Toaster />
        <header className="bg-card border-b border-border">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => router.push('/dashboard/documents')} className="text-muted-foreground hover:text-foreground mr-4">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Documents</p>
                </TooltipContent>
              </Tooltip>
              <Breadcrumbs>
                <BreadcrumbItem isActive={false}>
                  <Link href="/dashboard/documents" className="text-muted-foreground hover:text-foreground">Documents</Link>
                </BreadcrumbItem>
                <BreadcrumbItem isActive>
                  <span className="text-foreground">{id === 'new' ? 'New Document' : title}</span>
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto py-4 px-6 bg-background rounded-md">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
              ) : (
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-xl font-bold w-full sm:w-auto bg-transparent border-none focus:outline-none text-foreground"
                  placeholder="Enter document title"
                />
              )}
            </div>
            <Card className="bg-background mt-4">
              <CardContent className="">
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <CustomEditor value={content} onChange={handleEditorChange} />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}