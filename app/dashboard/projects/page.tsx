"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Placeholder data for projects
const initialProjects = [
  { id: 1, name: 'Bloom Box', description: 'Premium flower subscription service that delivers curated, seasonal bouquets to homes across the country. Our service aims to bring the joy of fresh flowers to everyone, making it easy to enjoy beautiful arrangements year-round.', createdAt: '2024-07-01' },
  { id: 2, name: 'TechGear', description: 'E-commerce platform for cutting-edge gadgets and technology accessories. We curate the latest and most innovative tech products, providing tech enthusiasts with a one-stop-shop for all their gadget needs.', createdAt: '2024-07-05' },
  { id: 3, name: 'FitQuest', description: 'Gamified fitness tracking app that turns your health journey into an exciting adventure. Set personalized goals, compete with friends, and unlock achievements as you progress towards a healthier lifestyle.', createdAt: '2024-07-10' },
];

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState(initialProjects);

  const handleDeleteProject = (e, id) => {
    e.preventDefault(); // Prevent the link from being followed
    e.stopPropagation(); // Prevent the event from bubbling up to the card
    setProjects(projects.filter(project => project.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </Link>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Welcome to Your Project Dashboard!</CardTitle>
          <CardDescription className="text-sm">Here you can view all your projects, create new ones, and manage your brand assets.</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block">
            <Card className="h-full hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.preventDefault()}>
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
                <CardDescription className="text-xs">Created on: {project.createdAt}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{project.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}