"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export default function ProjectsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchProjects();
      } else {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  const fetchProjects = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const q = query(collection(db, "projects"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load projects. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (projectToDelete) {
      try {
        await deleteDoc(doc(db, "projects", projectToDelete.id));
        setProjects(projects.filter(project => project.id !== projectToDelete.id));
        toast({
          title: "Project deleted",
          description: "Your project has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete project. Please try again.",
        });
      } finally {
        setProjectToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleRenameProject = async () => {
    if (projectToRename && newProjectName.trim()) {
      try {
        await updateDoc(doc(db, "projects", projectToRename.id), {
          name: newProjectName.trim()
        });
        setProjects(projects.map(project => 
          project.id === projectToRename.id ? { ...project, name: newProjectName.trim() } : project
        ));
        toast({
          title: "Project renamed",
          description: "Your project has been successfully renamed.",
        });
      } catch (error) {
        console.error("Error renaming project:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to rename project. Please try again.",
        });
      } finally {
        setProjectToRename(null);
        setNewProjectName('');
        setIsRenameDialogOpen(false);
      }
    }
  };

  const SkeletonCard = () => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardContent>
    </Card>
  );

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view projects.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Your Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />New Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-lg mb-4">You haven't created any projects yet.</p>
            <Link href="/dashboard/projects/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/dashboard/projects/${project.id}`} key={project.id} passHref>
              <Card className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{project.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.preventDefault()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setProjectToRename(project);
                          setNewProjectName(project.name);
                          setIsRenameDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setProjectToDelete(project);
                          setIsDeleteDialogOpen(true);
                        }}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    Created on: {new Date(project.createdAt.seconds * 1000).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}