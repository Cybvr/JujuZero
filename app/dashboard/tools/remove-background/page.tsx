"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Toolbar from '../../../components/dashboard/toolbar';

const PHOTOROOM_API_KEY = process.env.NEXT_PUBLIC_PHOTOROOM_API_KEY as string;
if (!PHOTOROOM_API_KEY) {
  console.error('PhotoRoom API key is not set. Check your environment variables.');
}

export default function RemoveBackgroundPage() {
  const [image, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setProcessedImage(null);
      setError(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    if (!PHOTOROOM_API_KEY) {
      setError('API key missing. Check configuration.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image_file', image);

    try {
      const axios = (await import('axios')).default;
      const response = await axios.post('https://sdk.photoroom.com/v1/segment', formData, {
        headers: {
          'x-api-key': PHOTOROOM_API_KEY,
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
      });

      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      setProcessedImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      console.error('Background removal failed:', err);
      setError('Background removal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">Remove Background</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">AI-powered background removal</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Image</Label>
                <Input type="file" id="image-upload" className="w-full" accept="image/*" onChange={handleImageUpload} />
                <p className="mt-1 text-sm text-muted-foreground">Supported: JPG, PNG, WebP</p>
              </div>
              <Button 
                variant="default" 
                className="w-full bg-primary text-white hover:bg-primary-dark" 
                onClick={handleRemoveBackground}
                disabled={!image || isLoading || !PHOTOROOM_API_KEY}
              >
                {isLoading ? 'Processing...' : 'Remove Background'}
              </Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {!PHOTOROOM_API_KEY && <p className="text-red-500 text-sm">API key missing. Check configuration.</p>}
              {processedImage && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Processed Image</h2>
                  <div className="bg-gray-100 p-2 rounded">
                    <img src={processedImage} alt="Processed" className="max-w-full h-auto rounded" />
                  </div>
                  <Button 
                    asChild
                    variant="secondary" 
                    className="mt-4 w-full"
                  >
                    <a 
                      href={processedImage} 
                      download="removed-background.png" 
                    >
                      Download Image
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Toolbar />
    </div>
  );
}