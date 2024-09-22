"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Scissors } from 'lucide-react';
import Toolbar from '../../../components/dashboard/toolbar';

interface BrandInsights {
  [key: string]: string;
}

export default function BrandClipper() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brandInsights, setBrandInsights] = useState<BrandInsights | null>(null);
  const { toast } = useToast();

  const handleClip = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/brand-clipper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Full error response:', data);
        throw new Error(`Failed to clip brand: ${response.status} ${response.statusText}. ${JSON.stringify(data)}`);
      }

      setBrandInsights(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to clip brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Scissors className="mr-2" /> BrandClipper
        </h1>
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex space-x-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL"
                className="flex-grow"
              />
              <Button onClick={handleClip} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze Brand'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {brandInsights && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Brand Insights</h2>
              <div className="space-y-2">
                {Object.entries(brandInsights).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="w-full lg:w-auto">
        <Toolbar />
      </div>
    </div>
  );
}