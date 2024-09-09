'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import BrandGuidelinesAsset from '@/components/assets/BrandGuidelinesAsset'
import MarketingCopyAsset from '@/components/assets/MarketingCopyAsset'
import LandingPageAsset from '@/components/assets/LandingPageAsset'

export default function EditProject({ params }) {
  const { projectId } = params
  const router = useRouter()
  const { user, loading } = useAuth()
  const [project, setProject] = useState(null)
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      fetchProject()
    } else if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, projectId])

  const fetchProject = async () => {
    setIsLoading(true)
    try {
      const projectDoc = await getDoc(doc(db, "projects", projectId))
      if (projectDoc.exists()) {
        const projectData = projectDoc.data()
        if (projectData.userId === user.uid) {
          setProject(projectData)
          setDescription(projectData.description)
        } else {
          router.push('/dashboard/projects')
        }
      } else {
        router.push('/dashboard/projects')
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/openai/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant that generates project data based on descriptions." },
            { role: "user", content: `Generate project data for the following description: ${description}` }
          ]
        }),
      })

      if (!response.ok) throw new Error('Failed to generate project data')

      const data = await response.json()

      const updateResponse = await fetch('/api/update-project-data/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant that updates project data." },
            { role: "user", content: data.content }
          ]
        }),
      })

      if (!updateResponse.ok) throw new Error('Failed to update project data')

      const updatedData = await updateResponse.json()
      setProject(prev => ({ ...prev, ...updatedData }))

      await updateDoc(doc(db, "projects", projectId), {
        description,
        ...updatedData,
        updatedAt: new Date()
      })

      router.push(`/dashboard/projects/${projectId}`)
    } catch (error) {
      console.error('Error updating project:', error)
      // Handle error (show message to user)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!project) {
    return <div className="flex justify-center items-center h-screen">Project not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <Card className="bg-card/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Edit Project: {project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project"
                rows={5}
                className="w-full bg-background/5 text-foreground placeholder-muted-foreground border-input"
              />
              <div className="space-y-8">
                <BrandGuidelinesAsset
                  content={project.brandGuidelines}
                  onChange={(newContent) => setProject(prev => ({ ...prev, brandGuidelines: newContent }))}
                />
                <MarketingCopyAsset
                  content={project.marketingCopy}
                  onChange={(newContent) => setProject(prev => ({ ...prev, marketingCopy: newContent }))}
                />
                <LandingPageAsset
                  content={project.landingPage}
                  onChange={(newContent) => setProject(prev => ({ ...prev, landingPage: newContent }))}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-primary-foreground font-bold py-2 px-6 rounded-sm"
                >
                  {isLoading ? 'Updating...' : 'Update Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}