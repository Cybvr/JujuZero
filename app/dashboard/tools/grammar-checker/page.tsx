"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import CustomEditor from '@/components/dashboard/CustomEditor';

export default function GrammarCheckerPage() {
  const [text, setText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTextChange = (content: string) => {
    setText(content);
    setCorrectedText(null);
  };

  const handleGrammarCheck = async () => {
    if (!text) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Grammar check failed');

      const data = await response.json();
      setCorrectedText(data.correctedText);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Grammar check failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-grow md:mr-6 mb-6 md:mb-0">
        <h1 className="text-xl md:text-xl font-bold mb-2">AI Grammar Checker</h1>
        <p className="text-muted-foreground mb-6">Improve your writing with our AI-powered grammar checker</p>
        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="text-input" className="block text-sm font-medium mb-2">Enter your text</Label>
                <CustomEditor value={text} onChange={handleTextChange} />
              </div>
              <Button 
                variant="default" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={handleGrammarCheck}
                disabled={!text || isLoading}
              >
                {isLoading ? 'Checking...' : 'Check Grammar'}
              </Button>
              {correctedText && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Corrected Text</h2>
                  <CustomEditor value={correctedText} onChange={() => {}} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-auto">
        <Toolbar />
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}