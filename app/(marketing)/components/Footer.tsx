// app/(marketing)/components/Footer.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const toolCategories = {
  "WORKSPACE": [
    { name: 'Simple PDF', href: '/dashboard/tools/simple-pdf' },
    { name: 'Audio to MP3', href: '/dashboard/tools/audio-to-mp3' },
    { name: 'Document to PDF', href: '/dashboard/tools/document-to-pdf' },
  ],
  "AI-POWERED": [
    { name: 'Video Notes', href: '/dashboard/tools/video-notes', isNew: true },
    { name: 'Sketch to Image', href: '/dashboard/tools/sketch-to-image' },
    { name: 'Image Reimagine', href: '/dashboard/tools/imagine' },
    { name: 'Paraphraser', href: '/dashboard/tools/paraphraser' },
    { name: 'Text Summarizer', href: '/dashboard/tools/text-summarizer' },
    { name: 'Visual Summarizer', href: '/dashboard/tools/visual-summarizer', isFresh: true },
  ],
  "PRODUCTIVITY": [
    { name: 'Invoice Generator', href: '/dashboard/tools/invoice-generator' },
    { name: 'QR Code Generator', href: '/dashboard/tools/qr-code-generator' },
    { name: 'Grammar Checker', href: '/dashboard/tools/grammar-checker' },
  ],
  "DESIGN": [
    { name: 'Remove Background', href: '/dashboard/tools/remove-background' },
    { name: 'Compress Image', href: '/dashboard/tools/compress-image' },
    { name: 'Image Crop', href: '/dashboard/tools/image-crop' },
    { name: 'Add Watermark', href: '/dashboard/tools/add-watermark' },
    { name: 'Uncrop', href: '/dashboard/tools/uncrop' },
    { name: 'Text Behind Image', href: '/dashboard/tools/text-behind-image', isHot: true },
  ],
  "VIDEO": [
    { name: 'Video to MP4', href: '/dashboard/tools/video-to-mp4' },
  ],
};

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Help', href: '/help' },
  { name: 'FAQ', href: '/faq' },
];

const legalLinks = [
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Cookies', href: '/cookies' },
];

function FooterLogo() {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === 'dark' ? "/images/logoy.png" : "/images/logoz.png";

  return (
    <div className="h-12">
      <Image 
        src={logoSrc}
        alt="Juju Logo"
        width={96}
        height={24}
        className="h-full w-auto"
      />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {Object.entries(toolCategories).map(([category, tools]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary">
                {category}
              </h3>
              <ul className="space-y-2">
                {tools.map((tool) => (
                  <li key={tool.name}>
                    <Link href={tool.href} className="text-sm text-muted-foreground hover:text-foreground">
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-border">
          <div className="col-span-1 md:col-span-2">
            <FooterLogo />
            <p className="text-sm mt-4 text-muted-foreground max-w-xs">
              Juju is your all-in-one platform for file conversion and editing tasks. We offer 
              a suite of tools including PDF conversion, image editing, text tools, 
              data conversion, and AI-powered features.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary">
              QUICK LINKS
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary">
              LEGAL
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 mt-8 text-primary">
              SOCIAL
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.instagram.com" className="text-sm text-muted-foreground hover:text-foreground">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Juju, Inc. All rights reserved. Powered by 
            <Link href="http://visual.ng">
              <span style={{fontWeight: 'bold', textDecoration: 'underline'}}>VisualCore9Systems</span>
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}