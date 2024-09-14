import React, { useState } from 'react';
import Link from 'next/link';
import { Wand2, QrCode, Image, Video, FileAudio, FileText, Crop, Stamp, Search } from 'lucide-react';
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
  { name: 'Grammar Checker', slug: 'grammar-checker', description: 'Check and improve your text\'s grammar.', icon: FileText, category: 'Text', access: 'free' },
  { name: 'Paraphraser', slug: 'paraphraser', description: 'Rephrase your text in different styles with AI.', icon: FileText, category: 'Text', access: 'free' },
  { name: 'Text Summarizer', slug: 'text-summarizer', description: 'Quickly summarize long texts with AI.', icon: FileText, category: 'Text', access: 'free' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create custom QR codes easily.', icon: QrCode, category: 'Conversion', access: 'free' },
  { name: 'Remove Background', slug: 'remove-background', description: 'Easily remove image backgrounds.', icon: Image, category: 'Image', access: 'free' },
  { name: 'Compress Image', slug: 'compress-image', description: 'Reduce image file size without losing quality.', icon: Image, category: 'Image', access: 'free' },
  { name: 'Video to MP4', slug: 'video-to-mp4', description: 'Convert various video formats to MP4.', icon: Video, category: 'Conversion', access: 'free' },
  { name: 'Audio to MP3', slug: 'audio-to-mp3', description: 'Convert audio files to MP3 format.', icon: FileAudio, category: 'Conversion', access: 'signin' },
  { name: 'Document to PDF', slug: 'document-to-pdf', description: 'Convert documents like Word, Excel, and PowerPoint to PDF format.', icon: FileText, category: 'Conversion', access: 'signin' },
  { name: 'Image Crop', slug: 'image-crop', description: 'Crop images easily.', icon: Crop, category: 'Image', access: 'premium' },
  { name: 'Add Watermark', slug: 'add-watermark', description: 'Add watermark to images.', icon: Stamp, category: 'Image', access: 'premium' },
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