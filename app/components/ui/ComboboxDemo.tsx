// @app/components/ui/ComboboxDemo.tsx
"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
import Link from 'next/link';

const tools = [
  { name: "QR Code Generator", slug: "qr-code-generator" },
  { name: "Remove Background", slug: "remove-background" },
  { name: "Compress Image", slug: "compress-image" },
  { name: "Video to MP4", slug: "video-to-mp4" },
  { name: "Audio to MP3", slug: "audio-to-mp3" },
  { name: "Document to PDF", slug: "document-to-pdf" },
  { name: "Image Crop", slug: "image-crop" },
  { name: "Add Watermark", slug: "add-watermark" },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between shadow-md bg-white dark:bg-gray-800"
        >
          {value
            ? tools.find((tool) => tool.slug === value)?.name
            : "✨ Select tool.."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800">
        <Command>
          <CommandInput placeholder="Search tool..." className="h-9" />
          <CommandList className="max-h-[180px] overflow-y-auto">
            <CommandEmpty>No tool found.</CommandEmpty>
            <CommandGroup>
              {tools.map((tool) => (
                <CommandItem
                  key={tool.slug}
                  value={tool.slug}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Link href={`/dashboard/${tool.slug}`} className="flex items-center w-full">
                    {tool.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === tool.slug ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}