"use client";
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, FileText, Image, Video, Folder, Plus, Grid, List } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: any;
  lastModified: any;
  type: 'document' | 'image' | 'video' | 'folder';
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        fetchDocuments(authUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [documents, searchTerm]);

  async function fetchDocuments(userId: string) {
    setIsLoading(true);
    setError(null);
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
      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (error) {
      setError(`Failed to load documents. Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'folder':
        return <Folder className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredDocuments].sort((a, b) => {
      if (value === 'lastModified') {
        return b.lastModified.seconds - a.lastModified.seconds;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    setFilteredDocuments(sorted);
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  const toggleAllDocuments = () => {
    if (selectedDocuments.size === filteredDocuments.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(filteredDocuments.map(doc => doc.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Documents</h1>
        <Button onClick={() => router.push('/dashboard/documents/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Document
        </Button>
      </div>
      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={handleSort} defaultValue={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastModified">Last Modified</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <span className="text-sm font-medium">
          {selectedDocuments.size} {selectedDocuments.size === 1 ? 'file' : 'files'} selected
        </span>
      </div>
      {viewMode === 'list' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedDocuments.size === filteredDocuments.length}
                    onCheckedChange={toggleAllDocuments}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Last Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDocuments.has(doc.id)}
                      onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/documents/edit/${doc.id}`} className="flex items-center">
                      {getFileIcon(doc.type)}
                      <span className="ml-2">{doc.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell>{doc.lastModified ? new Date(doc.lastModified.seconds * 1000).toLocaleString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Checkbox
                  checked={selectedDocuments.has(doc.id)}
                  onCheckedChange={() => toggleDocumentSelection(doc.id)}
                />
                {getFileIcon(doc.type)}
              </div>
              <Link href={`/dashboard/documents/edit/${doc.id}`}>
                <h3 className="font-medium truncate">{doc.title}</h3>
              </Link>
              <p className="text-sm text-gray-500">
                {doc.lastModified ? new Date(doc.lastModified.seconds * 1000).toLocaleString() : 'N/A'}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}