'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, 
  Type, Palette, Link, ListOrdered, Strikethrough, Subscript, Superscript,
  Undo, Redo
} from 'lucide-react'

interface CustomEditorProps {
  value: string
  onChange: (value: string) => void
}

const CustomEditor: React.FC<CustomEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [textColor, setTextColor] = useState('#000000')
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value
    }
  }, [value])

  useEffect(() => {
    const editor = editorRef.current
    if (editor) {
      const handleInput = () => {
        const content = editor.innerHTML
        onChange(content)
      }

      editor.addEventListener('input', handleInput)
      return () => editor.removeEventListener('input', handleInput)
    }
  }, [onChange])

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
  }

  const handleHeadingChange = (value: string) => {
    execCommand('formatBlock', value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setTextColor(color)
    execCommand('foreColor', color)
  }

  const handleLinkInsert = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl)
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => execCommand('bold')}><Bold size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('italic')}><Italic size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('underline')}><Underline size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('strikeThrough')}><Strikethrough size={16} /></Button>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => execCommand('justifyLeft')}><AlignLeft size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('justifyCenter')}><AlignCenter size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('justifyRight')}><AlignRight size={16} /></Button>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => execCommand('insertUnorderedList')}><List size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('insertOrderedList')}><ListOrdered size={16} /></Button>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => execCommand('subscript')}><Subscript size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('superscript')}><Superscript size={16} /></Button>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => execCommand('undo')}><Undo size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => execCommand('redo')}><Redo size={16} /></Button>
        </div>
        <div className="flex gap-1 items-center">
          <Select onValueChange={handleHeadingChange}>
            <SelectTrigger className="w-[120px]">
              <Type size={16} className="mr-2" />
              <SelectValue placeholder="Heading" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost"><Palette size={16} /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <input
                type="color"
                value={textColor}
                onChange={handleColorChange}
                className="w-8 h-8 border-none cursor-pointer"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-1 items-center">
          <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost"><Link size={16} /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <Button onClick={handleLinkInsert}>Insert</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] focus:outline-none"
      />
    </div>
  )
}

export default CustomEditor