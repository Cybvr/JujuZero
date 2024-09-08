"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Image, Code, Share2, Settings, Wand2 } from 'lucide-react';
import CustomEditor from '@/components/dashboard/CustomEditor';

// Import asset components
import BrandGuidelinesAsset from '@/components/assets/BrandGuidelinesAsset';
import MarketingCopyAsset from '@/components/assets/MarketingCopyAsset';
import LandingPageAsset from '@/components/assets/LandingPageAsset';

// Placeholder data - in a real app, you'd fetch this based on the projectId
const projectData = {
  id: '1',
  name: 'Bloom Box',
  description: 'Premium flower subscription service that delivers curated, seasonal bouquets to homes.',
  createdAt: '2024-07-01',
  assets: [
    { id: '1', name: 'Brand Guidelines', type: 'brandGuidelines', content: { logo: '/path/to/logo.png', colors: ['#FF0000', '#00FF00', '#0000FF'], typography: 'Typography content...' } },
    { id: '2', name: 'Marketing Copy', type: 'marketingCopy', content: 'Marketing copy content...' },
    { id: '3', name: 'Landing Page', type: 'landingPage', content: '<h1>Welcome to Bloom Box</h1>' },
  ]
};

export default function ProjectDetails({ params }) {
  const router = useRouter();
  const { projectId } = params;
  const [assets, setAssets] = useState(projectData.assets);

  const handleAssetChange = (assetId, newContent) => {
    setAssets(prevAssets => prevAssets.map(asset => 
      asset.id === assetId ? { ...asset, content: newContent } : asset
    ));
  };

  const renderAsset = (asset) => {
    switch (asset.type) {
      case 'brandGuidelines':
        return <BrandGuidelinesAsset content={asset.content} onChange={(newContent) => handleAssetChange(asset.id, newContent)} />;
      case 'marketingCopy':
        return <MarketingCopyAsset content={asset.content} onChange={(newContent) => handleAssetChange(asset.id, newContent)} />;
      case 'landingPage':
        return <LandingPageAsset content={asset.content} onChange={(newContent) => handleAssetChange(asset.id, newContent)} />;
      default:
        return <p>Unknown asset type</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="px-0 sm:px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 
          <span className="hidden sm:inline">Back to Projects</span>
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Settings className="mr-2 h-4 w-4" /> Project Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">{projectData.name}</CardTitle>
              <CardDescription className="text-sm sm:text-base">{projectData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground">Created on: {projectData.createdAt}</p>
            </CardContent>
          </Card>
          <Tabs defaultValue={assets[0].id} className="space-y-4">
            <TabsList className="inline-flex justify-start flex-wrap gap-2">
              {assets.map((asset) => (
                <TabsTrigger key={asset.id} value={asset.id} className="text-xs sm:text-sm">{asset.name}</TabsTrigger>
              ))}
            </TabsList>
            {assets.map((asset) => (
              <TabsContent key={asset.id} value={asset.id}>
                {renderAsset(asset)}
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button 
                className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
              >
                <Wand2 className="mr-2 h-4 w-4" /> Regenerate
              </Button>
              <Button className="w-full justify-start bg-white text-black border border-gray-300 hover:bg-gray-100">
                <FileText className="mr-2 h-4 w-4" /> Export as PDF
              </Button>
              <Button className="w-full justify-start bg-white text-black border border-gray-300 hover:bg-gray-100">
                <Image className="mr-2 h-4 w-4" /> Export Images
              </Button>
              <Button className="w-full justify-start bg-white text-black border border-gray-300 hover:bg-gray-100">
                <Code className="mr-2 h-4 w-4" /> Export Code
              </Button>
              <Button className="w-full justify-start bg-white text-black border border-gray-300 hover:bg-gray-100">
                <Share2 className="mr-2 h-4 w-4" /> Share Project
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Project Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Total Assets: {assets.length}</p>
              {/* Add more statistics here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}