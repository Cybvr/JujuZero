"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, UserCircle2, Crown, StarOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { Button } from "@/components/ui/button";

interface Tool {
  name: string;
  description: string;
  slug: string;
  imageSrc: string;
  category: string;
  access: 'free' | 'signin' | 'premium';
}

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

export default function MyTools() {
  const router = useRouter();
  const { user } = useAuth();
  const [myTools, setMyTools] = useState<Tool[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const savedMyTools = JSON.parse(localStorage.getItem('myTools') || '[]');
    setMyTools(savedMyTools);
  }, []);

  const handleCardClick = (slug: string, access: string) => {
    if (access === 'free') {
      router.push(`/dashboard/tools/${slug}`);
    } else if ((access === 'signin' || access === 'premium') && !user) {
      setShowAuthModal(true);
    } else {
      router.push(`/dashboard/tools/${slug}`);
    }
  };

  const handleRemoveFromMyTools = (slug: string) => {
    const updatedMyTools = myTools.filter(tool => tool.slug !== slug);
    setMyTools(updatedMyTools);
    localStorage.setItem('myTools', JSON.stringify(updatedMyTools));
  };

  if (myTools.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex flex-col items-center">
              <Image src="/images/tools/Nature.svg" alt="Nature" width={160} height={160} className="mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Nothing yet. Still Tending  😔</h2>
              <p className="text-muted-foreground mb-6">
                You have to sign in to save your favorite tools
              </p>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href="/dashboard/tools">
                    Explore Tools
                  </Link>
                </Button>
                {!user && (
                  <Button variant="outline" asChild>
                    <Link href="/login">
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="h1">My Tools</h1>
        <p className="text-body text-muted-foreground">Your personal collection of tools</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myTools.map((tool) => (
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
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveFromMyTools(tool.slug); }}
                className="absolute top-2 left-2 p-1 bg-white rounded-full"
                title="Remove from My Tools"
              >
                <StarOff className="text-gray-500" />
              </button>
            </div>
            <CardHeader className="p-4">
              {tool.name && <CardTitle className="h3">{tool.name}</CardTitle>}
              {tool.description && <p className="text-small text-muted-foreground mt-1">{tool.description}</p>}
            </CardHeader>
          </Card>
        ))}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}