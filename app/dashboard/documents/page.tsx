"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ChevronDown, LayoutGrid, List, Star, MoreHorizontal, Plus, Check } from 'lucide-react';
import Link from 'next/link';

interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: { seconds: number; nanoseconds: number };
  lastModified: { seconds: number; nanoseconds: number };
  type: string;
  thumbnail?: string;
}

const colorPalette = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState('date');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "documents"),
        where("userId", "==", user.uid),
        orderBy("lastModified", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Document));
      setDocuments(docs);
    } catch (error) {
      setError(`Failed to load documents. Please try again later.`);
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
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

  const getColorForDocument = (docId: string) => {
    const index = docId.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-16 lg:py-8 md:py-8 sm:py-8">
      <h1 className="text-2xl font-normal mb-6 text-foreground">Documents</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-background border border-input rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <option value="date">Date modified</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="relevant">Most relevant</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto">
          <button onClick={() => setViewMode('grid')} className="p-2 bg-background border border-input rounded-md shadow-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode('list')} className="p-2 bg-background border border-input rounded-md shadow-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
            <List className="h-5 w-5" />
          </button>
          <Link href="/dashboard/documents/new">
            <button className="px-4 py-2 bg-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
              <Plus className="inline-block mr-2 h-4 w-4" /> Add new
            </button>
          </Link>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-card shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-border">
            {documents.map((doc) => (
              <li key={doc.id}>
                <Link href={`/dashboard/documents/edit/${doc.id}`}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-12 w-12 ${getColorForDocument(doc.id)} rounded-md flex items-center justify-center`}>
                          {doc.thumbnail ? (
                            <img src={doc.thumbnail} alt="" className="h-10 w-10 rounded-md object-cover" />
                          ) : (
                            <div className="text-white font-semibold">{doc.title.charAt(0)}</div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-primary truncate">{doc.title}</div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="truncate">{doc.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex -space-x-1 overflow-hidden">
                          {/* Placeholder for user avatars */}
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex items-center space-x-2">
                      <div onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDocumentSelection(doc.id);
                      }} className="cursor-pointer text-muted-foreground hover:text-foreground">
                        {selectedDocuments.has(doc.id) ? <Check className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                      </div>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.map((doc) => (
            <Link href={`/dashboard/documents/edit/${doc.id}`} key={doc.id}>
              <div className="bg-card overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className={`flex-shrink-0 h-40 w-full ${getColorForDocument(doc.id)} rounded-md flex items-center justify-center mb-4`}>
                    {doc.thumbnail ? (
                      <img src={doc.thumbnail} alt="" className="h-full w-full object-cover rounded-md" />
                    ) : (
                      <div className="text-white font-semibold text-4xl">{doc.title.charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-foreground truncate">{doc.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{doc.type}</p>
                </div>
                <div className="bg-muted px-5 py-3 flex justify-between items-center">
                  <div className="flex -space-x-1 overflow-hidden">
                    {/* Placeholder for user avatars */}
                  </div>
                  <div className="flex space-x-2">
                    <div onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDocumentSelection(doc.id);
                    }} className="cursor-pointer text-muted-foreground hover:text-foreground">
                      {selectedDocuments.has(doc.id) ? <Check className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}