import React, { useState } from 'react';
import Link from 'next/link';
import { Wand2, QrCode, Image, Video, FileAudio, FileText, Crop, Stamp, Search, FileVideo, PenTool, RefreshCw, Sparkles, FileSpreadsheet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const tools = [
  { name: 'Simple PDF', slug: 'simple-pdf', description: 'Work with PDF files easily.', icon: FileText, category: 'Workspace', access: 'free' },
  { name: 'Audio to MP3', slug: 'audio-to-mp3', description: 'Convert audio files to MP3 format.', icon: FileAudio, category: 'Workspace', access: 'free' },
  { name: 'Document to PDF', slug: 'document-to-pdf', description: 'Convert documents to PDF format.', icon: FileText, category: 'Workspace', access: 'free' },
  { name: 'Video Notes', slug: 'video-notes', description: 'Take notes while watching videos.', icon: FileVideo, category: 'AI-Powered', access: 'premium', isNew: true },
  { name: 'Sketch to Image', slug: 'sketch-to-image', description: 'Convert sketches to images using AI.', icon: PenTool, category: 'AI-Powered', access: 'premium' },
  { name: 'Image Reimagine', slug: 'imagine', description: 'Reimagine images with AI.', icon: Wand2, category: 'AI-Powered', access: 'premium' },
  { name: 'Paraphraser', slug: 'paraphraser', description: 'Rephrase text using AI.', icon: RefreshCw, category: 'AI-Powered', access: 'free' },
  { name: 'Text Summarizer', slug: 'text-summarizer', description: 'Summarize text using AI.', icon: FileText, category: 'AI-Powered', access: 'free' },
  { name: 'Visual Summarizer', slug: 'visual-summarizer', description: 'Summarize visuals using AI.', icon: Image, category: 'AI-Powered', access: 'premium', isFresh: true },
  { name: 'Invoice Generator', slug: 'invoice-generator', description: 'Generate professional invoices.', icon: FileSpreadsheet, category: 'Productivity', access: 'free' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create QR codes easily.', icon: QrCode, category: 'Productivity', access: 'free' },
  { name: 'Grammar Checker', slug: 'grammar-checker', description: 'Check and correct grammar in text.', icon: FileText, category: 'Productivity', access: 'free' },
  { name: 'Remove Background', slug: 'remove-background', description: 'Remove image backgrounds.', icon: Image, category: 'Design', access: 'free', isHot: true },
  { name: 'Compress Image', slug: 'compress-image', description: 'Compress images without losing quality.', icon: Image, category: 'Design', access: 'free' },
  { name: 'Image Crop', slug: 'image-crop', description: 'Crop images easily.', icon: Crop, category: 'Design', access: 'free' },
  { name: 'Add Watermark', slug: 'add-watermark', description: 'Add watermarks to images.', icon: Stamp, category: 'Design', access: 'free' },
  { name: 'Uncrop', slug: 'uncrop', description: 'Expand images beyond their original borders.', icon: Sparkles, category: 'Design', access: 'premium' },
  { name: 'Video to MP4', slug: 'video-to-mp4', description: 'Convert videos to MP4 format.', icon: Video, category: 'Video', access: 'free' },
];

export default function ToolsSearch() {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <Search className="mr-2 h-4 w-4" />
          <span>Search tools...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] lg:w-[450px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tools..." />
          <CommandList>
            <CommandEmpty>No tools found.</CommandEmpty>
            <CommandGroup heading="Tools">
              {tools.map((tool) => (
                <Link key={tool.slug} href={`/dashboard/tools/${tool.slug}`} passHref>
                  <CommandItem onSelect={() => setOpen(false)}>
                    <tool.icon className="mr-2 h-4 w-4" />
                    <span>{tool.name}</span>
                    {tool.isNew && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                        NEW
                      </span>
                    )}
                    {tool.isHot && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                        HOT
                      </span>
                    )}
                    {tool.isFresh && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white">
                        FRESH
                      </span>
                    )}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}