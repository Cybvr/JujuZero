"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      fetchProjects();
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "projects"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const SkeletonCard = () => (
    <Card className="h-full bg-card/10 backdrop-blur-lg">
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

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Your Projects</h1>
          <Link href="/dashboard/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />New
            </Button>
          </Link>
        </div>
        <Card className="mb-8 bg-card/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Welcome to Your Project Dashboard!</CardTitle>
            <CardDescription>Here you can view all your projects, create new ones, and manage your brand assets.</CardDescription>
          </CardHeader>
        </Card>
        {loading || isLoading ? (
          <SkeletonLoader />
        ) : projects.length === 0 ? (
          <Card className="bg-card/10 backdrop-blur-lg">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-lg mb-4 text-muted-foreground">You haven't created any projects yet.</p>
              <Link href="/dashboard/projects/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block">
                <Card className="h-full hover:shadow-md transition-shadow duration-200 bg-card/10 backdrop-blur-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-primary">{project.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.preventDefault()}>
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleDeleteProject(e, project.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">Created on: {new Date(project.createdAt.seconds * 1000).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}