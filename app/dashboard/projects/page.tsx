"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';

// Placeholder data for projects
const initialProjects = [
  { id: 1, name: 'Bloom Box', description: 'Premium flower subscription service', createdAt: '2024-07-01' },
  { id: 2, name: 'TechGear', description: 'E-commerce platform for gadgets', createdAt: '2024-07-05' },
  { id: 3, name: 'FitQuest', description: 'Gamified fitness tracking app', createdAt: '2024-07-10' },
];

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState(initialProjects);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to Your Project Dashboard!</CardTitle>
          <CardDescription>Here you can view all your projects, create new ones, and manage your brand assets.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>Created on: {project.createdAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <Link href={`/dashboard/projects/${project.id}`}>
                <Button variant="outline">View Project</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}