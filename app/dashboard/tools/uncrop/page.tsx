"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '@/components/dashboard/toolbar';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { deductCredits, getUserCredits } from '@/lib/credits';

const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
const UNCROP_COST = 25; // Set the credit cost for uncropping

export default function UncropToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extendValues, setExtendValues] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [userCredits, setUserCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      getUserCredits(user.uid).then(credits => setUserCredits(credits));
    }
  }, [user]);

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
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    if (userCredits !== null && userCredits < UNCROP_COST) {
      setError("Not enough credits. Please purchase more credits to use this tool.");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      // Deduct credits
      await deductCredits(user.uid, UNCROP_COST);
      setUserCredits(prevCredits => prevCredits !== null ? prevCredits - UNCROP_COST : null);

      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // Calculate total dimensions
      const totalWidth = extendValues.left + 512 + extendValues.right;
      const totalHeight = extendValues.top + 512 + extendValues.bottom;

      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "30a5f7d90afd41f7c41f22a4900a21667b368a6e8da88937525bb2ad1e3eee6c",
          input: {
            image: base64Image,
            prompt: "Extend this image",
            width: totalWidth,
            height: totalHeight,
            outpainting_mode: true
          },
        }),
      });

      let prediction = await response.json();
      if (response.status !== 201) {
        throw new Error(prediction.detail);
      }

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await fetch(
          "https://api.replicate.com/v1/predictions/" + prediction.id,
          {
            headers: {
              Authorization: `Token ${REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        prediction = await response.json();
        if (response.status !== 200) {
          throw new Error(prediction.detail);
        }
      }

      if (prediction.status === "succeeded") {
        setResultImage(prediction.output[0]);
        toast({
          title: "Image Uncropped",
          description: "Your image has been successfully uncropped.",
        });
      } else {
        throw new Error("Image processing failed");
      }
    } catch (error) {
      setError("An error occurred while processing the image: " + error.message);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Image uncropping failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-2xl font-bold mb-2">Uncrop Tool</h1>
        <p className="text-muted-foreground mb-6">Extend or crop your image using AI. Cost: {UNCROP_COST} credits</p>
        {user && userCredits !== null && (
          <p className="text-sm text-muted-foreground mb-4">Your credits: {userCredits}</p>
        )}
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
                {['left', 'right', 'top', 'bottom'].map((direction) => (
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
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}