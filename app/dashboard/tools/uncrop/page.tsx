"use client";
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '@/components/dashboard/toolbar';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';

export default function UncropToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extendValues, setExtendValues] = useState({
    left: 0,
    right: 0,
    up: 0,
    down: 0
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  });

  const handleExtendChange = (direction, value) => {
    setExtendValues(prev => ({
      ...prev,
      [direction]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage(null);

    const form = new FormData();
    form.append('image_file', file);
    Object.entries(extendValues).forEach(([key, value]) => {
      if (value !== 0) {
        form.append(`extend_${key}`, value.toString());
      }
    });

    try {
      const response = await fetch('https://clipdrop-api.co/uncrop/v1', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_CLIPDROP_API_KEY || '' },
        
        body: form
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
    } catch (error) {
      setError("An error occurred while processing the image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-2xl font-bold mb-2">Uncrop Tool</h1>
        <p className="text-muted-foreground mb-6">Extend or crop your image using AI.</p>
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          <Card className="flex-1 bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-4">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select a file</p>
                )}
              </div>
              {file && (
                <div className="mt-4">
                  <p>Selected file: {file.name}</p>
                  <img src={URL.createObjectURL(file)} alt="Selected" className="mt-2 max-h-48 mx-auto" />
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {['left', 'right', 'up', 'down'].map((direction) => (
                  <div key={direction}>
                    <Label htmlFor={`extend-${direction}`} className="block text-sm font-medium mb-2">
                      Extend {direction}
                    </Label>
                    <Input
                      id={`extend-${direction}`}
                      type="number"
                      placeholder="0"
                      value={extendValues[direction]}
                      onChange={(e) => handleExtendChange(direction, e.target.value)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit} disabled={!file || loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Uncrop Image
                </Button>
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="flex-1 bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Uncropped Image</h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : resultImage ? (
                <img src={resultImage} alt="Uncropped" className="w-full h-auto" />
              ) : (
                <div className="flex justify-center items-center h-64 bg-gray-100">
                  <p className="text-muted-foreground">Your uncropped image will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toolbar />
    </div>
  );
}