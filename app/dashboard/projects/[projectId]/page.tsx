"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrandGuidelinesAsset from '@/components/assets/BrandGuidelinesAsset';
import MarketingCopyAsset from '@/components/assets/MarketingCopyAsset';
import LandingPageAsset from '@/components/assets/LandingPageAsset';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Wand2, Share2, Trash2, ArrowLeft, Home, BookOpen, MessageSquare, Layout, Menu, Pencil, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from '@/components/ui/card';

interface ProjectData {
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

const sections = [
  { id: 'brandGuidelines', title: 'Brand Guidelines', icon: BookOpen },
  { id: 'marketingCopy', title: 'Marketing Copy', icon: MessageSquare },
  { id: 'landingPage', title: 'Landing Page', icon: Layout },
];

export default function ProjectDetails({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as ProjectData);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId]);

  const handleAction = async (action: 'regenerate' | 'share' | 'delete') => {
    if (action === 'regenerate') {
      setIsLoading(true);
      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: project?.name, description: project?.description }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        await updateDoc(doc(db, "projects", projectId), { ...data, updatedAt: new Date() });
        setProject(prev => prev ? { ...prev, ...data } : null);
        toast({ title: "Project regenerated", description: "Your project assets have been successfully regenerated." });
      } catch (err) {
        console.error("Error regenerating project:", err);
        toast({ variant: "destructive", title: "Error", description: "Failed to regenerate project. Please try again." });
      } finally {
        setIsLoading(false);
      }
    } else if (action === 'share') {
      toast({ title: "Share feature", description: "Sharing functionality is not implemented yet." });
    } else if (action === 'delete') {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        toast({ title: "Project deleted", description: "Your project has been successfully deleted." });
        router.push('/dashboard/projects');
      } catch (err) {
        console.error("Error deleting project:", err);
        toast({ variant: "destructive", title: "Error", description: "Failed to delete project. Please try again." });
      }
    }
  };

  const handleSave = async (section: string, newContent: any) => {
    try {
      await updateDoc(doc(db, "projects", projectId), { [section]: newContent, updatedAt: new Date() });
      setProject(prev => prev ? { ...prev, [section]: newContent } : null);
      toast({ title: "Changes saved", description: `${section} has been updated.` });
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save changes. Please try again." });
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    try {
      await updateDoc(doc(db, "projects", projectId), { name: newTitle, updatedAt: new Date() });
      setProject(prev => prev ? { ...prev, name: newTitle } : null);
      setIsEditingTitle(false);
      toast({ title: "Title updated", description: "Project title has been successfully updated." });
    } catch (error) {
      console.error("Error updating project title:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update project title. Please try again." });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col space-y-4">
      <Button onClick={() => router.push('/dashboard/projects')} variant="ghost" className="justify-start">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
      </Button>
      <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground text-sm">
        <Home className="mr-2 h-3 w-3" /> Home
      </a>
      {sections.map(({ id, title, icon: Icon }) => (
        <a key={id} onClick={() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          setIsMobileMenuOpen(false);
        }} className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground text-sm">
          <Icon className="mr-2 h-3 w-3" /> {title}
        </a>
      ))}
    </div>
  );

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error || !project) return <div className="flex justify-center items-center h-screen">{error || "An error occurred"}</div>;

  return (
    <div className="min-h-screen bg-accent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-center p-4 bg-background sticky top-0 z-10">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">{project?.name}</h1>
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

          {/* Sidebar - hidden on mobile */}
          <div className="hidden lg:block w-1/5 p-4 sticky top-0 self-start h-screen overflow-y-auto">
            <SidebarContent />
          </div>

          {/* Main content */}
          <div className="w-full lg:w-3/5 p-4 overflow-y-auto">
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
          <div className="hidden lg:block w-16 p-2 sticky top-4 self-start h-screen">
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