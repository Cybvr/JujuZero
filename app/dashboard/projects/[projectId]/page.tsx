'use client';

import React, { Suspense, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProjectHeader from "@/components/dashboard/ProjectHeader";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useProject } from "@/hooks/useProject";
import ProjectInfoCanvas from "@/components/dashboard/ProjectInfoCanvas";
import { Project } from '@/hooks/types';

export default function ProjectDashboard({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectDashboardContent projectId={params.projectId} />
      </Suspense>
    </ErrorBoundary>
  );
}

function ProjectDashboardContent({ projectId }: { projectId: string }) {
  const [currentSection, setCurrentSection] = useState<'strategy' | 'identity' | 'voice' | 'social'>('strategy');
  const { project, loading, error, updateProject: originalUpdateProject, saveProject: originalSaveProject } = useProject(projectId);

  const updateProject = (updatedProject: Partial<Project>) => {
    Object.entries(updatedProject).forEach(([key, value]) => {
      originalUpdateProject(key as keyof Project, value);
    });
  };

  const saveProject = async (section: keyof Project) => {
    await originalSaveProject(section);
  };

  const navigateToNextSection = () => {
    const sections: Array<typeof currentSection> = ['strategy', 'identity', 'voice', 'social'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    }
  };

  const navigateToPreviousSection = () => {
    const sections: Array<typeof currentSection> = ['strategy', 'identity', 'voice', 'social'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        Loading...
      </div>
    );
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
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-8 bg-background text-foreground">
      <ProjectHeader
        projectName={project.name}
        projectTagline={project.tagline}
        projectLogo={project.logo}
      />
      <div className="w-full lg:w-3/4 mx-auto my-8">
        <ProjectInfoCanvas project={project} updateProject={updateProject} />
        <div className="w-full lg:w-3/4">
        </div>
      </div>
    </div>
  );
}
