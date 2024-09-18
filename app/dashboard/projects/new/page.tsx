"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { useToast } from "@/components/ui/use-toast"
import { Stars } from 'lucide-react'

export default function NewProject() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a project name.",
      })
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status)
      }

      const data = await response.json()

      // Generate logo using DALL-E
      const logoResponse = await fetch('/api/openai/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: `${name} logo` }),
      });

      if (!logoResponse.ok) {
        throw new Error('HTTP error! status: ' + logoResponse.status)
      }

      const logoData = await logoResponse.json();
      const logoUrl = logoData.url;

      const docRef = await addDoc(collection(db, "projects"), {
        ...data,
        logo: logoUrl, // Save the logo URL
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user ? user.uid : null,
      })

      router.push('/dashboard/projects/' + docRef.id)

    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create project: " + (error instanceof Error ? error.message : 'Unknown error'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Please sign in to create a project.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create a new project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="w-full"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows={5}
              className="w-full"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Stars className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Stars className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}