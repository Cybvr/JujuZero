import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Download, Save, Printer } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Editor } from '@tinymce/tinymce-react'

interface MarketingCopyAssetProps {
  content: string;
  onSave: (newContent: string) => Promise<void>;
  init?: any; // Added init prop
}

export default function MarketingCopyAsset({ content, onSave, init }: MarketingCopyAssetProps) {
  const [localContent, setLocalContent] = useState<string>(content)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const handleContentChange = (content: string, editor: any) => {
    setLocalContent(content)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(localContent)
      toast({
        title: "Changes saved",
        description: "Your marketing copy has been updated.",
      })
    } catch (error) {
      console.error("Error saving marketing copy:", error)
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
    const blob = new Blob([localContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'marketing_copy.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`)
    toast({
      title: "Export initiated",
      description: `Exporting marketing copy as ${format.toUpperCase()}.`,
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 bg-card p-8 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Marketing Copy</h2>
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
                <DropdownMenuItem onClick={() => handleExport('docx')}>DOCX</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>TXT</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="min-h-[400px]">
          <Editor
            value={localContent}
            onEditorChange={handleContentChange}
            init={{
              height: 500,
              menubar: false,
              branding: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }} // Using the init prop here
          />
        </div>

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