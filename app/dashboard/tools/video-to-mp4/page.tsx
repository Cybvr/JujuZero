"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CustomSlider } from '../../../components/dashboard/CustomSlider';
import Toolbar from '../../../components/dashboard/toolbar';

export default function VideoToMp4Page() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState("");
  const [bitrate, setBitrate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [compressionLevel, setCompressionLevel] = useState(50);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid video file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a video file.");
      return;
    }
    if (!quality || !bitrate) {
      setError("Please select video quality and audio bitrate.");
      return;
    }
    // Here you would typically send the data to a backend service
    console.log("Submitting:", { file, quality, bitrate, startTime, endTime, compressionLevel });
    setSuccess(true);
    setError("");
    // Reset form after successful submission
    setTimeout(() => {
      setSuccess(false);
      setFile(null);
      setQuality("");
      setBitrate("");
      setStartTime("");
      setEndTime("");
      setCompressionLevel(50);
    }, 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Video to MP4</h1>
        <p className="text-muted-foreground mb-6">Convert various video formats to MP4 easily.</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="video-upload" className="block text-sm font-medium mb-2">Upload Video</Label>
                <Input type="file" id="video-upload" className="w-full" accept="video/*" onChange={handleFileChange} />
                <p className="mt-1 text-sm text-muted-foreground">Supported formats: MP4, AVI, MOV, WMV</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quality" className="block text-sm font-medium mb-2">Video Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bitrate" className="block text-sm font-medium mb-2">Audio Bitrate</Label>
                  <Select value={bitrate} onValueChange={setBitrate}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select bitrate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128k">128 kbps</SelectItem>
                      <SelectItem value="192k">192 kbps</SelectItem>
                      <SelectItem value="256k">256 kbps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
              <div>
                <Label htmlFor="compression-level" className="block text-sm font-medium mb-2">Compression Level</Label>
                <CustomSlider
                  id="compression-level"
                  min={0}
                  max={100}
                  step={1}
                  value={compressionLevel}
                  onChange={setCompressionLevel}
                  className="mt-2"
                />
              </div>
              <Button type="submit" variant="default" className="w-full bg-primary text-white hover:bg-primary-dark">
                Convert to MP4
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mt-4">
                <AlertDescription>Video conversion started successfully!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <Toolbar />
    </div>
  );
}