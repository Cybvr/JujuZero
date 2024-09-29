import React from 'react'
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import { Crop, Stamp, QrCode, Image, FileDown } from 'lucide-react'

const relatedTools = [
  { name: 'Image Crop', slug: 'image-crop', icon: Crop },
  { name: 'Add Watermark', slug: 'add-watermark', icon: Stamp },
]

const popularTools = [
  { name: 'QR Code Generator', slug: 'qr-code-generator', icon: QrCode },
  { name: 'Remove Background', slug: 'remove-background', icon: Image },
  { name: 'Compress Image', slug: 'compress-image', icon: FileDown },
]

export default function Toolbar() {
  return (
    <aside className="w-64 space-y-8 text-sm">
      <div>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Related Tools
        </h2>
        <ul className="space-y-1">
          {relatedTools.map((tool) => (
            <li key={tool.slug}>
              <Link 
                href={`/dashboard/tools/${tool.slug}`} 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center"
              >
                <tool.icon className="mr-2 flex-shrink-0" size={14} />
                <span className="truncate">{tool.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator className="my-4" />
      <div>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Popular Tools
        </h2>
        <ul className="space-y-1">
          {popularTools.map((tool) => (
            <li key={tool.slug}>
              <Link 
                href={`/dashboard/tools/${tool.slug}`} 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center"
              >
                <tool.icon className="mr-2 flex-shrink-0" size={14} />
                <span className="truncate">{tool.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator className="my-4" />
      <Link href="/dashboard/tools/video-notes">
        <img 
          src="/images/marketing/video-notes-banner.png" 
          alt="Video Notes Tool" 
          className="w-full rounded-lg hover:opacity-90 transition-opacity duration-200"
        />
      </Link>
    </aside>
  )
}