'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const samplePrompts = [
  {
    title: "Snippet 1",
    fullText: "Hi, my brand is a lemonade store selling fresh and organic lemonade to health-conscious consumers."
  },
  {
    title: "Snippet 2",
    fullText: "Hello there! We are a tech startup focused on AI solutions that automate simple daily tasks."
  },
  {
    title: "Snippet 3",
    fullText: "Greetings! Our brand champions eco-friendly clothing for a sustainable future."
  }
];

export default function BrandWizard() {
  const [initialInput, setInitialInput] = useState({
    name: '',
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const maxDescriptionLength = 500;

  const validateInput = () => {
    if (initialInput.name.trim() === '') {
      setError('Brand name is required');
      return false;
    }
    if (initialInput.description.trim() === '') {
      setError('Brand description is required');
      return false;
    }
    if (initialInput.description.length < 10) {
      setError('Brand description should be at least 10 characters long');
      return false;
    }
    return true;
  };

  const generateAndSaveBrand = async () => {
    if (!validateInput()) return;
    if (!user) {
      setError('You must be logged in to create a brand.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Generate brand using AI (call to your backend API)
      const generateResponse = await fetch('/api/openai/generateBrand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialInput),
      });

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        throw new Error(`HTTP error! status: ${generateResponse.status}, message: ${errorText}`);
      }

      const generatedData = await generateResponse.json();

      // Prepare project data for Firestore
      const projectData = {
        ...generatedData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        collaborators: [],
        brandStrategy: generatedData.brandStrategy || {},
        visualIdentity: generatedData.visualIdentity || {},
        brandVoice: generatedData.brandVoice || {},
        design: generatedData.design || {},
        socialMedia: {
          posts: generatedData.socialMedia?.posts || []  // Adjusted socialMedia structure to only include posts
        },
        analytics: generatedData.analytics || {}
      };

      // Save project to Firestore
      const docRef = await addDoc(collection(db, "projects"), projectData);

      toast({
        title: "Brand Created",
        description: "Your brand has been successfully created and saved.",
      });

      // Navigate to the project page
      router.push(`/dashboard/projects/${docRef.id}`);
    } catch (error) {
      console.error("Detailed error creating brand:", error);
      setError('Failed to create brand. Please try again.');

      toast({
        title: "Error",
        description: "Failed to create the brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxDescriptionLength) {
      setInitialInput(prev => ({ ...prev, description: e.target.value }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Brand</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input 
            placeholder="Brand Name" 
            value={initialInput.name}
            onChange={(e) => setInitialInput(prev => ({ ...prev, name: e.target.value }))}
            className="w-full"
          />
          <Textarea 
            placeholder="Brief description or concept for your brand" 
            value={initialInput.description}
            onChange={onDescriptionChange}
            className="w-full min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground text-right">{initialInput.description.length}/{maxDescriptionLength}</p>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Select a sample description to insert:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-auto flex items-center space-x-1"
                  onClick={() => setInitialInput(prev => ({ ...prev, description: prompt.fullText }))}
                >
                  <PlusCircle className="h-3 w-3" />
                  <span>{prompt.title}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Button 
              onClick={generateAndSaveBrand} 
              disabled={isGenerating || !user} 
              className="w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              <span>Create Brand</span>
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!user && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>You must be logged in to create a brand.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
