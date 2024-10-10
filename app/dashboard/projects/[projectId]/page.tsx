// ProjectDashboard.tsx
'use client';

import React, { Suspense } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import BrandMetrics from '@/components/dashboard/BrandMetrics';
import ProjectHeader from '@/components/dashboard/ProjectHeader';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useProject } from '@/hooks/useProject';
import BrandStrategyTab from './../tabs/BrandStrategyTab';
import VisualIdentityTab from './../tabs/VisualIdentityTab';
import BrandVoiceTab from './../tabs/BrandVoiceTab';
import SocialMediaTab from './../tabs/SocialMediaTab';

export default function ProjectDashboard({ params }: { params: { projectId: string } }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectDashboardContent projectId={params.projectId} />
      </Suspense>
    </ErrorBoundary>
  );
}

function ProjectDashboardContent({ projectId }: { projectId: string }) {
  const { project, loading, error, updateProject, saveProject } = useProject(projectId);
  const { user } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!project) {
    return <div className="p-4">No project data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-8">
      <ProjectHeader 
        projectName={project.name}
        projectTagline={project.tagline}
        projectLogo={project.logo}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <Tabs defaultValue="strategy" className="space-y-6">
            <TabsList className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2 mb-4 justify-start no-scrollbar">
              <TabsTrigger value="strategy" className="px-4 py-2 flex-shrink-0">Brand Strategy</TabsTrigger>
              <TabsTrigger value="identity" className="px-4 py-2 flex-shrink-0">Visual Identity</TabsTrigger>
              <TabsTrigger value="voice" className="px-4 py-2 flex-shrink-0">Brand Voice</TabsTrigger>
              <TabsTrigger value="social" className="px-4 py-2 flex-shrink-0">Social Media</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy">
              <BrandStrategyTab 
                brandStrategy={project.brandStrategy}
                updateProject={updateProject}
                saveProject={saveProject}
              />
            </TabsContent>

            <TabsContent value="identity">
              <VisualIdentityTab 
                visualIdentity={project.visualIdentity}
                updateProject={updateProject}
                saveProject={saveProject}
              />
            </TabsContent>

            <TabsContent value="voice">
              <BrandVoiceTab 
                brandVoice={project.brandVoice}
                updateProject={updateProject}
                saveProject={saveProject}
              />
            </TabsContent>

            <TabsContent value="social">
              <SocialMediaTab 
                socialMedia={project.socialMedia}
                updateProject={updateProject}
                saveProject={saveProject}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Brand Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandMetrics 
                healthScore={85}
                healthMessage="Your brand is strong. Keep up the good work!"
                achievements={["Social Media Guru", "Content Creator", "Brand Strategist"]}
                level={3}
                xp={65}
                maxXp={100}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}