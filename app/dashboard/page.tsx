"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { FileText, Wand2, QrCode, Image, Video, FileAudio, FileSpreadsheet, Crop, Stamp, PenTool, RefreshCw, Sparkles, FileVideo } from 'lucide-react';
import ToolsSearch from '@/components/dashboard/ToolsSearch';

interface Tool {
  name: string;
  slug: string;
  description: string;
  imageSrc: string;
  category: string;
  access: string;
  icon: React.ElementType;
}

interface Item {
  id: string;
  name: string;
  createdAt: { seconds: number; nanoseconds: number };
  type: 'project' | 'document';
}

const tools: Tool[] = [
  { name: 'Visual Summarizer', slug: 'visual-summarizer', description: 'AI generates infographic-like summaries of long articles or reports.', imageSrc: '/images/tools/visual-summarizer.png', category: 'AI-powered', access: 'free', icon: Wand2 },
  { name: 'Simple PDF', slug: 'simple-pdf', description: 'Simple tool to edit PDF files', imageSrc: '/images/tools/pdf-editor.png', category: 'Workspace', access: 'free', icon: FileText },
  { name: 'Invoice Generator', slug: 'invoice-generator', description: 'Create professional invoices easily', imageSrc: '/images/tools/invoice-generator.png', category: 'Productivity', access: 'free', icon: FileSpreadsheet },
  { name: 'Text Behind Image', slug: 'text-behind-image', description: 'Add text behind your images', imageSrc: '/images/tools/text-behind-image.png', category: 'Design', access: 'free', icon: Image },
  { name: 'Video Notes', slug: 'video-notes', description: 'Generate FAQs, Study Guides, Table of Contents, Timelines, and Briefing Docs from YouTube videos', imageSrc: '/images/tools/video-notes.png', category: 'AI-powered', access: 'free', icon: Video },
  { name: 'Sketch to Image', slug: 'sketch-to-image', description: 'Generate an image from your sketch and description using AI.', imageSrc: '/images/tools/sketch-to-image.png', category: 'AI-powered', access: 'signin', icon: PenTool },
  { name: 'Uncrop', slug: 'uncrop', description: 'Extend or crop your image using AI.', imageSrc: '/images/tools/uncrop.png', category: 'Design', access: 'signin', icon: Crop },
  { name: 'Image Reimagine', slug: 'imagine', description: 'Reimagine your image with AI.', imageSrc: '/images/tools/imagine.png', category: 'AI-powered', access: 'signin', icon: RefreshCw },
  { name: 'Remove Background', slug: 'remove-background', description: 'Remove image backgrounds', imageSrc: '/images/tools/2.png', category: 'Design', access: 'free', icon: Image },
  { name: 'Compress Image', slug: 'compress-image', description: 'Compress images to save space', imageSrc: '/images/tools/3.png', category: 'Design', access: 'free', icon: Image },
  { name: 'Video to MP4', slug: 'video-to-mp4', description: 'Convert videos to MP4 format', imageSrc: '/images/tools/video-to-mp4.png', category: 'Video', access: 'free', icon: FileVideo },
  { name: 'Audio to MP3', slug: 'audio-to-mp3', description: 'Convert audio files to MP3 format.', imageSrc: '/images/tools/audio-to-mp3.png', category: 'Workspace', access: 'signin', icon: FileAudio },
  { name: 'Document to PDF', slug: 'document-to-pdf', description: 'Convert documents like Word, Excel, and PowerPoint to PDF format.', imageSrc: '/images/tools/document-to-pdf.png', category: 'Workspace', access: 'signin', icon: FileText },
  { name: 'Image Crop', slug: 'image-crop', description: 'Crop images easily.', imageSrc: '/images/tools/crop.png', category: 'Design', access: 'premium', icon: Crop },
  { name: 'Add Watermark', slug: 'add-watermark', description: 'Add watermark to images.', imageSrc: '/images/tools/add-watermark.png', category: 'Design', access: 'premium', icon: Stamp },
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create custom QR codes', imageSrc: '/images/tools/1.png', category: 'Productivity', access: 'free', icon: QrCode },
  { name: 'Paraphraser', slug: 'paraphraser', description: 'Rephrase your text using AI.', imageSrc: '/images/tools/paraphraser.png', category: 'AI-powered', access: 'signin', icon: RefreshCw },
  { name: 'Text Summarizer', slug: 'text-summarizer', description: 'Summarize long texts using AI.', imageSrc: '/images/tools/text-summarizer.png', category: 'AI-powered', access: 'signin', icon: Sparkles },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentItems, setRecentItems] = useState<Item[]>([]);

  useEffect(() => {
    if (user) {
      fetchRecentItems();
    }
  }, [user]);

  const fetchRecentItems = async () => {
    if (!user) return;
    const projectsQuery = query(
      collection(db, "projects"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const documentsQuery = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const [projectsSnapshot, documentsSnapshot] = await Promise.all([
      getDocs(projectsQuery),
      getDocs(documentsQuery)
    ]);
    const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'project' } as Item));
    const documents = documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'document', name: doc.data().title } as Item));
    setRecentItems([...projects, ...documents].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-0 lg:px-8 md:px-2 md:px-4 py-4 sm:py-2 md:py-2 lg:py-2">
        <div className="mb-8 p-6 rounded-lg bg-[url('/images/background.png')] bg-cover bg-center text-white shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">👋 Welcome</h1>
          <ToolsSearch />
        </div>

        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 pb-4">
            {tools.map((tool) => (
              <div key={tool.slug} className="flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-2">
                  <tool.icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <span className="text-sm text-center whitespace-nowrap text-foreground">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.filter(item => item.type === 'document').map((doc) => (
                <Card 
                  key={doc.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-card"
                  onClick={() => router.push(`/dashboard/documents/edit/${doc.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-card-foreground">
                      <FileText className="mr-2" />
                      {doc.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Created: {new Date(doc.createdAt.seconds * 1000).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {recentItems.filter(item => item.type === 'document').length === 0 && (
              <div className="flex justify-center mt-4">
                <Button onClick={() => router.push('/dashboard/documents/new')}>
                  Create New Document
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}