"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, UserCircle2, Crown, FileText, File, PlusCircle, FolderPlus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import MarketingLandingPage from '@/components/website/LandingPage';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Tool {
  name: string;
  description: string;
  path: string;
  imageSrc: string;
  access: 'free' | 'signin' | 'premium';
}

interface Document {
  id: string;
  title: string;
  lastModified: { seconds: number; nanoseconds: number };
}

const tools: Tool[] = [
  { name: 'QRCode Generator', description: 'Create custom QR codes', path: '/dashboard/tools/qr-code-generator', imageSrc: '/images/tools/1.png', access: 'free' },
  { name: 'Remove Background', description: 'Remove image backgrounds', path: '/dashboard/tools/remove-background', imageSrc: '/images/tools/2.png', access: 'free' },
  { name: 'Compress Image', description: 'Compress images to save space', path: '/dashboard/tools/compress-image', imageSrc: '/images/tools/3.png', access: 'free' },
  { name: 'Video to MP4', description: 'Convert videos to MP4 format', path: '/dashboard/tools/video-to-mp4', imageSrc: '/images/tools/video-to-mp4.png', access: 'free' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (user) {
      fetchRecentDocuments(user.uid);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  async function fetchRecentDocuments(userId: string) {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "documents"),
        where("userId", "==", userId),
        orderBy("lastModified", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Document));
      setRecentDocuments(docs.slice(0, 5)); // Get only the 5 most recent documents
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <LoggedInDashboard user={user} recentDocuments={recentDocuments} />
      ) : (
        <MarketingLandingPage />
      )}
    </div>
  );
}

function LoggedInDashboard({ user, recentDocuments }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="h2">Welcome back, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="h3">Recent Documents</CardTitle>
            <Link href="/dashboard/documents" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentDocuments.length > 0 ? (
              recentDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Link href={`/dashboard/documents/edit/${doc.id}`} className="text-small text-primary hover:underline">
                      {doc.title}
                    </Link>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.lastModified.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-small text-muted-foreground mb-2">No recent documents</p>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="h3">Recent Projects</CardTitle>
            <Link href="/dashboard/projects" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-small text-muted-foreground mb-2">No recent projects</p>
              <Link href="/dashboard/projects/new">
                <Button size="sm">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="h3">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" className="justify-start">
              <File className="mr-2 h-4 w-4" />
              New Document
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Zap className="mr-2 h-4 w-4" />
              Quick Tool
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="h3 mt-8">Available Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Card key={tool.path} className="hover:shadow-md transition-shadow duration-300">
            <Link href={tool.path}>
              <div className="relative">
                <img src={tool.imageSrc} alt={tool.name} className="w-full h-40 object-cover" />
                <Badge 
                  variant={tool.access === 'free' ? "secondary" : tool.access === 'signin' ? "default" : "destructive"}
                  className="absolute top-2 right-2 p-1"
                >
                  {tool.access === 'free' ? <Zap size={16} /> : tool.access === 'signin' ? <UserCircle2 size={16} /> : <Crown size={16} />}
                </Badge>
              </div>
              <CardHeader className="p-3">
                <CardTitle className="text-body">{tool.name}</CardTitle>
                <p className="text-small text-muted-foreground">{tool.description}</p>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-40" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <Skeleton className="h-40 w-full" />
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}