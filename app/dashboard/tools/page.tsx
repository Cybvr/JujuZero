"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, UserCircle2, Crown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';

const categories = ["All", "conversion", "image", "text"];

interface Tool {
  name: string;
  description: string;
  slug: string;
  imageSrc: string;
  category: string;
  access: 'free' | 'signin' | 'premium';
}

const tools: Tool[] = [
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create custom QR codes easily.', imageSrc: '/images/tools/1.png', category: 'conversion', access: 'free' },
  { name: 'Remove Background', slug: 'remove-background', description: 'Easily remove image backgrounds.', imageSrc: '/images/tools/2.png', category: 'image', access: 'free' },
  { name: 'Compress Image', slug: 'compress-image', description: 'Reduce image file size without losing quality.', imageSrc: '/images/tools/3.png', category: 'image', access: 'free' },
  { name: 'Video to MP4', slug: 'video-to-mp4', description: 'Convert various video formats to MP4.', imageSrc: '/images/tools/video-to-mp4.png', category: 'conversion', access: 'free' },
  { name: 'Audio to MP3', slug: 'audio-to-mp3', description: 'Convert audio files to MP3 format.', imageSrc: '/images/tools/audio-to-mp3.png', category: 'conversion', access: 'signin' },
  { name: 'Document to PDF', slug: 'document-to-pdf', description: 'Convert documents like Word, Excel, and PowerPoint to PDF format.', imageSrc: '/images/tools/document-to-pdf.png', category: 'conversion', access: 'signin' },
  { name: 'Image Crop', slug: 'image-crop', description: 'Crop images easily.', imageSrc: '/images/tools/crop.png', category: 'image', access: 'premium' },
  { name: 'Add Watermark', slug: 'add-watermark', description: 'Add watermark to images.', imageSrc: '/images/tools/add-watermark.png', category: 'image', access: 'premium' },
];

const getBadgeContent = (access: string): { icon: LucideIcon; variant: "default" | "secondary" | "destructive" | "outline"; tooltip: string } => {
  switch (access) {
    case 'free':
      return { icon: Zap, variant: "secondary", tooltip: 'Free - No account required' };
    case 'signin':
      return { icon: UserCircle2, variant: "default", tooltip: 'Sign In Required' };
    case 'premium':
      return { icon: Crown, variant: "destructive", tooltip: 'Premium Feature' };
    default:
      return { icon: Zap, variant: "outline", tooltip: 'Unknown' };
  }
};

export default function AllTools() {
  const [activeTab, setActiveTab] = useState("All");
  const router = useRouter();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCardClick = (slug: string, access: string) => {
    if (access === 'free') {
      router.push(`/dashboard/tools/${slug}`);
    } else if ((access === 'signin' || access === 'premium') && !user) {
      setShowAuthModal(true);
    } else {
      router.push(`/dashboard/tools/${slug}`);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Tools</h1>
        <p className="text-muted-foreground mt-1">Explore our collection of powerful tools to enhance your workflow</p>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full ${
              activeTab === category ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools
          .filter(tool => activeTab === "All" || tool.category === activeTab.toLowerCase())
          .map((tool) => (
            <Card 
              key={tool.slug} 
              onClick={() => handleCardClick(tool.slug, tool.access)} 
              className="cursor-pointer hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img src={tool.imageSrc} alt={tool.name} className="w-full h-40 object-cover" />
                <Badge 
                  variant={getBadgeContent(tool.access).variant as "default" | "destructive" | "outline" | "secondary"}
                  className="absolute top-2 right-2 p-1"
                  title={getBadgeContent(tool.access).tooltip}
                >
                  {React.createElement(getBadgeContent(tool.access).icon, { size: 16 })}
                </Badge>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
              </CardHeader>
            </Card>
          ))}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}