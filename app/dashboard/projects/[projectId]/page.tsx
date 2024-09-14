"use client";
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import BrandGuidelinesAsset from '@/components/assets/BrandGuidelinesAsset'
import MarketingCopyAsset from '@/components/assets/MarketingCopyAsset'
import LandingPageAsset from '@/components/assets/LandingPageAsset'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Wand2, Share2, Trash2, ArrowLeft, Home, BookOpen, MessageSquare, Layout, Menu } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { db } from '@/lib/firebase'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface ProjectData {
  id: string;
  name: string;
  description: string;
  brandGuidelines: {
    colors: string[];
    logos: string[];
    typography: string[];
    brandValues: string[];
    tagline: string;
    missionStatement: string;
  };
  marketingCopy: string;
  landingPage: string;
  tokenCount?: number;
}

export default function ProjectDetails({ params }: { params: { projectId: string } }) {
  const { projectId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchProjectData()
  }, [projectId])

  const fetchProjectData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const docRef = doc(db, "projects", projectId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() } as ProjectData)
      } else {
        setError("Project not found")
      }
    } catch (err) {
      console.error("Error fetching project:", err)
      setError("Failed to load project data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: project?.name, description: project?.description }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      await updateDoc(doc(db, "projects", projectId), {
        ...data,
        updatedAt: new Date(),
      })

      setProject({ ...project, ...data } as ProjectData)

      toast({
        title: "Project regenerated",
        description: "Your project assets have been successfully regenerated.",
      })
    } catch (err) {
      console.error("Error regenerating project:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to regenerate project. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    toast({
      title: "Share feature",
      description: "Sharing functionality is not implemented yet.",
    })
  }

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "projects", projectId))
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted.",
      })
      router.push('/dashboard/projects')
    } catch (err) {
      console.error("Error deleting project:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project. Please try again.",
      })
    }
  }

  const handleSaveBrandGuidelines = async (newContent: ProjectData['brandGuidelines']) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        brandGuidelines: newContent,
        updatedAt: new Date(),
      })
      setProject(prev => prev ? { ...prev, brandGuidelines: newContent } : null)
      toast({
        title: "Changes saved",
        description: "Brand guidelines have been updated.",
      })
    } catch (error) {
      console.error("Error saving brand guidelines:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    }
  }

  const handleSaveMarketingCopy = async (newContent: string) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        marketingCopy: newContent,
        updatedAt: new Date(),
      })
      setProject(prev => prev ? { ...prev, marketingCopy: newContent } : null)
      toast({
        title: "Changes saved",
        description: "Marketing copy has been updated.",
      })
    } catch (error) {
      console.error("Error saving marketing copy:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    }
  }

  const handleSaveLandingPage = async (newContent: string) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        landingPage: newContent,
        updatedAt: new Date(),
      })
      setProject(prev => prev ? { ...prev, landingPage: newContent } : null)
      toast({
        title: "Changes saved",
        description: "Landing page has been updated.",
      })
    } catch (error) {
      console.error("Error saving landing page:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error || !project) {
    return <div className="flex justify-center items-center h-screen">{error || "An error occurred"}</div>
  }

  const SidebarContent = () => (
    <div className="flex flex-col space-y-4">
      <a onClick={scrollToTop} className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground text-sm">
        <Home className="mr-2 h-3 w-3" /> Home
      </a>
      <a onClick={() => scrollToSection('brandGuidelines')} className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground text-sm">
        <BookOpen className="mr-2 h-3 w-3" /> Brand Guidelines
      </a>
      <a onClick={() => scrollToSection('marketingCopy')} className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground text-sm">
        <MessageSquare className="mr-2 h-3 w-3" /> Marketing Copy
      </a>
      <a onClick={() => scrollToSection('landingPage')} className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground text-sm">
        <Layout className="mr-2 h-3 w-3" /> Landing Page
      </a>
    </div>
  )

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-8">
        <div className="flex justify-between items-center sticky top-0 bg-card z-10 py-4">
          <Button
            onClick={() => router.push('/dashboard/projects')}
            variant="ghost"
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Back to Projects</span>
          </Button>
          {project.tokenCount && <Badge variant="secondary" className="hidden sm:inline-flex">Tokens: {project.tokenCount}</Badge>}
          <div className="flex space-x-2 sm:space-x-4">
            <Button 
              onClick={handleRegenerate}
              className="bg-gradient-to-r from-blue-800 to-indigo-600 hover:from-blue-700 hover:to-indigo-500 text-white"
            >
              <Wand2 className="sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Regenerate</span>
            </Button>
            <Button onClick={handleShare}><Share2 className="sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Share</span></Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">
          <div className="hidden sm:block w-full sm:w-[15%] border-r border-muted-foreground/30 pr-2 sticky top-20 self-start">
            <SidebarContent />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="w-full sm:w-[85%] space-y-8">
            <div>
              <h1 className="text-xl font-semibold text-primary mb-2">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>

            <div id="brandGuidelines">
              <BrandGuidelinesAsset content={project.brandGuidelines} onSave={handleSaveBrandGuidelines} />
            </div>

            <div id="marketingCopy">
              <MarketingCopyAsset content={project.marketingCopy} onSave={handleSaveMarketingCopy} />
            </div>

            <div id="landingPage">
              <LandingPageAsset content={project.landingPage} onSave={handleSaveLandingPage} />
            </div>

            <div className="flex justify-center mt-8">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this project? This action cannot be undone. 
                      This will permanently delete your project and remove all of its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}