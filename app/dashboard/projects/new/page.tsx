'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import BrandGuidelinesAsset from '@/components/assets/BrandGuidelinesAsset'
import MarketingCopyAsset from '@/components/assets/MarketingCopyAsset'
import LandingPageAsset from '@/components/assets/LandingPageAsset'
import { useToast } from "@/components/ui/use-toast"
import { ErrorBoundary } from 'react-error-boundary'

const sampleDescriptions = [
  "A modern, eco-friendly clothing brand focusing on sustainable materials and ethical production.",
  "A tech startup developing innovative AI solutions for small businesses.",
  "A gourmet pet food company specializing in organic, locally-sourced ingredients."
];

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function NewProject() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [projectData, setProjectData] = useState({
    brandGuidelines: {},
    marketingCopy: {
      brandOverview: '',
      targetAudience: '',
      keyMessages: [],
      marketingChannels: []
    },
    landingPage: ''
  })
  const [isComplete, setIsComplete] = useState(false)

  const handleAddSample = (sample: string) => {
    setDescription(prev => prev + (prev ? '\n\n' : '') + sample)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant that generates project data based on descriptions." },
            { role: "user", content: `Generate project data for the following description: ${description}` }
          ]
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const updateResponse = await fetch('/api/update-project-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant that updates project data." },
            { role: "user", content: data.content }
          ]
        }),
      })

      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`)
      }

      const updatedData = await updateResponse.json()
      setProjectData(updatedData)
      setIsComplete(true)
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create project: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProject = async () => {
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        description,
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      })

      router.push(`/dashboard/projects/${docRef.id}`)
    } catch (error) {
      console.error('Error saving project:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save project: ${error.message}`,
      })
    }
  }

  if (!user) {
    return <div>Please sign in to create a project.</div>
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-primary-foreground font-bold py-2 px-6 rounded-sm"
                >
                  {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isComplete && (
          <div className="space-y-8 mt-8">
            <h2 className="text-2xl font-bold text-primary">Generated Assets</h2>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <BrandGuidelinesAsset
                content={projectData.brandGuidelines}
                onChange={(newContent) => setProjectData(prev => ({ ...prev, brandGuidelines: newContent }))}
              />
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <MarketingCopyAsset
                content={projectData.marketingCopy}
                onChange={(newContent) => setProjectData(prev => ({ ...prev, marketingCopy: newContent }))}
              />
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <LandingPageAsset
                content={projectData.landingPage}
                onChange={(newContent) => setProjectData(prev => ({ ...prev, landingPage: newContent }))}
              />
            </ErrorBoundary>
            <Button onClick={handleSaveProject} className="mt-4">Save Project</Button>
          </div>
        )}
      </div>
    </div>
  )
}