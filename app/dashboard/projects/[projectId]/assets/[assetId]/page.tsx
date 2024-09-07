  "use client";
  import React from 'react';
  import { useParams, useRouter } from 'next/navigation';
  import { Button } from "@/components/ui/button";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
  import { ArrowLeft, Download, Edit, Trash } from 'lucide-react';

  // This is a placeholder. In a real app, you'd fetch this data from an API.
  const getAssetData = (projectId, assetId) => {
    // Simulating an API call
    return {
      id: assetId,
      name: 'Sample Asset',
      type: 'image',
      url: 'https://placeholder.com/150',
      description: 'This is a sample asset description.',
    };
  };

  export default function AssetDetail() {
    const router = useRouter();
    const { projectId, assetId } = useParams();
    const asset = getAssetData(projectId, assetId);

    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{asset.name}</CardTitle>
            <CardDescription>Type: {asset.type}</CardDescription>
          </CardHeader>
          <CardContent>
            {asset.type === 'image' && (
              <img src={asset.url} alt={asset.name} className="mb-4 max-w-full h-auto" />
            )}
            <p className="mb-4">{asset.description}</p>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }