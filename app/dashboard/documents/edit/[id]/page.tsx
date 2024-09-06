// File: app/dashboard/projects/[id]/edit/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { doc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs'
import { ChevronLeft, Save } from 'lucide-react'
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

  const handleEditorChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSave = async () => {
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
        title,
        content,
        userId: user.uid,
        lastModified: new Date().toISOString()
      };

      if (id === 'new') {
        await setDoc(docRef, documentData);
      } else {
        await updateDoc(docRef, documentData);
      }

      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      router.push('/dashboard/documents');
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    router.push('/dashboard/documents');
  };

  if (user === null) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Toaster />
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <Breadcrumbs>
              <BreadcrumbItem isActive={false}>
                <Link href="/dashboard/documents">Documents</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>
                {id === 'new' ? 'New Document' : title}
              </BreadcrumbItem>
            </Breadcrumbs>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Documents
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to documents list</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        <main className="flex-grow container mx-auto py-4 px-6 bg-white rounded-md">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
              ) : (
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-3xl font-bold w-full sm:w-auto bg-transparent border-none focus:outline-none"
                  placeholder="Enter document title"
                />
              )}
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleBack}>Cancel</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Discard changes</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSave}>
                      Save
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save document</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Card>
              <CardContent className="p-4">
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