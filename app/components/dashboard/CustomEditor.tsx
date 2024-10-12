import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';

interface CustomEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

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
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div>
      <div className="flex flex-wrap mb-4 border-none bg-background">
        <Button size="sm" variant="ghost" onClick={() => execCommand('bold')}><Bold size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => execCommand('italic')}><Italic size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => execCommand('insertUnorderedList')}><List size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => execCommand('justifyLeft')}><AlignLeft size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => execCommand('justifyCenter')}><AlignCenter size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => execCommand('justifyRight')}><AlignRight size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => {
          const url = prompt('Enter URL:');
          if (url) execCommand('createLink', url);
        }}><Link size={16} /></Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] focus:outline-none p-2 prose max-w-none bg-background"
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