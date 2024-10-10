// app/(marketing)/components/NavigationMenuWrapper.tsx

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
  isNew?: boolean
  isHot?: boolean
  isFresh?: boolean
}

const tools: Tool[] = [
  { name: 'Simple PDF', slug: 'simple-pdf' },
  { name: 'Audio to MP3', slug: 'audio-to-mp3' },
  { name: 'Document to PDF', slug: 'document-to-pdf' },
  { name: 'Video Notes', slug: 'video-notes', isNew: true },
  { name: 'Sketch to Image', slug: 'sketch-to-image' },
  { name: 'Image Reimagine', slug: 'imagine' },
  { name: 'Paraphraser', slug: 'paraphraser' },
  { name: 'Text Summarizer', slug: 'text-summarizer' },
  { name: 'Visual Summarizer', slug: 'visual-summarizer', isFresh: true },
  { name: 'Invoice Generator', slug: 'invoice-generator' },
  { name: 'QR Code Generator', slug: 'qr-code-generator' },
  { name: 'Grammar Checker', slug: 'grammar-checker' },
  { name: 'Remove Background', slug: 'remove-background' },
  { name: 'Compress Image', slug: 'compress-image' },
  { name: 'Image Crop', slug: 'image-crop' },
  { name: 'Add Watermark', slug: 'add-watermark' },
  { name: 'Uncrop', slug: 'uncrop' },
  { name: 'Video to MP4', slug: 'video-to-mp4' },
  { name: 'Text Behind Image', slug: 'text-behind-image', isHot: true },
]

const groupedTools = {
  'Workspace': tools.filter(tool => ['simple-pdf', 'audio-to-mp3', 'document-to-pdf'].includes(tool.slug)),
  'AI-powered': tools.filter(tool => ['video-notes', 'sketch-to-image', 'imagine', 'paraphraser', 'text-summarizer', 'visual-summarizer'].includes(tool.slug)),
  'Productivity': tools.filter(tool => ['invoice-generator', 'qr-code-generator', 'grammar-checker'].includes(tool.slug)),
  'Design': tools.filter(tool => ['remove-background', 'compress-image', 'image-crop', 'add-watermark', 'uncrop', 'text-behind-image'].includes(tool.slug)),
  'Video': tools.filter(tool => ['video-to-mp4'].includes(tool.slug)),
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
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <NavigationMenu>
        <NavigationMenuList className="flex justify-between items-center h-16">
          {navigation.map((item) => (
            <NavigationMenuItem key={item.name}>
              {item.dropdown ? (
                <>
                  <NavigationMenuTrigger className="px-3 py-2">{item.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-screen max-w-4xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
    </nav>
  )
}