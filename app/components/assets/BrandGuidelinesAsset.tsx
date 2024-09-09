import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Printer, ChevronDown, Copy, Check, Save } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

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
    }>
    brandValues?: string[]
    tagline?: string
    missionStatement?: string
  }
  onChange?: (newContent: any) => void
  onSave?: () => void
}

export default function BrandGuidelinesAsset({ content = {}, onChange = () => {}, onSave = () => {} }: BrandGuidelinesAssetProps) {
  const [localContent, setLocalContent] = useState(content)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  useEffect(() => {
    if (localContent.colors?.length === 0) {
      const newColors = generateColors()
      handleContentChange('colors', newColors)
    }
  }, [])

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

  const handleContentChange = (field: string, value: any) => {
    const newContent = { ...localContent, [field]: value }
    setLocalContent(newContent)
    onChange(newContent)
  }

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 text-sm bg-card p-8 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Brand Guidelines</h2>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Export as <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('png')}>PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('jpg')}>JPG</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h3 className="font-semibold">Brand Essence</h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold mb-2">Tagline</h4>
                <Input
                  value={localContent.tagline}
                  onChange={(e) => handleContentChange('tagline', e.target.value)}
                  placeholder="Your Catchy Tagline Here"
                />
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-semibold mb-2">Mission Statement</h4>
                <Textarea
                  value={localContent.missionStatement}
                  onChange={(e) => handleContentChange('missionStatement', e.target.value)}
                  placeholder="Our mission is to..."
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-semibold">Brand Values</h3>
            <div className="flex flex-wrap gap-2">
              {localContent.brandValues?.map((value, index) => (
                <div key={index} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                  {value}
                </div>
              ))}
            </div>
            <Input
              placeholder="Add a brand value"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const newValues = [...(localContent.brandValues || []), e.currentTarget.value]
                  handleContentChange('brandValues', newValues)
                  e.currentTarget.value = ''
                }
              }}
            />
          </section>
        </div>

        <Separator className="my-8" />

        <section className="space-y-4">
          <h3 className="font-semibold">Logos</h3>
          <div className="grid grid-cols-3 gap-4">
            {localContent.logos?.map((logo, index) => (
              <div key={index} className="bg-muted p-4 rounded-md flex items-center justify-center">
                <span>Logo {index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section className="space-y-4">
          <h3 className="font-semibold">Colors</h3>
          <div className="grid grid-cols-4 gap-4">
            {localContent.colors?.map((color, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded-md shadow-md mb-2 cursor-pointer" 
                      style={{ backgroundColor: color }}
                      onClick={() => handleCopyColor(color)}
                    ></div>
                    <span className="text-xs">
                      {copiedColor === color ? 'Copied!' : color}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section className="space-y-4">
          <h3 className="font-semibold">Typography</h3>
          {localContent.typography?.map((font, index) => (
            <div key={index} className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">{font.title}</h4>
              <p className="text-muted-foreground mb-2">{font.description}</p>
              {font.example && (
                <div className="p-2 bg-background rounded-md" style={{fontFamily: font.fontFamily, fontSize: font.fontSize}}>
                  {font.example}
                </div>
              )}
            </div>
          ))}
        </section>
        <div className="flex justify-end space-x-2">
          <Button onClick={onSave} className="btn-primary">
            <Save className="h-4 w-4 mr-2 " />
            Save
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}