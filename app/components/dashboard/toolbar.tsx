import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Zap, Star, ArrowRight } from 'lucide-react'

const relatedTools = [
  { name: 'Image Crop', slug: 'image-crop' },
  { name: 'Add Watermark', slug: 'add-watermark' },
]

const popularTools = [
  { name: 'QR Code Generator', slug: 'qr-code-generator' },
  { name: 'Remove Background', slug: 'remove-background' },
  { name: 'Compress Image', slug: 'compress-image' },
]

export default function Toolbar() {
  return (
    <aside className="w-64 space-y-8 text-sm">
      <div>
        <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center">
          <Zap className="mr-2" size={14} /> Related Tools
        </h2>
        <ul className="space-y-1">
          {relatedTools.map((tool) => (
            <li key={tool.slug}>
              <Link 
                href={`/dashboard/tools/${tool.slug}`} 
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                {tool.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Separator className="my-4" />

      <div>
        <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center">
          <Star className="mr-2" size={14} /> Popular Tools
        </h2>
        <ul className="space-y-1">
          {popularTools.map((tool) => (
            <li key={tool.slug}>
              <Link 
                href={`/dashboard/tools/${tool.slug}`} 
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                {tool.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Separator className="my-4" />

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-sm mb-2">Unlock Premium Features</h3>
        <p className="text-xs text-gray-600 mb-4">Get access to all tools and advanced features.</p>
        <Button variant="outline" size="sm" className="w-full text-xs">
          Upgrade Now <ArrowRight className="ml-2" size={12} />
        </Button>
      </div>
    </aside>
  )
}