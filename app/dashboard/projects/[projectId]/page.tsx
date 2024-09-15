"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrandGuidelinesAsset from '@/components/assets/BrandGuidelinesAsset';
import MarketingCopyAsset from '@/components/assets/MarketingCopyAsset';
import LandingPageAsset from '@/components/assets/LandingPageAsset';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Wand2, Share2, Trash2, ArrowLeft, Home, BookOpen, MessageSquare, Layout, ChevronDown, Pencil, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  id: string;
  name: string;
  description: string;
  brandGuidelines: {
    colors: string[];
    logos: string[];
    typography: string[];
    brandValues: string[];
    tagline: string;
    missionStatement: string;
  };
  marketingCopy: string;
  landingPage: string;
  tokenCount?: number;
}

export default function ProjectDetails({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', params.projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          toast({
            title: "Project not found",
            description: "The requested project does not exist.",
            variant: "destructive",
          });
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to fetch project details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.projectId, router, toast]);

  const handleTitleChange = async (newTitle: string) => {
    if (!project) return;
    setIsEditingTitle(false);
    try {
      const docRef = doc(db, 'projects', project.id);
      await updateDoc(docRef, { name: newTitle });
      setProject(prev => prev ? { ...prev, name: newTitle } : null);
      toast({
        title: "Success",
        description: "Project title updated successfully.",
      });
    } catch (error) {
      console.error("Error updating project title:", error);
      toast({
        title: "Error",
        description: "Failed to update project title.",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (action: 'regenerate' | 'share' | 'delete') => {
    if (!project) return;
    setIsLoading(true);
    try {
      switch (action) {
        case 'regenerate':
          // Implement regenerate logic here
          break;
        case 'share':
          // Implement share logic here
          break;
        case 'delete':
          await deleteDoc(doc(db, 'projects', project.id));
          toast({
            title: "Success",
            description: "Project deleted successfully.",
          });
          router.push('/dashboard');
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} project.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (section: keyof Project, newContent: any) => {
    if (!project) return;
    try {
      const docRef = doc(db, 'projects', project.id);
      await updateDoc(docRef, { [section]: newContent });
      setProject(prev => prev ? { ...prev, [section]: newContent } : null);
      toast({
        title: "Success",
        description: `${section} updated successfully.`,
      });
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${section}.`,
        variant: "destructive",
      });
    }
  };

  const sections = [
    { id: 'brandGuidelines', title: 'Brand Guidelines' },
    { id: 'marketingCopy', title: 'Marketing Copy' },
    { id: 'landingPage', title: 'Landing Page' },
  ];

  const SidebarContent = () => (
    <nav className="space-y-2">
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      {sections.map(({ id, title }) => (
        <Button key={id} variant="ghost" className="w-full justify-start" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}>
          {title}
        </Button>
      ))}
    </nav>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-accent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Mobile Header */}
          <div className="lg:hidden bg-background sticky top-0 z-10 p-4">
            <Collapsible open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <div className="flex justify-between items-center">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost">
                    Menu <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </CollapsibleTrigger>
                <div className="flex space-x-2">
                  <Button onClick={() => handleAction('regenerate')} size="icon" variant="ghost">
                    <Wand2 className="h-5 w-5" />
                  </Button>
                  <Button onClick={() => handleAction('share')} size="icon" variant="ghost">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this project? This action is irreversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction('delete')} className="bg-red-500">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CollapsibleContent className="mt-4">
                <SidebarContent />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Sidebar - hidden on mobile */}
          <div className="hidden lg:block w-48 p-4 sticky top-0 self-start h-screen overflow-y-auto">
            <SidebarContent />
          </div>

          {/* Main content */}
          <div className="w-full lg:flex-1 p-4 overflow-y-auto">
            <div className="bg-accent shadow-sm rounded-lg p-4 mb-4">
              {isEditingTitle ? (
                <Input
                  value={project?.name || ''}
                  onChange={(e) => setProject(prev => prev ? { ...prev, name: e.target.value } : null)}
                  onBlur={(e) => handleTitleChange(e.target.value)}
                  className="text-2xl font-semibold"
                  autoFocus
                />
              ) : (
                <h1 className="text-2xl font-semibold flex items-center">
                  {project?.name}
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingTitle(true)} className="ml-2">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </h1>
              )}
            </div>
            {sections.map(({ id, title }) => (
              <Card key={id} className="bg-accent border-0 shadow-sm p-2 mb-4" id={id}>
                <CardContent className="p-0">
                  {id === 'brandGuidelines' && (
                    <BrandGuidelinesAsset content={project.brandGuidelines} onSave={(newContent) => handleSave(id, newContent)} />
                  )}
                  {id === 'marketingCopy' && (
                    <MarketingCopyAsset content={project.marketingCopy} onSave={(newContent) => handleSave(id, newContent)} />
                  )}
                  {id === 'landingPage' && (
                    <LandingPageAsset content={project.landingPage} onSave={(newContent) => handleSave(id, newContent)} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Toolbar - hidden on mobile */}
          <div className="hidden lg:block w-16 p-2 pr-2 sticky top-4 self-start h-screen">
            <div className="flex flex-col space-y-2 bg-background p-2">
              <Button onClick={() => handleAction('regenerate')} disabled={isLoading} className="p-2 bg-transparent">
                <Wand2 className="h-4 w-4 text-black" />
              </Button>
              <Button onClick={() => handleAction('share')} disabled={isLoading} className="p-2 bg-transparent">
                <Share2 className="h-4 w-4 text-black" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" disabled={isLoading} className="p-2 bg-transparent">
                    <Trash2 className="h-4 w-4 text-black" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this project? This action is irreversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAction('delete')} className="bg-red-500">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}