'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { File, FileText, Image, Video, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface FileItem {
  id: string;
  name: string;
  lastModified: string;
  type: string;
}

export default function FolderPage({ params }: { params: { id: string } }) {
  const [folderName, setFolderName] = useState('')
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth();

  const fetchFolderData = async (folderId: string) => {
    if (!user) return;
    setIsLoading(true)
    setError(null)
    try {
      const q = query(
        collection(db, "documents"),
        where("folderId", "==", folderId),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedFiles: FileItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().title,
        lastModified: doc.data().lastModified,
        type: doc.data().type
      }));
      setFiles(fetchedFiles);
      setFolderName(`Folder ${folderId}`); // You might want to fetch the actual folder name if stored separately
    } catch (err) {
      setError('Error fetching folder data. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchFolderData(params.id);
    }
  }, [params.id, user]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'image':
        return <Image className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      <h1 className="text-xl font-bold mb-4">{folderName}</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/documents/${file.id}`} className="flex items-center">
                    {getFileIcon(file.type)}
                    <span className="ml-2">{file.name}</span>
                  </Link>
                </TableCell>
                <TableCell>{file.lastModified}</TableCell>
                <TableCell>{file.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}