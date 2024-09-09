"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Stars, Download } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

const sampleDescriptions = [
  "A modern, eco-friendly clothing brand focusing on sustainable materials and ethical production.",
  "A tech startup developing innovative AI solutions for small businesses.",
  "A gourmet pet food company specializing in organic, locally-sourced ingredients."
];

export default function NewProject() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!authLoading && user === null && !isLoading) {
      router.push('/login')
    }
  }, [user, router, isLoading, authLoading])

  const handleAddSample = (sample) => {
    setDescription(prev => prev + (prev ? '\n\n' : '') + sample)
  }

  const simulateProgress = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10
      if (currentProgress > 100) {
        currentProgress = 100
        clearInterval(interval)
      }
      setProgress(Math.round(currentProgress))
    }, 500)
    return () => clearInterval(interval)
  }

  const handleSubmit = async (e) => {
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
    const cleanup = simulateProgress()

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // We don't need to call the update-project-data route separately anymore
      // as the initial generation now includes all required fields

      const docRef = await addDoc(collection(db, "projects"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user?.uid,
      })

      cleanup()
      setProgress(100)

      setTimeout(() => {
        router.push(`/dashboard/projects/${docRef.id}`)
      }, 500)

    } catch (error) {
      cleanup()
      console.error('Error creating project:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (user === null) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <Card className="bg-card/10 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary mb-2">Create a new project</CardTitle>
            <p className="text-base text-muted-foreground">How would you like to get started?</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="w-full bg-background/5 text-foreground placeholder-muted-foreground border-input"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you'd like to make"
                rows={5}
                className="w-full bg-background/5 text-foreground placeholder-muted-foreground border-input"
              />

              {description === '' && (
                <>
                  <p className="text-center text-sm text-muted-foreground mt-4">Example prompts</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {sampleDescriptions.map((sample, index) => (
                      <Card 
                        key={index} 
                        className="bg-card/5 hover:bg-card/10 transition-colors cursor-pointer"
                        onClick={() => handleAddSample(sample)}
                      >
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground">{sample}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-sm"
                >
                  {isLoading ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Stars className="mr-2 h-4 w-4" />
                      Create Project
                    </>
                  )}
                </Button>
              </div>
            </form>

            {isLoading && (
              <div className="mt-8">
                <p className="text-center text-sm text-muted-foreground mb-2">Generating your project assets...</p>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}