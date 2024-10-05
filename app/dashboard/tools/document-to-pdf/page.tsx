"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '../../../components/dashboard/toolbar';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { getUserCredits, deductCredits } from '@/lib/credits';

const PDF_GENERATION_COST = 25;

export default function DocumentToPDFPage() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const credits = await getUserCredits(user.uid);
        setUserCredits(credits);
      }
    }
    fetchCredits();
  }, [user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds the 10MB limit. Please upload a smaller file.');
        return;
      }
      setDocumentFile(file);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024
  });

  const handleGeneratePDF = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (userCredits === null || userCredits < PDF_GENERATION_COST) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${PDF_GENERATION_COST} credits to generate a PDF. Please add more credits.`,
        variant: "destructive",
      });
      return;
    }

    if (!documentFile) {
      setError('Please upload a document file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await deductCredits(user.uid, PDF_GENERATION_COST);
      setUserCredits(prevCredits => prevCredits !== null ? Math.max(prevCredits - PDF_GENERATION_COST, 0) : null);

      const formData = new FormData();
      formData.append('file', documentFile);

      const response = await fetch('/api/convert-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('PDF conversion failed');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted_document.pdf';
      link.click();

      setSuccess(true);
      toast({
        title: "PDF Generated",
        description: `${PDF_GENERATION_COST} credits have been deducted from your account.`,
      });
    } catch (e) {
      setError('Failed to generate PDF. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Document to PDF Converter</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Convert your documents to PDF while maintaining formatting.</p>
        <Card className="bg-background shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleGeneratePDF(); }} className="space-y-4 sm:space-y-6">
              <div {...getRootProps()} className="p-4 border-2 border-dashed rounded-md border-primary/50 bg-primary/5 text-center cursor-pointer transition-colors hover:border-primary">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-primary">Drop the file here ...</p>
                ) : (
                  <p className="text-primary">Drag 'n' drop a document (.docx or .pdf) file here (max 10MB), or click to select files</p>
                )}
              </div>
              {documentFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected file: {documentFile.name}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary-dark"
                disabled={isLoading || !documentFile || (userCredits !== null && userCredits < PDF_GENERATION_COST)}
              >
                {isLoading ? 'Converting...' : `Generate PDF (${PDF_GENERATION_COST} credits)`}
              </Button>
              {userCredits !== null && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your current balance: {userCredits} credits
                </p>
              )}
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mt-4">
                <AlertDescription>PDF generated successfully!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <Toolbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}