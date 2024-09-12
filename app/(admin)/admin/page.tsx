// @app/(admin)/admin/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, doc, getDocs, setDoc, addDoc, deleteDoc, DocumentData, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangelogForm from './ChangelogForm';
import HelpPageForm from './HelpPageForm';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component


interface HelpPage {
  id: string;
  title: string;
  sortOrder: number;
  categories: string[];
  content: {
    intro: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}

interface ChangelogEntry {
  id: string;
  name: string;
  categories: string[];
  content: string;
  images: string[];
  isPublished: boolean;
  updatedAt: Timestamp;
}

export default function ContentAdmin() {
  const [pages, setPages] = useState<HelpPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<HelpPage | null>(null);
  const [editedContent, setEditedContent] = useState<HelpPage>({
    id: '',
    title: '',
    sortOrder: 0,
    categories: [],
    content: { intro: '', sections: [] }
  });
  const [newCategory, setNewCategory] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  const [changelogEntries, setChangelogEntries] = useState<ChangelogEntry[]>([]);
  const [selectedChangelogEntry, setSelectedChangelogEntry] = useState<ChangelogEntry | null>(null);
  const [editedChangelogEntry, setEditedChangelogEntry] = useState<ChangelogEntry>({
    id: '',
    name: '',
    categories: [],
    content: '',
    images: [],
    isPublished: false,
    updatedAt: Timestamp.now()
  });

  useEffect(() => {
    fetchPages();
    fetchChangelogEntries();
  }, []);

  // Help Page functions
  const fetchPages = async () => {
    setLoading(true); // Start loading
    try {
      const querySnapshot = await getDocs(collection(db, "help_pages"));
      const fetchedPages: HelpPage[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          title: data.title || '',
          sortOrder: data.sortOrder || 0,
          categories: data.categories || [],
          content: {
            intro: data.content?.intro || '',
            sections: data.content?.sections || []
          }
        };
      });
      setPages(fetchedPages.sort((a, b) => a.sortOrder - b.sortOrder));

      const uniqueCategories = Array.from(new Set(fetchedPages.flatMap(page => page.categories)));
      setAllCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
    setLoading(false); // Stop loading
  };

  const handlePageSelect = (page: HelpPage) => {
    setSelectedPage(page);
    setEditedContent(page);
  };

