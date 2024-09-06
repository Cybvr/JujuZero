"use client";
 
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    <div className="flex">
      <div className="flex-grow mr-6">
        <h1 className="text-3xl font-bold mb-2">Video to MP4</h1>
        <p className="text-muted-foreground mb-6">Convert various video formats to MP4 easily.</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="video-upload" className="block text-sm font-medium mb-2">Upload Video</Label>
                <Input type="file" id="video-upload" className="w-full" accept="video/*" onChange={handleFileChange} />
                <p className="mt-1 text-sm text-muted-foreground">Supported formats: AVI, MOV, WMV, FLV, MKV</p>
              </div>
              <div>
                <Label htmlFor="video-quality" className="block text-sm font-medium mb-2">Video Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (480p)</SelectItem>
                    <SelectItem value="medium">Medium (720p)</SelectItem>
                    <SelectItem value="high">High (1080p)</SelectItem>
                    <SelectItem value="original">Original</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="audio-bitrate" className="block text-sm font-medium mb-2">Audio Bitrate</Label>
                <Select value={bitrate} onValueChange={setBitrate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select bitrate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128 kbps</SelectItem>
                    <SelectItem value="192">192 kbps</SelectItem>
                    <SelectItem value="256">256 kbps</SelectItem>
                    <SelectItem value="320">320 kbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trim-video" className="block text-sm font-medium mb-2">Trim Video (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    id="start-time"
                    placeholder="Start time (00:00:00)"
                    className="w-1/2"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    type="text"
                    id="end-time"
                    placeholder="End time (00:00:00)"
                    className="w-1/2"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="compression-level" className="block text-sm font-medium mb-2">Compression Level</Label>
                <Slider
                  id="compression-level"
                  min={0}
                  max={100}
                  step={1}
                  value={[compressionLevel]}
                  onValueChange={(value) => setCompressionLevel(value[0])}
                  className="w-full"
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