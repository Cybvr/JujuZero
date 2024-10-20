"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import CustomEditor from '@/components/dashboard/CustomEditor';
import { deductCredits, getUserCredits } from '@/lib/credits';

const SUMMARIZE_COST = 10; // Set the credit cost for summarization

export default function TextSummarizerPage() {
  const [text, setText] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [userCredits, setUserCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      getUserCredits(user.uid).then(credits => setUserCredits(credits));
    }
  }, [user]);

  const handleTextChange = (content: string) => {
    setText(content);
    setSummary(null);
    setError(null);
  };

  const handleSummarize = async () => {
    if (!text) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (userCredits !== null && userCredits < SUMMARIZE_COST) {
      setError("Not enough credits. Please purchase more credits to use this tool.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Deduct credits
      await deductCredits(user.uid, SUMMARIZE_COST);
      setUserCredits(prevCredits => prevCredits !== null ? prevCredits - SUMMARIZE_COST : null);

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error('Summarization failed');
      }
      const data = await response.json();
      setSummary(data.summary);
      toast({
        title: "Summary Generated",
        description: "Your text has been successfully summarized.",
      });
    } catch (err) {
      console.error('Summarization failed:', err);
      setError('Summarization failed. Please try again.');
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">AI Text Summarizer</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Quickly summarize long texts with our AI-powered tool. Cost: {SUMMARIZE_COST} credits</p>
        {user && userCredits !== null && (
          <p className="text-sm text-muted-foreground mb-4">Your credits: {userCredits}</p>
        )}
        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="text-input" className="block text-sm font-medium mb-2">Enter your text</Label>
                <CustomEditor value={text} onChange={handleTextChange} />
              </div>
              <Button 
                variant="default" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={handleSummarize}
                disabled={!text || isLoading}
              >
                {isLoading ? 'Summarizing...' : 'Summarize'}
              </Button>
              {error && <p className="text-destructive">{error}</p>}
              {summary && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Summary</h2>
                  <CustomEditor value={summary} onChange={() => {}} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-auto">
        <Toolbar />
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}