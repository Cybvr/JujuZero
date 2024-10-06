'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Users, DownloadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";

// Define the project type to explicitly list all properties
type Project = {
  name: string;
  tagline?: string;
  logo?: string;
  brandStrategy?: {
    mission?: string;
    vision?: string;
    targetAudience?: string;
    positioning?: string;
  };
  visualIdentity?: {
    logoDescription?: string;
    colorPalette?: string[];
    typography?: {
      primary?: string;
      secondary?: string;
    };
  };
  brandVoice?: {
    toneOfVoice?: string;
    keyMessages?: string[];
  };
  socialMedia?: {
    suggestedPosts?: {
      content: string;
      platform: string;
    }[];
  };
};

export default function ProjectDashboard({ params }: { params: { projectId: string } }) {
  // Define project state with the Project type or null
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching project data for ID: ${params.projectId}`);

        const response = await fetch(`/api/projects/${params.projectId}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          throw new Error(`Failed to fetch project data: ${response.status} ${errorText}`);
        }

        const projectData = await response.json();
        console.log('Fetched project data:', projectData);
        setProject(projectData);
      } catch (error) {
        console.error("Detailed error fetching project data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [params.projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!project) {
    return <div>No project data available.</div>;
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <Breadcrumbs>
        <BreadcrumbItem isActive={false}>
          <Link href="/dashboard/projects">Projects</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isActive={true}>
          {project.name || 'Untitled Project'}
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center space-x-4">
          <Avatar 
              src={project.logo || null} 
              alt={project.name} 
              className="h-20 w-20"
          />
          <div>
            <h1 className="text-3xl font-bold">{project.name || 'Untitled Project'}</h1>
            <p className="text-muted-foreground">{project.tagline || 'No tagline available'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-2 border-gray-300">
            <Users className="mr-2 h-4 w-4" />
            Invite
          </Button>
          <Button variant="outline" className="border-2 border-gray-300">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Brand
          </Button>
        </div>
      </div>

      <Tabs defaultValue="strategy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="strategy">Brand Strategy</TabsTrigger>
          <TabsTrigger value="identity">Visual Identity</TabsTrigger>
          <TabsTrigger value="voice">Brand Voice</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="strategy">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Mission: {project.brandStrategy?.mission || 'Not defined'}</p>
              <p>Vision: {project.brandStrategy?.vision || 'Not defined'}</p>
              <p>Target Audience: {project.brandStrategy?.targetAudience || 'Not defined'}</p>
              <p>Positioning: {project.brandStrategy?.positioning || 'Not defined'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <CardTitle>Visual Identity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Logo Description: {project.visualIdentity?.logoDescription || 'Not defined'}</p>
              <div>
                <p>Color Palette:</p>
                <div className="flex space-x-2 mt-2">
                  {project.visualIdentity?.colorPalette?.map((color, index) => (
                    <div key={index} className="w-10 h-10 rounded-full" style={{ backgroundColor: color }}></div>
                  )) || 'Not defined'}
                </div>
              </div>
              <p>Primary Font: {project.visualIdentity?.typography?.primary || 'Not defined'}</p>
              <p>Secondary Font: {project.visualIdentity?.typography?.secondary || 'Not defined'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tone of Voice: {project.brandVoice?.toneOfVoice || 'Not defined'}</p>
              <div>
                <p>Key Messages:</p>
                <ul className="list-disc list-inside">
                  {project.brandVoice?.keyMessages?.map((message, index) => (
                    <li key={index}>{message}</li>
                  )) || 'Not defined'}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Design details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p>Suggested Posts:</p>
                <ul className="list-disc list-inside">
                  {project.socialMedia?.suggestedPosts?.map((post, index) => (
                    <li key={index}>{post.content} (Platform: {post.platform})</li>
                  )) || 'Not defined'}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
