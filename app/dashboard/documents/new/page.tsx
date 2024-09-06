'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs'
import { Save } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from '@/context/AuthContext'
import { doc, setDoc, collection, addDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { useToast } from "@/components/ui/use-toast"
import CustomEditor from '@/components/dashboard/CustomEditor'

interface DocumentData {
  title: string;
  content: string;
  userId: string;
  createdAt: Timestamp;
  lastModified: Timestamp;
  type: 'document';
  version: number;
}

export default function NewDocument() {
  const [title, setTitle] = useState('Untitled Document')
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    console.log("Component mounted. Current user:", user);

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log("Auth state changed. Current user:", authUser);
      if (authUser) {
        console.log("User is signed in. UID:", authUser.uid);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, [user]);

  const saveDocument = useCallback(async () => {
    console.log("Starting saveDocument function");
    console.log("Current user from useAuth:", user);
    console.log("Current user from auth.currentUser:", auth.currentUser);

    if (!user || !auth.currentUser) {
      console.error("No user found. Cannot save document.")
      setSaveStatus('Error: Not logged in')
      toast({
        title: "Error",
        description: "You must be logged in to save a document.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    setSaveStatus('Saving...')
    try {
      console.log("Attempting to save document...")
      console.log("User ID:", user.uid);

      // Check if 'documents' collection exists
      const collectionRef = collection(db, "documents");
      const snapshot = await getDocs(collectionRef);
      if (snapshot.empty) {
        console.log("'documents' collection does not exist or is empty. Creating new document anyway.");
      } else {
        console.log("'documents' collection exists and contains documents.");
      }

      const docData: DocumentData = {
        title,
        content,
        userId: user.uid,
        createdAt: Timestamp.now(),
        lastModified: Timestamp.now(),
        type: 'document',
        version: 1
      }
      console.log("Document data:", docData)

      const docRef = await addDoc(collectionRef, docData)
      console.log("Document saved successfully with ID:", docRef.id)
      setSaveStatus('Saved successfully')
      toast({
        title: "Success",
        description: "Document saved successfully.",
        variant: "default",
      })
      router.push('/dashboard/documents')
    } catch (error) {
      console.error("Error saving document:", error)
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      setSaveStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      toast({
        title: "Error",
        description: `Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [title, content, user, router, toast])

  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (title || content) {
        console.log("Attempting autosave...")
        saveDocument()
      }
    }, 30000) // Autosave every 30 seconds

    return () => clearInterval(autosaveInterval)
  }, [saveDocument])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setSaveStatus('Unsaved changes')
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setSaveStatus('Unsaved changes')
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs className="mb-6">
          <BreadcrumbItem>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/dashboard/documents">Documents</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>New Document</BreadcrumbItem>
        </Breadcrumbs>
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? (
                <Input
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <span onClick={() => setIsEditing(true)} className="cursor-pointer">
                  {title}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomEditor value={content} onChange={handleContentChange} />
          </CardContent>
          <CardFooter className="justify-between">
            <span className="text-sm text-gray-500">
              {saveStatus}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={saveDocument} disabled={isSaving}>
                  Save
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save document</p>
              </TooltipContent>
            </Tooltip>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}