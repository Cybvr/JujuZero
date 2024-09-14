"use client";

import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";

const paraphrasingStyles = [
  { value: 'standard', label: 'Standard' },
  { value: 'formal', label: 'Formal' },
  { value: 'simple', label: 'Simple' },
  { value: 'creative', label: 'Creative' },
];

export default function ParaphraserPage() {
  const [text, setText] = useState<string>('');
  const [paraphrasedText, setParaphrasedText] = useState<string | null>(null);
  const [style, setStyle] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTextChange = (content: string) => {
    setText(content);
    setParaphrasedText(null);
    setError(null);
  };

  const handleParaphrase = async () => {
    if (!text) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      });

      if (!response.ok) {
        throw new Error('Paraphrasing failed');
      }

      const data = await response.json();
      setParaphrasedText(data.paraphrasedText);
    } catch (err) {
      console.error('Paraphrasing failed:', err);
      setError('Paraphrasing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">AI Paraphraser</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Rephrase your text in different styles with our AI-powered tool</p>
        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="text-input" className="block text-sm font-medium mb-2">Enter your text</Label>
                <Editor
                  apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3"
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
                    mobile: {
                      theme: 'mobile',
                      plugins: ['autosave', 'lists', 'autolink'],
                      toolbar: ['undo', 'bold', 'italic', 'styleselect']
                    }
                  }}
                  onEditorChange={handleTextChange}
                />
              </div>
              <div>
                <Label htmlFor="style-select" className="block text-sm font-medium mb-2">Paraphrasing Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    {paraphrasingStyles.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="default" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={handleParaphrase}
                disabled={!text || isLoading}
              >
                {isLoading ? 'Paraphrasing...' : 'Paraphrase'}
              </Button>
              {error && <p className="text-destructive">{error}</p>}
              {paraphrasedText && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Paraphrased Text</h2>
                  <Editor
                    apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3"
                    initialValue={paraphrasedText}
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
                      mobile: {
                        theme: 'mobile',
                        plugins: ['autosave', 'lists', 'autolink'],
                        toolbar: ['undo', 'bold', 'italic', 'styleselect']
                      }
                    }}
                  />
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