  const handleContentChange = (field: keyof HelpPage, value: any) => {
    setEditedContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    const updatedSections = [...editedContent.content.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setEditedContent(prev => ({
      ...prev,
      content: { ...prev.content, sections: updatedSections }
    }));
  };

  const handleSave = async () => {
    if (selectedPage) {
      await setDoc(doc(db, "help_pages", selectedPage.id), editedContent);
    } else {
      await addDoc(collection(db, "help_pages"), editedContent);
    }
    fetchPages();
    setSelectedPage(null);
    setEditedContent({
      id: '',
      title: '',
      sortOrder: 0,
      categories: [],
      content: { intro: '', sections: [] }
    });
  };

  const handleDeletePage = async (pageId: string) => {
    await deleteDoc(doc(db, "help_pages", pageId));
    fetchPages();
    if (selectedPage && selectedPage.id === pageId) {
      setSelectedPage(null);
      setEditedContent({
        id: '',
        title: '',
        sortOrder: 0,
        categories: [],
        content: { intro: '', sections: [] }
      });
    }
  };

  const handleDeleteSection = (index: number) => {
    const updatedSections = editedContent.content.sections.filter((_, i) => i !== index);
    setEditedContent(prev => ({
      ...prev,
      content: { ...prev.content, sections: updatedSections }
    }));
  };

  const handleAddCategory = () => {
    if (newCategory && !editedContent.categories.includes(newCategory)) {
      setEditedContent(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      if (!allCategories.includes(newCategory)) {
        setAllCategories([...allCategories, newCategory]);
      }
      setNewCategory('');
    }
  };

  const handleSelectCategory = (category: string) => {
    if (!editedContent.categories.includes(category)) {
      setEditedContent(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const handleRemoveCategory = (category: string) => {
    setEditedContent(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  // Changelog functions
  const fetchChangelogEntries = async () => {
    setLoading(true); // Start loading
    try {
      const querySnapshot = await getDocs(collection(db, "changelog"));
      const fetchedEntries: ChangelogEntry[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name || '',
          categories: data.categories || [],
          content: data.content || '',
          images: data.images || [],
          isPublished: data.isPublished || false,
          updatedAt: data.updatedAt || Timestamp.now()
        };
      });
      setChangelogEntries(fetchedEntries.sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis()));
    } catch (error) {
      console.error("Error fetching changelog entries:", error);
    }
    setLoading(false); // Stop loading
  };

  const handleChangelogEntrySelect = (entry: ChangelogEntry | null) => {
    setSelectedChangelogEntry(entry);
    setEditedChangelogEntry(entry || {
      id: '',
      name: '',
      categories: [],
      content: '',
      images: [],
      isPublished: false,
      updatedAt: Timestamp.now()
    });
  };

  const handleChangelogEntryChange = (field: keyof ChangelogEntry, value: any) => {
    setEditedChangelogEntry(prev => ({
      ...prev,
      [field]: field === 'images' ? (Array.isArray(value) ? value : []) : value
    }));
  };

  const handleChangelogImageUpload = async (file: File) => {
    if (!storage) {
      console.error('Firebase storage is not initialized');
      return;
    }
    try {
      const storageRef = ref(storage, `changelog/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      handleChangelogEntryChange('images', [...editedChangelogEntry.images, url]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleChangelogSave = async () => {
    const entryToSave = {
      ...editedChangelogEntry,
      updatedAt: Timestamp.now()
    };

    if (selectedChangelogEntry) {
      await setDoc(doc(db, "changelog", selectedChangelogEntry.id), entryToSave);
    } else {
      await addDoc(collection(db, "changelog"), entryToSave);
    }
    fetchChangelogEntries();
    handleChangelogEntrySelect(null);
  };

  const handleChangelogDelete = async (entryId: string) => {
    await deleteDoc(doc(db, "changelog", entryId));
    fetchChangelogEntries();
    if (selectedChangelogEntry && selectedChangelogEntry.id === entryId) {
      handleChangelogEntrySelect(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Image src="/images/logox.png" alt="Logo" width={120} height={40} />
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <Skeleton className="w-full h-96" />
        ) : (
          <Tabs defaultValue="help">
            <TabsList>
              <TabsTrigger value="help">Help Pages</TabsTrigger>
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
            </TabsList>
            <TabsContent value="help">
              <HelpPageForm
                pages={pages}
                selectedPage={selectedPage}
                editedContent={editedContent}
                allCategories={allCategories}
                newCategory={newCategory}
                handlePageSelect={handlePageSelect}
                handleContentChange={handleContentChange}
                handleSectionChange={handleSectionChange}
                handleSave={handleSave}
                handleDeletePage={handleDeletePage}
                handleDeleteSection={handleDeleteSection}
                handleAddCategory={handleAddCategory}
                handleSelectCategory={handleSelectCategory}
                handleRemoveCategory={handleRemoveCategory}
                setNewCategory={setNewCategory}
              />
            </TabsContent>
            <TabsContent value="changelog">
              <ChangelogForm
                changelogEntries={changelogEntries}
                selectedChangelogEntry={selectedChangelogEntry}
                editedChangelogEntry={editedChangelogEntry}
                handleChangelogEntrySelect={handleChangelogEntrySelect}
                handleChangelogEntryChange={handleChangelogEntryChange}
                handleChangelogImageUpload={handleChangelogImageUpload}
                handleChangelogSave={handleChangelogSave}
                handleChangelogDelete={handleChangelogDelete}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}