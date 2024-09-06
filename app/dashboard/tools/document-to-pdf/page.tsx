// app/dashboard/tools/document-to-pdf/page.tsx

"use client";
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '../../../components/dashboard/toolbar';

export default function DocumentToPDF() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [pageSize, setPageSize] = useState("a4");
  const [mergePDFs, setMergePDFs] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setError("");
    } else {
      setFiles(null);
      setError("Please select at least one document file.");
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMergePDFs(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError("Please upload at least one document file.");
      return;
    }
    // Here you would typically send the data to a backend service
    console.log("Submitting:", { files, pageSize, mergePDFs });
    setSuccess(true);
    setError("");
    // Reset form after successful submission
    setTimeout(() => {
      setSuccess(false);
      setFiles(null);
      setPageSize("a4");
      setMergePDFs(false);
    }, 3000);
  };

  return (
    <div className="flex">
      <div className="flex-grow mr-6">
        <h1 className="text-3xl font-bold mb-2">Document to PDF Converter</h1>
        <p className="text-muted-foreground mb-6">Convert your documents to PDF format easily.</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="document-upload" className="block text-sm font-medium mb-2">Upload Documents</Label>
                <Input type="file" id="document-upload" className="w-full" accept=".doc,.docx,.txt,.rtf" onChange={handleFileChange} multiple />
                <p className="mt-1 text-sm text-muted-foreground">Supported formats: DOC, DOCX, TXT, RTF</p>
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
              <div>
                <Checkbox
                  id="merge-pdfs"
                  label="Merge into single PDF"
                  checked={mergePDFs}
                  onChange={handleCheckboxChange}
                />
              </div>
              <Button type="submit" variant="default" className="w-full bg-primary text-white hover:bg-primary-dark">
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