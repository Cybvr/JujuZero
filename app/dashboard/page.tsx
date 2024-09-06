"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountCreation from '@/components/dashboard/AccountCreation';
import { usePricingDialog } from '@/context/PricingDialogContext';
import { Badge } from "@/components/ui/badge";
import { Zap, UserCircle2, Crown, File, FileText, Image, Video, Folder } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from 'lucide-react';

interface Tool {
  name: string;
  description: string;
  path: string;
  imageSrc: string;
  access: 'free' | 'signin' | 'premium';
}

const tools: Tool[] = [
  { name: 'QRCode Generator', description: 'Create custom QR codes', path: '/dashboard/tools/qr-code-generator', imageSrc: '/images/tools/1.png', access: 'free' },
  { name: 'Remove Background', description: 'Remove image backgrounds', path: '/dashboard/tools/remove-background', imageSrc: '/images/tools/2.png', access: 'free' },
  { name: 'Compress Image', description: 'Compress images to save space', path: '/dashboard/tools/compress-image', imageSrc: '/images/tools/3.png', access: 'free' },
  { name: 'Add Watermark', description: 'Add watermarks to images', path: '/dashboard/tools/add-watermark', imageSrc: '/images/tools/add-watermark.png', access: 'premium' },
  { name: 'Video to MP4', description: 'Convert videos to MP4 format', path: '/dashboard/tools/video-to-mp4', imageSrc: '/images/tools/video-to-mp4.png', access: 'free' },
  { name: 'Audio to MP3', description: 'Convert audio to MP3 format', path: '/dashboard/tools/audio-to-mp3', imageSrc: '/images/tools/audio-to-mp3.png', access: 'signin' },
  { name: 'Document to PDF', description: 'Convert documents to PDF format', path: '/dashboard/tools/document-to-pdf', imageSrc: '/images/tools/document-to-pdf.png', access: 'signin' },
  { name: 'Image Crop', description: 'Easily crop images', path: '/dashboard/tools/image-crop', imageSrc: '/images/tools/crop.png', access: 'premium' },
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

export default function DashboardHome() {
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const { setIsPricingOpen } = usePricingDialog();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenDialog = localStorage.getItem('hasSeenAccountCreationDialog');
    if (!hasSeenDialog) {
      setShowAccountCreation(true);
    }
    // Simulating data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleCloseAccountCreation = () => {
    setShowAccountCreation(false);
    localStorage.setItem('hasSeenAccountCreationDialog', 'true');
  };

  const getFileIcon = (type: string): LucideIcon => {
    switch (type) {
      case 'document':
        return FileText;
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'folder':
        return Folder;
      default:
        return File;
    }
  };

  return (
    <div className="px-5 py-8 md:py-12 pt-8 md:pt-0">
      {showAccountCreation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
          <div className="absolute bottom-4 right-4">
            <AccountCreation onClose={handleCloseAccountCreation} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 mb-6 text-black pt-16 pb-16">
        <h1 className="text-4xl font-bold">Simply Charming</h1>
        <p className="text-sm">Get work done faster with our automation tools</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Available Tools</CardTitle>
          <p className="text-muted-foreground">Explore our collection of powerful tools to enhance your workflow</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            [...Array(8)].map((_, index) => (
              <Card key={index} className="border-none hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <Skeleton className="w-full h-40" />
                  <Skeleton className="absolute top-2 right-2 w-8 h-8 rounded-full" />
                </div>
                <CardHeader className="p-3">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))
          ) : (
            tools.map((tool) => (
              <Card key={tool.path} className="border-none hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <Link href={tool.path}>
                  <div className="relative">
                    <img src={tool.imageSrc} alt={tool.name} className="w-full h-40 object-cover" />
                    <Badge 
                      variant={getBadgeContent(tool.access).variant}
                      className="absolute top-2 right-2 p-1"
                      title={getBadgeContent(tool.access).tooltip}
                    >
                      {React.createElement(getBadgeContent(tool.access).icon, { size: 16 })}
                    </Badge>
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardHeader>
                </Link>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}