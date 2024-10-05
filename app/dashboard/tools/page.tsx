'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Zap, UserCircle2, Crown, Star, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/dashboard/AuthModal'
import Link from 'next/link'
import { getUserCredits } from '@/lib/credits'

const categories = ["All", "For You", "Workspace", "AI-powered", "Productivity", "Design", "Video"]

interface Tool {
  name: string
  description: string
  slug: string
  imageSrc: string
  category: string
  access: 'free' | 'signin' | 'premium'
}

const tools: Tool[] = [
  { 
    name: 'Simple PDF', 
    slug: 'simple-pdf', 
    description: 'Simple tool to edit PDF files', 
    imageSrc: '/images/tools/pdf-editor.png', 
    category: 'Workspace', 
    access: 'free' 
  },
  { 
    name: 'Invoice Generator', 
    slug: 'invoice-generator', 
    description: 'Create professional invoices easily', 
    imageSrc: '/images/tools/invoice-generator.png', 
    category: 'Productivity', 
    access: 'free' 
  },
  { 
    name: 'Video Notes', 
    slug: 'video-notes', 
    description: 'Generate FAQs, Study Guides, Table of Contents, Timelines, and Briefing Docs from YouTube videos', 
    imageSrc: '/images/tools/video-notes.png', 
    category: 'AI-powered', 
    access: 'free' 
  },
  { 
    name: 'Sketch to Image', 
    slug: 'sketch-to-image', 
    description: 'Generate an image from your sketch and description using AI.', 
    imageSrc: '/images/tools/sketch-to-image.png', 
    category: 'AI-powered', 
    access: 'signin' 
  },
  { 
    name: 'Uncrop', 
    slug: 'uncrop', 
    description: 'Extend or crop your image using AI.', 
    imageSrc: '/images/tools/uncrop.png', 
    category: 'Design', 
    access: 'signin' 
  },
  { 
    name: 'Image Reimagine', 
    slug: 'imagine', 
    description: 'Create AI-generated variations of your images.', 
    imageSrc: '/images/tools/image-reimagine.png', 
    category: 'AI-powered', 
    access: 'signin' 
  },
  { name: 'Grammar Checker', slug: 'grammar-checker', description: 'Check and improve your text\'s grammar.', imageSrc: '/images/tools/grammar-checker.png', category: 'Productivity', access: 'free' },
  { name: 'Paraphraser', slug: 'paraphraser', description: 'Rephrase your text in different styles with AI.', imageSrc: '/images/tools/paraphraser.png', category: 'AI-powered', access: 'free' },
  { name: 'Text Summarizer', slug: 'text-summarizer', description: 'Quickly summarize long texts with AI.', imageSrc: '/images/tools/text-summarizer.png', category: 'AI-powered', access: 'free' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create custom QR codes easily.', imageSrc: '/images/tools/1.png', category: 'Productivity', access: 'free' },
  { name: 'Remove Background', slug: 'remove-background', description: 'Easily remove image backgrounds.', imageSrc: '/images/tools/2.png', category: 'Design', access: 'free' },
  { name: 'Compress Image', slug: 'compress-image', description: 'Reduce image file size without losing quality.', imageSrc: '/images/tools/compress.png', category: 'Design', access: 'free' },
  { name: 'Video to MP4', slug: 'video-to-mp4', description: 'Convert various video formats to MP4.', imageSrc: '/images/tools/video-to-mp4.png', category: 'Video', access: 'free' },
  { name: 'Audio to MP3', slug: 'audio-to-mp3', description: 'Convert audio files to MP3 format.', imageSrc: '/images/tools/audio-to-mp3.png', category: 'Workspace', access: 'signin' },
  { name: 'Document to PDF', slug: 'document-to-pdf', description: 'Convert documents like Word, Excel, and PowerPoint to PDF format.', imageSrc: '/images/tools/document-to-pdf.png', category: 'Workspace', access: 'signin' },
  { name: 'Image Crop', slug: 'image-crop', description: 'Crop images easily.', imageSrc: '/images/tools/crop.png', category: 'Design', access: 'premium' },
  { name: 'Add Watermark', slug: 'add-watermark', description: 'Add watermark to images.', imageSrc: '/images/tools/add-watermark.png', category: 'Design', access: 'premium' },
  { name: 'Visual Summarizer', slug: 'visual-summarizer', description: 'AI generates infographic-like summaries of long articles or reports.', imageSrc: '/images/tools/visual-summarizer.png', category: 'AI-powered', access: 'free' },
]

const getBadgeContent = (access: string): { icon: LucideIcon; variant: "default" | "secondary" | "destructive" | "outline"; tooltip: string } => {
  switch (access) {
    case 'free':
      return { icon: Zap, variant: "secondary", tooltip: 'Free - No account required' }
    case 'signin':
      return { icon: UserCircle2, variant: "default", tooltip: 'Sign In Required' }
    case 'premium':
      return { icon: Crown, variant: "destructive", tooltip: 'Premium Feature' }
    default:
      return { icon: Zap, variant: "outline", tooltip: 'Unknown' }
  }
}

export default function AllTools() {
  const [activeTab, setActiveTab] = useState("All")
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [myTools, setMyTools] = useState<Tool[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const savedMyTools = JSON.parse(localStorage.getItem('myTools') || '[]')
    setFavorites(savedFavorites)
    setMyTools(savedMyTools)
  }, [user])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('myTools', JSON.stringify(myTools))
  }, [myTools])

  const handleFavoriteToggle = (e: React.MouseEvent, slug: string) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prevFavorites) =>
      prevFavorites.includes(slug)
        ? prevFavorites.filter((favorite) => favorite !== slug)
        : [...prevFavorites, slug]
    )
  }

  const handleAddToMyTools = (e: React.MouseEvent, tool: Tool) => {
    e.preventDefault()
    e.stopPropagation()
    setMyTools((prevTools) => {
      if (!prevTools.some(t => t.slug === tool.slug)) {
        return [...prevTools, tool]
      }
      return prevTools
    })
  }

  const getToolsForCategory = (category: string) => {
    if (category === "All") {
      return tools
    }
    if (category === "For You") {
      return myTools.length > 0 ? myTools : tools.filter(tool => favorites.includes(tool.slug))
    }
    return tools.filter(tool => tool.category === category)
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-2 text-foreground">All Tools</h1>
        <p className="text-muted-foreground">Explore our collection of powerful tools to enhance your workflow</p>
      </div>
      <Tabs defaultValue="All" onValueChange={setActiveTab} className="mb-8">
        <div className="overflow-x-auto pb-3 scrollbar-hide">
          <TabsList className="mb-6 flex flex-nowrap bg-background justify-start min-w-max">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="px-4 py-2 text-sm whitespace-nowrap flex-shrink-0 text-foreground hover:text-primary"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {getToolsForCategory(activeTab).map((tool) => (
              <Link 
                key={tool.slug} 
                href={`/dashboard/tools/${tool.slug}`}
                onClick={(e) => {
                  if ((tool.access === 'signin' || tool.access === 'premium') && !user) {
                    e.preventDefault()
                    setShowAuthModal(true)
                  }
                }}
              >
                <Card 
                  className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer bg-card"
                >
                  <div className="relative p-4 pb-0 ">
                    <img src={tool.imageSrc} alt={tool.name} className="w-12 h-12 object-contain mb-2 " />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={(e) => handleFavoriteToggle(e, tool.slug)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title={favorites.includes(tool.slug) ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <Star className={`h-4 w-4 ${favorites.includes(tool.slug) ? "text-yellow-500 fill-current" : "text-gray-400"}`} />
                      </button>
                      <button
                        onClick={(e) => handleAddToMyTools(e, tool)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title={myTools.some(t => t.slug === tool.slug) ? 'Added to My Tools' : 'Add to My Tools'}
                      >
                        <Plus className={`h-4 w-4 ${myTools.some(t => t.slug === tool.slug) ? "text-blue-500" : "text-gray-400"}`} />
                      </button>
                    </div>
                    <Badge 
                      variant={getBadgeContent(tool.access).variant}
                      className="absolute bottom-2 right-2 p-1"
                      title={getBadgeContent(tool.access).tooltip}
                    >
                      {React.createElement(getBadgeContent(tool.access).icon, { size: 14 })}
                    </Badge>
                  </div>
                  <CardContent className="flex-grow p-4">
                    <h3 className="text-sm font-medium mb-1 text-foreground">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}