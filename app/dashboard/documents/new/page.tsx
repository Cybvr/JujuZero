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
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const saveDocument = useCallback(async () => {
    if (!user || !auth.currentUser) {
      console.error("No user found. Cannot save document.")
      setSaveStatus('Error: Not logged in')
      toast({
        title: "Error",
        description: "You must be logged in to save a document.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    setIsSaving(true)
    setSaveStatus('Saving...')
    try {
      const collectionRef = collection(db, "documents");
      const docData: DocumentData = {
        title,
        content,
        userId: user.uid,
        createdAt: Timestamp.now(),
        lastModified: Timestamp.now(),
        type: 'document',
        version: 1
      }

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

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/dashboard/documents">Documents</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>New Document</BreadcrumbItem>
        </Breadcrumbs>
        <Card className="mt-6">
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