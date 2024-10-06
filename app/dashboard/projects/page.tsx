'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Briefcase } from 'lucide-react';
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
    return <div>Loading...</div>;
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>
      {projects.length === 0 ? (
        <p>You don't have any projects yet. Click 'New Project' to get started!</p>
      ) : (
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
      )}
    </div>
  );
}
