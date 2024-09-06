"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Toolbar from '../../../components/dashboard/toolbar';

export default function CompressImagePage() {
  const [image, setImage] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState(80);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setCompressedImage(null);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('quality', compressionLevel.toString());
    formData.append('format', outputFormat);
    formData.append('maxWidth', maxWidth.toString());

    try {
      const response = await fetch('/api/compress-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to compress image');
      }

      const data = await response.json();
      setCompressedImage(data.compressedImage);
    } catch (err) {
      console.error('Error compressing image:', err);
      setError('Failed to compress image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="flex-grow mr-6">
        <h1 className="text-3xl font-bold mb-2">Compress Image</h1>
        <p className="text-muted-foreground mb-6">Reduce image file size without losing quality.</p>

        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Image</Label>
                <Input type="file" id="image-upload" className="w-full" accept="image/*" onChange={handleImageUpload} />
                <p className="mt-1 text-sm text-muted-foreground">Supported formats: JPG, PNG, WebP</p>
              </div>

              <div>
                <Label htmlFor="compression-level" className="block text-sm font-medium mb-2">Compression Level</Label>
                <input
                  type="range"
                  id="compression-level"
                  min={0}
                  max={100}
                  step={1}
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-muted-foreground">{compressionLevel}%</p>
              </div>

              <div>
                <Label htmlFor="output-format" className="block text-sm font-medium mb-2">Output Format</Label>
                <Select onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max-width" className="block text-sm font-medium mb-2">Max Width (px)</Label>
                <Input 
                  type="number" 
                  id="max-width" 
                  placeholder="Enter max width" 
                  className="w-full"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                />
              </div>

              <Button 
                variant="default" 
                className="w-full bg-primary text-white hover:bg-primary-dark" 
                onClick={handleCompress}
                disabled={!image || isLoading}
              >
                {isLoading ? 'Compressing...' : 'Compress Image'}
              </Button>

              {error && <p className="text-red-500">{error}</p>}

              {compressedImage && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Compressed Image</h3>
                  <img src={compressedImage} alt="Compressed" className="max-w-full h-auto" />
                  <a 
                    href={compressedImage} 
                    download={`compressed.${outputFormat}`} 
                    className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download Compressed Image
                  </a>
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