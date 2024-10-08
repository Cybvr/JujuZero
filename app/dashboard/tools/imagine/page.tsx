"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Toolbar from '@/components/dashboard/toolbar'
import { useDropzone } from 'react-dropzone'
import { Loader2, Upload, AlertCircle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/use-toast'

const REIMAGINE_COST = 50; // Cost is now only used for backend reference

export default function ReimagineToolPage() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [resultImages, setResultImages] = useState<string[]>([])
  const [progress, setProgress] = useState<string>("")
  const { user } = useAuth()
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setError("")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  })

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use the reimagine tool.',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    setLoading(true);
    setError("");
    setResultImages([]);
    setProgress("");

    // Input validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size too large. Please upload an image smaller than 5MB.");
      setLoading(false);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append('image_file', file);

    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        setProgress(`Attempt ${attempt + 1} of ${maxRetries}...`);
        const results = await Promise.all([1, 2].map(async () => {
          const response = await fetch('https://clipdrop-api.co/reimagine/v1/reimagine', {
            method: 'POST',
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_CLIPDROP_API_KEY || '', },
            body: form,
          });

          if (!response.ok) {
            if (response.status === 400) {
              throw new Error("Bad request. Please check your input and try again.");
            } else if (response.status === 401) {
              throw new Error("Unauthorized. Please check your API key.");
            } else if (response.status === 429) {
              throw new Error("Too many requests. Please try again later.");
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          }

          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }));

        setResultImages(results);
        setProgress("");

        toast({
          title: 'Images Reimagined',
          description: 'Your images have been successfully reimagined.',
        });

        break; // Success, exit the retry loop
      } catch (error) {
        console.error("Attempt " + (attempt + 1) + " failed:", error);
        if (attempt === maxRetries - 1) {
          if (error instanceof Error) {
            setError("An error occurred: " + error.message);
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
        } else {
          // Wait before retrying (exponential backoff)
          const delay = 1000 * Math.pow(2, attempt);
          setProgress(`Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-3xl font-bold mb-2">Image Reimagine Tool</h1>
        <p className="text-muted-foreground mb-6">Create variations of your image with AI.</p>
        <Card className="bg-background p-0 border-0 rounded-lg overflow-hidden mb-6">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
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
                {isDragActive ? "Drop the image here" : "Drag 'n' drop an image here, or click to select"}
              </p>
            </div>
            {file && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Selected file: {file.name}</p>
                <img src={URL.createObjectURL(file)} alt="Selected" className="mt-2 max-h-64 mx-auto rounded-md" />
              </div>
            )}
            <div className="mt-6 flex justify-start">
              <Button onClick={handleSubmit} disabled={!file || loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate
              </Button>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {progress && (
              <Alert className="mt-4">
                <AlertDescription>{progress}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {resultImages.length > 0 && (
          <Card className="bg-background shadow-md rounded-lg overflow-hidden">
            <CardHeader>
              <CardTitle>Reimagined Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resultImages.map((img, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <img src={img} alt={`Reimagined ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toolbar />
    </div>
  )
}