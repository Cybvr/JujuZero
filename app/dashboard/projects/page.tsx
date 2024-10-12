"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Briefcase, LayoutGrid, List } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the interface for project data
interface ProjectTypeInterface {
  id: string;
  name: string;
  tagline?: string;
}

export default function ProjectsListPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectTypeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "projects"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const projectsData: ProjectTypeInterface[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Project', // Ensure the project always has a name
            tagline: data.tagline,
          };
        });
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Function to generate a pastel color based on the project name
  const generatePastelColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-normal">Projects</h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => setViewMode('grid')} className="p-2 bg-background border border-input rounded-md shadow-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode('list')} className="p-2 bg-background border border-input rounded-md shadow-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
            <List className="h-5 w-5" />
          </button>
          <Link href="/dashboard/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-background border border-input rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          <option value="date">Date modified</option>
          <option value="name">Name</option>
          <option value="relevant">Most relevant</option>
        </select>
      </div>

      {projects.length === 0 ? (
        <p>You don't have any projects yet. Click 'New' to get started!</p>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
              <Card className="hover:shadow-lg transition-shadow duration-200 flex items-start p-4">
                <div 
                  className="w-12 h-12 rounded-lg mr-4 flex items-center justify-center" 
                  style={{ backgroundColor: generatePastelColor(project.name) }}
                >
                  <Briefcase className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-grow">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="text-sm">{project.tagline}</CardDescription>
                  </CardHeader>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-border">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-accent hover:text-accent-foreground">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div 
                          className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center" 
                          style={{ backgroundColor: generatePastelColor(project.name) }}
                        >
                          <Briefcase className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-primary truncate">{project.name}</div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="truncate">{project.tagline}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}