'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/context/AuthContext';
import BrandMetrics from '@/components/dashboard/BrandMetrics';
import ProjectHeader from '@/components/dashboard/ProjectHeader';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ErrorBoundary from '@/components/ErrorBoundary';

// Define Project type
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
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${params.projectId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch project data: ${response.status}`);
        }
        const projectData = await response.json();
        if (isMounted) {
          setProject(projectData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Detailed error fetching project data:", error);
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjectData();

    return () => {
      isMounted = false;
    };
  }, [params.projectId]);

  const handleInputChange = (
    section: keyof Project,
    field: string,
    value: any,
    nestedField?: string
  ) => {
    setProject(prev => {
      if (!prev) return prev;

      const sectionData = prev[section] || {};

      if (nestedField && typeof sectionData === 'object') {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: {
              ...(sectionData[field] as object),
              [nestedField]: value
            }
          }
        };
      }

      if (typeof sectionData === 'object') {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }

      // Handle case where section is not an object
      return {
        ...prev,
        [section]: value
      };
    });
  };

  const handleSave = async (section: keyof Project) => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [section]: project?.[section] }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      console.log(`${section} updated successfully`);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

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
    <ErrorBoundary>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Strategy Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="mission" className="block text-sm font-medium mb-2">Mission:</label>
                        <Textarea
                          id="mission"
                          value={project.brandStrategy?.mission || ''}
                          onChange={(e) => handleInputChange('brandStrategy', 'mission', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label htmlFor="vision" className="block text-sm font-medium mb-2">Vision:</label>
                        <Textarea
                          id="vision"
                          value={project.brandStrategy?.vision || ''}
                          onChange={(e) => handleInputChange('brandStrategy', 'vision', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label htmlFor="targetAudience" className="block text-sm font-medium mb-2">Target Audience:</label>
                        <Textarea
                          id="targetAudience"
                          value={project.brandStrategy?.targetAudience || ''}
                          onChange={(e) => handleInputChange('brandStrategy', 'targetAudience', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label htmlFor="positioning" className="block text-sm font-medium mb-2">Positioning:</label>
                        <Textarea
                          id="positioning"
                          value={project.brandStrategy?.positioning || ''}
                          onChange={(e) => handleInputChange('brandStrategy', 'positioning', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <Button onClick={() => handleSave('brandStrategy')} className="w-full sm:w-auto">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="identity">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Visual Identity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="logoDescription" className="block text-sm font-medium mb-2">Logo Description:</label>
                        <Textarea
                          id="logoDescription"
                          value={project.visualIdentity?.logoDescription || ''}
                          onChange={(e) => handleInputChange('visualIdentity', 'logoDescription', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Color Palette:</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.visualIdentity?.colorPalette?.map((color, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <Input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const newPalette = [...(project.visualIdentity?.colorPalette || [])];
                                  newPalette[index] = e.target.value;
                                  handleInputChange('visualIdentity', 'colorPalette', newPalette);
                                }}
                                className="w-12 h-12 p-1 rounded-full"
                              />
                              <span className="text-xs mt-1">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="primaryFont" className="block text-sm font-medium mb-2">Primary Font:</label>
                        <Input
                          id="primaryFont"
                          value={project.visualIdentity?.typography?.primary || ''}
                          onChange={(e) => handleInputChange('visualIdentity', 'typography', e.target.value, 'primary')}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="secondaryFont" className="block text-sm font-medium mb-2">Secondary Font:</label>
                        <Input
                          id="secondaryFont"
                          value={project.visualIdentity?.typography?.secondary || ''}
                          onChange={(e) => handleInputChange('visualIdentity', 'typography', e.target.value, 'secondary')}
                          className="w-full"
                        />
                      </div>
                      <Button onClick={() => handleSave('visualIdentity')} className="w-full sm:w-auto">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Brand Voice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="toneOfVoice" className="block text-sm font-medium mb-2">Tone of Voice:</label>
                        <Textarea
                          id="toneOfVoice"
                          value={project.brandVoice?.toneOfVoice || ''}
                          onChange={(e) => handleInputChange('brandVoice', 'toneOfVoice', e.target.value)}
                          className="w-full"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Key Messages:</label>
                        {project.brandVoice?.keyMessages?.map((message, index) => (
                          <Input
                            key={index}
                            value={message}
                            onChange={(e) => {
                              const newMessages = [...(project.brandVoice?.keyMessages || [])];
                              newMessages[index] = e.target.value;
                              handleInputChange('brandVoice', 'keyMessages', newMessages);
                            }}
                            className="w-full mt-2"
                          />
                        ))}
                      </div>
                      <Button onClick={() => handleSave('brandVoice')} className="w-full sm:w-auto">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Social Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <label className="block text-sm font-medium mb-2">Suggested Posts:</label>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {project.socialMedia?.suggestedPosts?.map((post, index) => (
                          <div key={index} className="mb-4 p-4 bg-muted rounded-lg">
                            <Textarea
                              value={post.content}
                              onChange={(e) => {
                                const newPosts = [...(project.socialMedia?.suggestedPosts || [])];
                                newPosts[index] = { ...post, content: e.target.value };
                                handleInputChange('socialMedia', 'suggestedPosts', newPosts);
                              }}
                              className="w-full mb-2"
                              rows={3}
                            />
                            <Input
                              value={post.platform}
                              onChange={(e) => {
                                const newPosts = [...(project.socialMedia?.suggestedPosts || [])];
                                newPosts[index] = { ...post, platform: e.target.value };
                                handleInputChange('socialMedia', 'suggestedPosts', newPosts);
                              }}
                              className="w-full"
                              placeholder="Platform"
                            />
                          </div>
                        ))}
                      </ScrollArea>
                      <Button onClick={() => handleSave('socialMedia')} className="w-full sm:w-auto">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
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
    </ErrorBoundary>
  );
}