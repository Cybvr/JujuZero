import React from 'react'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface Tool {
  name: string
  slug: string
}

const tools: Tool[] = [
  { name: 'Grammar Checker', slug: 'grammar-checker' },
  { name: 'Paraphraser', slug: 'paraphraser' },
  { name: 'Text Summarizer', slug: 'text-summarizer' },
  { name: 'QR Code Generator', slug: 'qr-code-generator' },
  { name: 'Remove Background', slug: 'remove-background' },
  { name: 'Compress Image', slug: 'compress-image' },
  { name: 'Video to MP4', slug: 'video-to-mp4' },
  { name: 'Audio to MP3', slug: 'audio-to-mp3' },
  { name: 'Document to PDF', slug: 'document-to-pdf' },
  { name: 'Simple PDF', slug: 'simple-pdf' },
  { name: 'Invoice Generator', slug: 'invoice-generator' },
  { name: 'Sketch to Image', slug: 'sketch-to-image' },
  { name: 'Uncrop', slug: 'uncrop' },
  { name: 'Image Reimagine', slug: 'imagine' },
  { name: 'Image Crop', slug: 'image-crop' },
  { name: 'Add Watermark', slug: 'add-watermark' },
  { name: 'Visual Summarizer', slug: 'visual-summarizer' },
]

const groupedTools = {
  'Text Tools': tools.filter(tool => ['grammar-checker', 'paraphraser', 'text-summarizer', 'visual-summarizer'].includes(tool.slug)),
  'Image Tools': tools.filter(tool => ['remove-background', 'compress-image', 'sketch-to-image', 'uncrop', 'imagine', 'image-crop', 'add-watermark'].includes(tool.slug)),
  'Conversion Tools': tools.filter(tool => ['qr-code-generator', 'video-to-mp4', 'audio-to-mp3', 'document-to-pdf', 'simple-pdf', 'invoice-generator'].includes(tool.slug)),
}

const navigation = [
  { name: 'Tools', href: '#', dropdown: true },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Help', href: '/help' },
  { name: 'FAQ', href: '/faq' },
]

export default function NavigationMenuWrapper() {
  return (
    <div className="hidden lg:flex items-center ml-6">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-1">
          {navigation.map((item) => (
            <NavigationMenuItem key={item.name}>
              {item.dropdown ? (
                <>
                  <NavigationMenuTrigger className="px-3 py-2">{item.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[600px] p-6">
                      <div className="grid grid-cols-3 gap-6">
                        {Object.entries(groupedTools).map(([category, categoryTools]) => (
                          <div key={category} className="space-y-3">
                            <h3 className="text-sm font-medium text-foreground/70">{category}</h3>
                            <ul className="space-y-2">
                              {categoryTools.map((tool) => (
                                <li key={tool.slug}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={`/dashboard/tools/${tool.slug}`}
                                      className="block w-full select-none rounded-md px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      {tool.name}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className="px-3 py-2">
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}