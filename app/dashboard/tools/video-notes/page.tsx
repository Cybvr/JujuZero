"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";

export default function VideoNotesPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl, option: selectedOption }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process video');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Video processing failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Video processing failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">Video Notes</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Generate notes from YouTube videos with our AI-powered tool</p>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <Card className="lg:w-1/2">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">YouTube Video URL</label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label htmlFor="option" className="block text-sm font-medium mb-2">Note Type</label>
                  <select
                    id="option"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    required
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="">Select a note type</option>
                    <option value="faq">FAQ</option>
                    <option value="studyGuide">Study Guide</option>
                    <option value="tableOfContents">Table of Contents</option>
                    <option value="timeline">Timeline</option>
                    <option value="briefingDoc">Briefing Document</option>
                  </select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                  disabled={!videoUrl || !selectedOption || isLoading}
                >
                  {isLoading ? 'Generating Notes...' : 'Generate Notes'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="lg:w-1/2">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Generated Notes:</h3>
              <Textarea
                value={result}
                readOnly
                className="w-full h-[calc(100vh-400px)]"
                placeholder="Your generated notes will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full lg:w-auto">
        <Toolbar />
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}