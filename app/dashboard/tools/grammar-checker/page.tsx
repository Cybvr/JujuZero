"use client";

import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";

export default function GrammarCheckerPage() {
  const [text, setText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const editorRef = useRef<any>(null);

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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">AI Grammar Checker</h1>
        <p className="text-muted-foreground mb-6">Improve your writing with our AI-powered grammar checker</p>
        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="text-input" className="block text-sm font-medium mb-2">Enter your text</Label>
                <Editor
                  apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3"
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue=""
                  init={{
                    height: 250,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    resize: false,
                  }}
                  onEditorChange={handleTextChange}
                />
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
                  <Editor
                    apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3"
                    initialValue={correctedText}
                    init={{
                      height: 250,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      resize: false,
                    }}
                  />
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