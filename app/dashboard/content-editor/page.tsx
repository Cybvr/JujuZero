"use client";
import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContentEditorPage() {
  const [content, setContent] = useState('');
  const [page, setPage] = useState('terms');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, [page]);

  const loadContent = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/content?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched content:", data);

      let parsedContent = data.content;
      if (typeof parsedContent === 'string') {
        try {
          parsedContent = JSON.parse(parsedContent);
        } catch {
          // If parsing fails, use the content as-is
        }
      }
      if (parsedContent && typeof parsedContent === 'object' && parsedContent.value) {
        parsedContent = parsedContent.value;
      }

      setContent(parsedContent || '');
    } catch (error) {
      console.error('Error loading content:', error);
      setError(`Failed to load content: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to load content: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          page, 
          content: content
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Update result:", result);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      setError(`Failed to update content: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to update content: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const EditorSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-[450px] w-full" />
    </div>
  );

  return (
    <ToastProvider>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Content Editor</h1>
        <Select onValueChange={(value) => setPage(value)} value={page} disabled={isLoading}>
          <SelectTrigger className="w-[180px] mb-4">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="terms">Terms of Service</SelectItem>
            <SelectItem value="privacy">Privacy Policy</SelectItem>
            <SelectItem value="aup">Acceptable Use Policy</SelectItem>
            <SelectItem value="rdp">Responsible Disclosure Policy</SelectItem>
          </SelectContent>
        </Select>
        {isLoading ? (
          <EditorSkeleton />
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Editor
            key={page}
            apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3"
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'link', 'lists', 'table'
              ],
              toolbar: 'undo redo | formatselect | bold italic | \
                alignleft aligncenter alignright | \
                bullist numlist | link table'
            }}
            value={content}
            onEditorChange={handleEditorChange}
          />
        )}
        <Button className="mt-4" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Content'}
        </Button>
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}