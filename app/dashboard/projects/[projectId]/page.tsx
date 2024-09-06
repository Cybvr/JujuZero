"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Image, Code, Share2, PlusCircle, Settings } from 'lucide-react';

// Placeholder data - in a real app, you'd fetch this based on the projectId
const projectData = {
  id: '1',
  name: 'Bloom Box',
  description: 'Premium flower subscription service that delivers curated, seasonal bouquets to homes.',
  createdAt: '2024-07-01',
  assets: [
    { id: '1', name: 'Logo', type: 'image' },
    { id: '2', name: 'Brand Guidelines', type: 'document' },
    { id: '3', name: 'Marketing Copy', type: 'text' },
    { id: '4', name: 'Landing Page', type: 'html' },
    { id: '5', name: 'Social Media Assets', type: 'image' },
  ]
};

export default function ProjectDetails({ params }) {
  const router = useRouter();
  const { projectId } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="ghost"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" /> Project Settings
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{projectData.name}</CardTitle>
              <CardDescription>{projectData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Created on: {projectData.createdAt}</p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Project Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {projectData.assets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                  <CardDescription>{asset.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">View Asset</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Asset
          </Button>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" /> Export as PDF
              </Button>
              <Button className="w-full justify-start">
                <Image className="mr-2 h-4 w-4" /> Export Images
              </Button>
              <Button className="w-full justify-start">
                <Code className="mr-2 h-4 w-4" /> Export Code
              </Button>
              <Button className="w-full justify-start">
                <Share2 className="mr-2 h-4 w-4" /> Share Project
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total Assets: {projectData.assets.length}</p>
              {/* Add more statistics here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}