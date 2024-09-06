// app/dashboard/tools/audio-to-mp3/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '../../../components/dashboard/toolbar';

export default function AudioToMp3Page() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("mp3");
  const [bitrate, setBitrate] = useState<number>(128);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please select a valid audio file.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an audio file.");
      return;
    }
    // Here you would typically send the data to a backend service
    console.log("Submitting:", { file, outputFormat, bitrate, startTime, endTime });
    setSuccess(true);
    setError("");
    // Reset form after successful submission
    setTimeout(() => {
      setSuccess(false);
      setFile(null);
      setOutputFormat("mp3");
      setBitrate(128);
      setStartTime("");
      setEndTime("");
    }, 3000);
  };

  return (
    <div className="flex">
      <div className="flex-grow mr-6">
        <h1 className="text-3xl font-bold mb-2">Audio to MP3</h1>
        <p className="text-muted-foreground mb-6">Convert various audio formats to MP3 easily.</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="audio-upload" className="block text-sm font-medium mb-2">Upload Audio</Label>
                <Input type="file" id="audio-upload" className="w-full" accept="audio/*" onChange={handleFileChange} />
                <p className="mt-1 text-sm text-muted-foreground">Supported formats: MP3, WAV, AAC, FLAC</p>
              </div>
              <div>
                <Label htmlFor="output-format" className="block text-sm font-medium mb-2">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="wav">WAV</SelectItem>
                    <SelectItem value="aac">AAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bitrate" className="block text-sm font-medium mb-2">Bitrate (kbps): {bitrate}</Label>
                <input
                  type="range"
                  id="bitrate"
                  min={64}
                  max={320}
                  step={32}
                  value={bitrate}
                  onChange={(e) => setBitrate(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
              <div>
                <Label htmlFor="start-time" className="block text-sm font-medium mb-2">Start Time (optional)</Label>
                <Input
                  type="text"
                  id="start-time"
                  placeholder="00:00:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="block text-sm font-medium mb-2">End Time (optional)</Label>
                <Input
                  type="text"
                  id="end-time"
                  placeholder="00:00:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="default" className="w-full bg-primary text-white hover:bg-primary-dark">
                Convert to MP3
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mt-4">
                <AlertDescription>Audio conversion started successfully!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <Toolbar />
    </div>
  );
}