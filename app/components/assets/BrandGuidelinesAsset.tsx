import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, Copy, Check, Printer } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const generateColors = () => {
  const colors: string[] = []
  for (let i = 0; i < 4; i++) {
    const hue = Math.floor(Math.random() * 360)
    const saturation = Math.floor(Math.random() * 30) + 70
    const lightness = Math.floor(Math.random() * 30) + 35
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }
  return colors
}

interface BrandGuidelinesAssetProps {
  content?: {
    colors?: string[]
    logos?: string[]
    typography?: Array<{
      title: string
      description: string
      fontFamily: string
      fontSize: string
      example?: string
      additionalInfo?: string
    }>
    brandValues?: string[]
    tagline?: string
    missionStatement?: string
  }
  onChange?: (newContent: any) => void
}

export default function BrandGuidelinesAsset({ content = {}, onChange = () => {} }: BrandGuidelinesAssetProps) {
  const [colors, setColors] = useState(content?.colors || [])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  useEffect(() => {
    if (colors.length === 0) {
      const newColors = generateColors()
      setColors(newColors)
      onChange({ ...content, colors: newColors })
    }
  }, [])

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`)
  }

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const safeContent = {
    logos: Array.isArray(content?.logos) && content.logos.length === 3 
      ? content.logos 
      : ['/placeholder.svg?height=200&width=200', '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=200&width=200'],
    typography: Array.isArray(content?.typography) ? content.typography : [
      {
        title: "Heading Font",
        description: "Used for main headings",
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        example: "This is a heading"
      },
      {
        title: "Body Font",
        description: "Used for body text",
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        example: "This is body text"
      }
    ],
    brandValues: Array.isArray(content?.brandValues) ? content.brandValues : ['Innovation', 'Quality', 'Customer-Centric', 'Sustainability'],
    tagline: content?.tagline || "Your Catchy Tagline Here",
    missionStatement: content?.missionStatement || "Our mission is to provide innovative solutions that improve people's lives while promoting sustainability and excellence in everything we do.",
  }

  return (
    <TooltipProvider>
      <div className="p-8 space-y-8 text-sm bg-card text-card-foreground shadow-lg rounded-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Brand Guidelines Cheat Sheet</h1>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="bg-background text-foreground border-input" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="bg-background text-foreground border-input">
                  Export as <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('png')}>Export as PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('jpg')}>Export as JPG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Brand Essence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">Tagline</h3>
              <p className="italic text-lg">{safeContent.tagline}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">Mission Statement</h3>
              <p>{safeContent.missionStatement}</p>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Brand Values</h2>
          <div className="flex flex-wrap gap-4">
            {safeContent.brandValues.map((value, index) => (
              <div key={index} className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                {value}
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Logos</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {safeContent.logos.map((logo, index) => (
              <div key={index} className="flex-shrink-0">
                <img src={logo} alt={`Logo ${index + 1}`} className="h-24 w-24 object-cover border border-input rounded-md" />
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Colors</h2>
          <div className="flex flex-wrap gap-4">
            {colors.map((color, index) => (
              <div key={index} className="flex-shrink-0 flex flex-col items-center">
                <div 
                  className="w-16 h-16 rounded-md shadow-md mb-2" 
                  style={{ backgroundColor: color }}
                ></div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-background text-foreground border-input text-xs"
                      onClick={() => handleCopyColor(color)}
                    >
                      {copiedColor === color ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                      {color}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copiedColor === color ? 'Copied!' : 'Click to copy'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Typography</h2>
          <div className="space-y-4">
            {safeContent.typography.map((typography, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="p-4 bg-muted rounded-md cursor-help">
                    <h3 className="font-semibold">{typography.title}</h3>
                    <p className="text-sm mt-1">{typography.description}</p>
                    {typography.example && (
                      <div className="mt-2 p-2 bg-background rounded border border-input">
                        <span className="text-xs text-muted-foreground">Example:</span>
                        <p className="mt-1" style={{fontFamily: typography.fontFamily, fontSize: typography.fontSize}}>
                          {typography.example}
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Font: {typography.fontFamily}</p>
                  <p>Size: {typography.fontSize}</p>
                  {typography.additionalInfo && <p>{typography.additionalInfo}</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}