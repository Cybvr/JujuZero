"use client";

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '../../../components/dashboard/toolbar';

export default function DocumentToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergePDFs, setMergePDFs] = useState(false);
  const [pageSize, setPageSize] = useState("a4");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
      setError("");
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setMergePDFs(checked);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      setError("Please upload at least one file.");
      return;
    }
    // Here you would typically send the data to a backend service
    console.log("Converting files:", files);
    console.log("Merge PDFs:", mergePDFs);
    console.log("Page size:", pageSize);
    setSuccess(true);
    setError("");
    // Reset form after successful submission
    setTimeout(() => {
      setSuccess(false);
      setFiles([]);
      setMergePDFs(false);
      setPageSize("a4");
    }, 3000);
  };

  return (
    <div className="flex">
      <div className="flex-grow mr-6">
        <h1 className="text-3xl font-bold mb-2">Document to PDF Converter</h1>
        <p className="text-muted-foreground mb-6">Convert your documents into PDF format.</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <div>
                <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">Upload Documents</Label>
                <Input 
                  id="file-upload"
                  type="file" 
                  onChange={handleFileChange} 
                  multiple 
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Supported formats: DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="merge-pdfs"
                  checked={mergePDFs}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="merge-pdfs" className="text-sm font-medium">
                  Merge multiple documents into one PDF
                </Label>
              </div>
              <div>
                <Label htmlFor="page-size" className="block text-sm font-medium mb-2">Page Size</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit"
                variant="default" 
                className="w-full bg-primary text-white hover:bg-primary-dark"
              >
                Convert to PDF
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mt-4">
                <AlertDescription>Document conversion started successfully!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <Toolbar />
    </div>
  );
}