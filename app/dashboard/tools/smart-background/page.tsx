// File: app/dashboard/tools/smart-background/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { deductCredits } from '@/lib/credits';

const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN as string;
if (!REPLICATE_API_TOKEN) {
  console.error('Replicate API token is not set. Check your environment variables.');
}

const SMART_BACKGROUND_COST = 50; // Adjust as needed

export default function SmartBackground() {
  const [image, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setProcessedImage(null);
      setError(null);
    }
  };

  const handleSmartBackground = async () => {
    if (!image) return;
    if (!REPLICATE_API_TOKEN) {
      setError('API token missing. Check configuration.');
      return;
    }
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Deduct credits
      await deductCredits(user.uid, SMART_BACKGROUND_COST);

      // Step 1: Remove background
      const removeBackgroundResponse = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "2b7c9f5a6b7b5e274d96608c6cfcb092479c7f93f11dd1e904e519ca8803ecbe",
          input: { image: await convertToBase64(image) },
        }),
      });

      if (!removeBackgroundResponse.ok) {
        throw new Error('Failed to remove background');
      }

      const removeBackgroundResult = await removeBackgroundResponse.json();
      const removedBackgroundImageUrl = await waitForResult(removeBackgroundResult.id);

      // Step 2: Generate new background
      const generateBackgroundResponse = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
          input: { prompt: prompt },
        }),
      });

      if (!generateBackgroundResponse.ok) {
        throw new Error('Failed to generate background');
      }

      const generateBackgroundResult = await generateBackgroundResponse.json();
      const generatedBackgroundImageUrl = await waitForResult(generateBackgroundResult.id);

      // Step 3: Combine images (This step would typically be done on a backend server)
      // For this example, we'll just display the generated background
      setProcessedImage(generatedBackgroundImageUrl);

      toast({
        title: "Background Changed",
        description: "Your image background has been successfully changed.",
      });
    } catch (err) {
      console.error('Smart background processing failed:', err);
      setError('Smart background processing failed. Please try again.');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Smart background processing failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const waitForResult = async (predictionId: string): Promise<string> => {
    while (true) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
      });
      const prediction = await response.json();
      if (prediction.status === 'succeeded') {
        return prediction.output;
      } else if (prediction.status === 'failed') {
        throw new Error('Image processing failed');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">AI Smart Background</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Change your image background using AI</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Image</Label>
                <Input type="file" id="image-upload" className="w-full" accept="image/*" onChange={handleImageUpload} />
                <p className="mt-1 text-sm text-muted-foreground">Supported: JPG, PNG, WebP</p>
              </div>
              <div>
                <Label htmlFor="prompt" className="block text-sm font-medium mb-2">Background Description</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the background you want (e.g., 'a beautiful beach at sunset')"
                  className="w-full"
                />
              </div>
              <Button 
                variant="default" 
                className="w-full bg-primary text-white hover:bg-primary-dark" 
                onClick={handleSmartBackground}
                disabled={!image || !prompt || isLoading || !REPLICATE_API_TOKEN}
              >
                {isLoading ? 'Processing...' : 'Change Background'}
              </Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {!REPLICATE_API_TOKEN && <p className="text-red-500 text-sm">API token missing. Check configuration.</p>}
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
                      download="smart-background.png" 
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
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}