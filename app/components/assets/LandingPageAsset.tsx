import React, { useState, useEffect, useCallback } from 'react'
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
import dynamic from 'next/dynamic'
import { debounce } from 'lodash'

const CodeEditor = dynamic(() => import('@/components/dashboard/CodeEditor'), { ssr: false })

interface LandingPageAssetProps {
  content: string;
  onSave: (newContent: string) => Promise<void>;
}

export default function LandingPageAsset({ content, onSave }: LandingPageAssetProps) {
  const [localContent, setLocalContent] = useState<string>(content)
  const [activeTab, setActiveTab] = useState<string>('preview')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const handleContentChange = useCallback(
    debounce((value: string) => {
      setLocalContent(value)
    }, 500),
    []
  )

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

  const handleCopy = () => {
    navigator.clipboard.writeText(localContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([localContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'landing_page.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow?.document.write(localContent)
    printWindow?.document.close()
    printWindow?.print()
  }

  const handleExport = (format: string) => {
    setIsLoading(true)
    // Simulating export process
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Export completed",
        description: `Your landing page has been exported as ${format.toUpperCase()}.`,
      })
    }, 2000)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 bg-card p-8 rounded-md min-h-[600px] w-full"> {/* Add min-height and full width */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Landing Page</h2>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handlePrint} disabled={isLoading}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"> {/* Add full width to tabs */}
          <TabsList className="w-full justify-start"> {/* Ensure tabs are full width and left-aligned */}
            <TabsTrigger value="preview" className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex-1">
              <Code className="mr-2 h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-md p-4 bg-background min-h-[400px]"> {/* Add min-height */}
              <iframe
                srcDoc={localContent}
                title="Landing Page Preview"
                className="w-full h-[600px] border-0"
                sandbox="allow-scripts"
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="relative min-h-[400px]"> {/* Add min-height */}
              <CodeEditor
                value={localContent}
                onChange={handleContentChange}
                language="html"
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  height: "400px", // Set a fixed height
                }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-background"
                    onClick={handleCopy}
                    disabled={isLoading}
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
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
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