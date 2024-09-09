"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, UserCircle2, Crown, FileText, File, PlusCircle, FolderPlus, Star, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Tool {
  name: string;
  description: string;
  slug: string;
  imageSrc: string;
  access: 'free' | 'signin' | 'premium';
}

const tools: Tool[] = [
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create custom QR codes easily.', imageSrc: '/images/tools/1.png', access: 'free' },
  { name: 'Remove Background', slug: 'remove-background', description: 'Easily remove image backgrounds.', imageSrc: '/images/tools/2.png', access: 'free' },
  { name: 'Compress Image', slug: 'compress-image', description: 'Reduce image file size without losing quality.', imageSrc: '/images/tools/3.png', access: 'free' },
  { name: 'Video to MP4', slug: 'video-to-mp4', description: 'Convert various video formats to MP4.', imageSrc: '/images/tools/video-to-mp4.png', access: 'free' },
];

const getBadgeContent = (access: string): { icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline"; tooltip: string } => {
  switch (access) {
    case 'free':
      return { icon: Zap, variant: "secondary", tooltip: 'Free - No account required' }
    case 'signin':
      return { icon: UserCircle2, variant: "default", tooltip: 'Sign In Required' }
    case 'premium':
      return { icon: Crown, variant: "destructive", tooltip: 'Premium Feature' }
    default:
      return { icon: Zap, variant: "outline", tooltip: 'Unknown' }
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [myTools, setMyTools] = React.useState<Tool[]>([]);

  React.useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedMyTools = JSON.parse(localStorage.getItem('myTools') || '[]');
    setFavorites(savedFavorites);
    setMyTools(savedMyTools);
  }, []);

  const handleFavoriteToggle = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prevFavorites) =>
      prevFavorites.includes(slug)
        ? prevFavorites.filter((favorite) => favorite !== slug)
        : [...prevFavorites, slug]
    );
  }

  const handleAddToMyTools = (e: React.MouseEvent, tool: Tool) => {
    e.preventDefault();
    e.stopPropagation();
    setMyTools((prevTools) => {
      if (!prevTools.some(t => t.slug === tool.slug)) {
        return [...prevTools, tool];
      }
      return prevTools;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="h3 mb-6 text-foreground">👋 Welcome</h1>

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="h3 text-card-foreground">Recent Documents</CardTitle>
                <Link href="/dashboard/documents" className="text-sm text-primary hover:text-primary/80">
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <p className="text-small text-muted-foreground mb-2">No recent documents</p>
                  <Button size="sm" variant="secondary">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="h3 text-card-foreground">Recent Projects</CardTitle>
                <Link href="/dashboard/projects" className="text-sm text-primary hover:text-primary/80">
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <p className="text-small text-muted-foreground mb-2">No recent projects</p>
                  <Link href="/dashboard/projects/new" passHref>
                    <Button size="sm" variant="secondary">
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Create New Project
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="h3 text-card-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="justify-start text-muted-foreground hover:text-card-foreground hover:bg-secondary/50">
                  <File className="mr-2 h-4 w-4" />
                  New Document
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-muted-foreground hover:text-card-foreground hover:bg-secondary/50">
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Tool
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-muted-foreground hover:text-card-foreground hover:bg-secondary/50">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <h2 className="h3 mt-8 mb-6 text-foreground">🔥 New</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/dashboard/tools/${tool.slug}`} className="block">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer bg-card">
                <div className="relative">
                  <img src={tool.imageSrc} alt={tool.name} className="w-full h-40 object-cover" />
                  <Badge 
                    variant={getBadgeContent(tool.access).variant}
                    className="absolute top-2 right-2 p-1"
                    title={getBadgeContent(tool.access).tooltip}
                  >
                    {React.createElement(getBadgeContent(tool.access).icon, { size: 14 })}
                  </Badge>
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <button
                      onClick={(e) => handleFavoriteToggle(e, tool.slug)}
                      className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                      title={favorites.includes(tool.slug) ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                      <Star className={`h-4 w-4 ${favorites.includes(tool.slug) ? "text-yellow-500 fill-current" : "text-gray-500"}`} />
                    </button>
                    <button
                      onClick={(e) => handleAddToMyTools(e, tool)}
                      className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                      title={myTools.some(t => t.slug === tool.slug) ? 'Added to My Tools' : 'Add to My Tools'}
                    >
                      <Plus className={`h-4 w-4 ${myTools.some(t => t.slug === tool.slug) ? "text-green-500" : "text-gray-500"}`} />
                    </button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-1 text-card-foreground">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}