import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Download, Code, Eye, Copy, Check } from "lucide-react"

const landingPageContent = `<!DOCTYPE html>
<html lang="en">
  <!-- Your existing HTML content here -->
</html>`

interface LandingPageAssetProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function LandingPageAsset({ content, onChange }: LandingPageAssetProps) {
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [localContent, setLocalContent] = useState(content || landingPageContent)

  const handleDownload = () => {
    const blob = new Blob([localContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bloombox-landing-page.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(localContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
    onChange(newContent)
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Landing Page</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="bg-background text-foreground border-input" onClick={handleDownload}>
                <Download className="mr-2 h-3 w-3" /> Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download this landing page</TooltipContent>
          </Tooltip>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="mr-2 h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-md p-4 bg-background">
              <iframe
                srcDoc={localContent}
                title="Landing Page Preview"
                className="w-full h-[500px] border-0"
                sandbox="allow-scripts"
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <textarea
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-[500px] p-4 font-mono text-sm bg-muted rounded-md"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-background"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}