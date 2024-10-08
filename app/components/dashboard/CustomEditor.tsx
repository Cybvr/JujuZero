import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight,
  Type, Palette, Link, ListOrdered, Strikethrough, Subscript, Superscript,
  Undo, Redo, Trash2
} from 'lucide-react';

interface CustomEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [textColor, setTextColor] = useState('#000000');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      const handleContentChange = () => {
        const content = editor.innerHTML;
        onChange(content);
      };

      editor.addEventListener('input', handleContentChange);
      editor.addEventListener('paste', handleContentChange);
      editor.addEventListener('cut', handleContentChange);

      return () => {
        editor.removeEventListener('input', handleContentChange);
        editor.removeEventListener('paste', handleContentChange);
        editor.removeEventListener('cut', handleContentChange);
      };
    }
  }, [onChange]);

  const execCommand = (command: string, value?: string) => {
    const editor = editorRef.current;
    if (editor) {
      document.execCommand(command, false, value);
      editor.focus();
    }
  };

  const handleHeadingChange = (value: string) => {
    execCommand('formatBlock', `<${value}>`);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    execCommand('foreColor', color);
  };

  const handleLinkInsert = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleDelete = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      onChange('');
    }
    setShowDeleteDialog(false);
  };

  const handleListInsert = (listType: 'ul' | 'ol') => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const listElement = document.createElement(listType);
      const listItem = document.createElement('li');
      listItem.appendChild(range.extractContents());
      listElement.appendChild(listItem);
      range.insertNode(listElement);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    editorRef.current?.focus();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
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
          <Button size="sm" variant="ghost" onClick={() => handleListInsert('ul')}><List size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => handleListInsert('ol')}><ListOrdered size={16} /></Button>
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
            <SelectTrigger className="w-[120px] border-0">
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
                className="w-8 h-8 border-0 cursor-pointer"
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
                  className="border-0 shadow-none"
                />
                <Button onClick={handleLinkInsert} variant="ghost">Insert</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-1 items-center">
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost"><Trash2 size={16} /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all content in the editor.
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
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] focus:outline-none border p-2 prose max-w-none"
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
      />
    </div>
  );
};

export default CustomEditor;
