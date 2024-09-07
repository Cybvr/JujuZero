'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, doc, getDocs, setDoc, addDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CustomEditor from '@/components/dashboard/CustomEditor';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Save, ArrowUp, ArrowDown } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('help');
  const [newCategory, setNewCategory] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
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

  const handleMoveSection = (index: number, direction: number) => {
    const newSections = [...editedContent.content.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;
    setEditedContent(prev => ({
      ...prev,
      content: { ...prev.content, sections: newSections }
    }));
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="help">Help Pages</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Pages</TabsTrigger>
          </TabsList>
          <TabsContent value="help">
            <div className="flex space-x-6">
              <Card className="w-1/3">
                <CardHeader>
                  <CardTitle>Help Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pages.map(page => (
                      <li key={page.id} className="flex justify-between items-center">
                        <button onClick={() => handlePageSelect(page)} className="text-blue-500 hover:underline">
                          {page.title}
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePage(page.id)}><Trash2 className="h-4 w-4" /></Button>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => setSelectedPage(null)} className="mt-4" variant="outline"><Plus className="mr-2 h-4 w-4" /> Add New Page</Button>
                </CardContent>
              </Card>
              <Card className="w-2/3">
                <CardHeader>
                  <CardTitle>{selectedPage ? 'Edit Page' : 'New Page'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={editedContent.title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="mb-4"
                    placeholder="Page Title"
                  />
                  <Input
                    type="number"
                    value={editedContent.sortOrder}
                    onChange={(e) => handleContentChange('sortOrder', parseInt(e.target.value))}
                    className="mb-4"
                    placeholder="Sort Order"
                  />
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedContent.categories.map(category => (
                        <span key={category} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                          {category}
                          <button onClick={() => handleRemoveCategory(category)} className="ml-1 text-blue-800 hover:text-blue-900">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select onValueChange={handleSelectCategory}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.map((category, index) => (
                            <SelectItem key={index} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                      />
                      <Button onClick={handleAddCategory}>Add</Button>
                    </div>
                  </div>
                  <CustomEditor
                    value={editedContent.content.intro}
                    onChange={(value) => handleContentChange('content', { ...editedContent.content, intro: value })}
                  />
                  <h3 className="text-lg font-semibold mt-6 mb-4">Sections</h3>
                  {editedContent.content.sections.map((section, index) => (
                    <Card key={index} className="mb-4">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Input
                          value={section.title}
                          onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                          className="font-bold"
                          placeholder="Section Title"
                        />
                        <div className="flex items-center space-x-2">
                          {index > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => handleMoveSection(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
                          )}
                          {index < editedContent.content.sections.length - 1 && (
                            <Button variant="ghost" size="sm" onClick={() => handleMoveSection(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSection(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CustomEditor
                          value={section.content}
                          onChange={(value) => handleSectionChange(index, 'content', value)}
                        />
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={() => setEditedContent(prev => ({
                    ...prev,
                    content: {
                      ...prev.content,
                      sections: [...prev.content.sections, { title: '', content: '' }]
                    }
                  }))} variant="outline" className="mr-2"><Plus className="mr-2 h-4 w-4" /> Add Section</Button>
                  <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Page</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Marketing page editing functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}