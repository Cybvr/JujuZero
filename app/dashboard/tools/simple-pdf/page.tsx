"use client"

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, Edit3, Download } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import PDF from 'react-pdf-js';

export default function PDFEditorPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [annotation, setAnnotation] = useState('');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editMode, setEditMode] = useState<'text' | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const pdfRef = useRef<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setCurrentPage(1);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleAnnotationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnotation(e.target.value);
  };

  const handleDocumentComplete = (numPages: number) => {
    setNumPages(numPages);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEditPDF = async () => {
    if (!pdfFile) return;
    setIsLoading(true);

    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[currentPage - 1];
      const { height } = page.getSize();

      if (editMode === 'text') {
        page.drawText(annotation, {
          x: 50,
          y: height - 50,
          size: 12,
          color: rgb(0, 0, 0),
          font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(url);

      toast({
        title: "Success",
        description: "PDF edited successfully!",
      });
    } catch (error) {
      console.error('PDF editing failed:', error);
      toast({
        title: "Error",
        description: "PDF editing failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'edited_' + (pdfFile?.name || 'document.pdf');
      link.click();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-2xl font-bold mb-4">Simple PDF</h1>
        <Card className="bg-card shadow-md rounded-lg overflow-hidden mb-6">
          <CardContent className="p-6">
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-gray-300'}`}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the PDF file here ...</p>
              ) : (
                <p>Drag 'n' drop a PDF file here, or click to select a file</p>
              )}
              {pdfFile && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected file: {pdfFile.name}
                </p>
              )}
            </div>
            {pdfUrl && (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <Button 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <span>Page {currentPage} of {numPages}</span>
                  <Button 
                    onClick={() => handlePageChange(Math.min(numPages || 1, currentPage + 1))}
                    disabled={currentPage >= (numPages || 1)}
                  >
                    Next
                  </Button>
                </div>
                <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
                  <PDF
                    file={pdfUrl}
                    onDocumentComplete={handleDocumentComplete}
                    page={currentPage}
                  />
                </div>
              </div>
            )}
            <div className="mt-4">
              <Textarea
                placeholder="Enter annotation text..."
                value={annotation}
                onChange={handleAnnotationChange}
                className="mb-2"
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setEditMode('text')}
                  variant={editMode === 'text' ? 'default' : 'outline'}
                >
                  <Edit3 className="mr-2 h-4 w-4" /> Add Text
                </Button>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button onClick={handleEditPDF} disabled={!pdfFile || isLoading}>
                {isLoading ? 'Editing...' : 'Edit PDF'}
              </Button>
              <Button onClick={handleDownload} disabled={!pdfUrl}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
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