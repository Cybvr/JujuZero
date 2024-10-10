"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Toolbar from '../../../components/dashboard/toolbar';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import imageCompression from 'browser-image-compression';

export default function CompressImagePage() {
  const [images, setImages] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState(80);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [compressedImages, setCompressedImages] = useState<{ file: Blob, url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(acceptedFiles);
    setCompressedImages([]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: true
  });

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      fileType: `image/${outputFormat}`,
      quality: compressionLevel / 100,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      return { file: compressedFile, url };
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  const handleCompress = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (images.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to compress.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setCompressedImages([]);
    setProgress("");

    try {
      const compressedResults = await Promise.all(
        images.map(async (image, index) => {
          setProgress(`Compressing image ${index + 1} of ${images.length}...`);
          return compressImage(image);
        })
      );

      setCompressedImages(compressedResults);
      setProgress("");

      toast({
        title: "Images Compressed",
        description: `Successfully compressed ${compressedResults.length} images.`,
      });
    } catch (err) {
      console.error('Error compressing images:', err);
      setError("Failed to compress one or more images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">Bulk Compress Images</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Reduce multiple image file sizes without losing quality.</p>

        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Images</Label>
                <div 
                  {...getRootProps()} 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    {isDragActive ? "Drop the images here" : "Drag 'n' drop images here, or click to select"}
                  </p>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Supported formats: JPG, PNG, WebP</p>
              </div>

              {images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Selected Images: {images.length}</h3>
                  <ul className="list-disc pl-5 max-h-40 overflow-y-auto">
                    {images.map((image, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{image.name}</li>
                    ))}
                  </ul>
                </div>
              )}

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
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{compressionLevel}%</p>
              </div>

              <div>
                <Label htmlFor="output-format" className="block text-sm font-medium mb-2">Output Format</Label>
                <Select onValueChange={setOutputFormat} value={outputFormat}>
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
                <input 
                  type="number" 
                  id="max-width" 
                  placeholder="Enter max width" 
                  className="w-full p-2 border rounded"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                />
              </div>

              <Button 
                variant="default" 
                className="bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={handleCompress}
                disabled={images.length === 0 || isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Compressing...' : 'Compress Images'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {progress && (
                <Alert>
                  <AlertDescription>{progress}</AlertDescription>
                </Alert>
              )}

              {compressedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Compressed Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {compressedImages.map((img, index) => (
                      <div key={index} className="bg-muted p-2 rounded">
                        <img src={img.url} alt={`Compressed ${index + 1}`} className="w-full h-auto rounded" />
                        <Button 
                          asChild
                          variant="secondary" 
                          className="mt-2 w-full"
                        >
                          <a 
                            href={img.url} 
                            download={`compressed_${index + 1}.${outputFormat}`}
                          >
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
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