import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Download, Code, Eye, Copy, Check, Printer, Save } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import CustomEditor from '@/components/dashboard/CustomEditor'

interface LandingPageAssetProps {
  content: string;
  onSave: (newContent: string) => Promise<void>;
}

export default function LandingPageAsset({ content, onSave }: LandingPageAssetProps) {
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [localContent, setLocalContent] = useState(content)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(localContent)
      toast({
        title: "Changes saved",
        description: "Your landing page has been updated.",
      })
    } catch (error) {
      console.error("Error saving landing page:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([localContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'landing-page.html'
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(localContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to open print window. Please check your pop-up settings.",
      })
    }
  }

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`)
    toast({
      title: "Export initiated",
      description: `Exporting landing page as ${format.toUpperCase()}.`,
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 bg-card p-8 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Landing Page</h2>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Export as <Download className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('png')}>PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>HTML</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                className="w-full h-[600px] border-0"
                sandbox="allow-scripts"
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <CustomEditor
                value={localContent}
                onChange={handleContentChange}
              />
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied!' : 'Copy code'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}