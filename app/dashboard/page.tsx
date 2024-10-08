"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { List, Grid, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

interface Tool {
  name: string;
  slug: string;
  imageSrc: string;
}

interface Item {
  id: string;
  name: string;
  description?: string;
  createdAt: { seconds: number; nanoseconds: number };
  type: 'project' | 'document';
}

const tools: Tool[] = [
  { name: 'Visual Summarizer', slug: 'visual-summarizer', imageSrc: '/images/tools/visual-summarizer.png' },
  { name: 'Simple PDF', slug: 'pdf-editor', imageSrc: '/images/tools/pdf-editor.png' },
  { name: 'Remove Background', slug: 'remove-background', imageSrc: '/images/tools/2.png' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', imageSrc: '/images/tools/1.png' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const handleSort = (value: string) => {
    setSortBy(value);
    // Implement sorting logic here
  };

  const filteredItems = recentItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 py-8 sm:py-2 sm:px-0 md:px-2 lg:px-8">
        <h1 className="text-xl font-semibold mb-6 text-foreground">👋 Welcome</h1>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">What's New</h2>
            <Link href="/dashboard/tools" passHref>
              <Button variant="outline">View All Tools</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/dashboard/tools/${tool.slug}`} className="block">
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <img src={tool.imageSrc} alt={tool.name} className="w-full h-32 object-cover" />
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-center">{tool.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent</h2>
            <div className="mb-4 flex items-center w-full space-x-4">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Select onValueChange={handleSort} defaultValue={sortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastModified">Last Modified</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/dashboard/${item.type}s/${item.id}`)}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">No recent items</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="documents">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.filter(item => item.type === 'document').length > 0 ? (
                      filteredItems.filter(item => item.type === 'document').map(item => (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/dashboard/documents/${item.id}`)}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">No recent documents</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {filteredItems.filter(item => item.type === 'document').length === 0 && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => router.push('/dashboard/documents/new')}>
                      Create New Document
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="projects">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.filter(item => item.type === 'project').length > 0 ? (
                      filteredItems.filter(item => item.type === 'project').map(item => (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/dashboard/projects/${item.id}`)}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">No recent projects</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {filteredItems.filter(item => item.type === 'project').length === 0 && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => router.push('/dashboard/projects/new')}>
                      Create New Project
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}