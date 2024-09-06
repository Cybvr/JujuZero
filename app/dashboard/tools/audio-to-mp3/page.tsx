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

export default function AudioToMP3() {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [bitrate, setBitrate] = useState(128);
  const [sampleRate, setSampleRate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid audio file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an audio file.");
      return;
    }
    if (!sampleRate) {
      setError("Please select a sample rate.");
      return;
    }
    // Here you would typically send the data to a backend service
    console.log("Submitting:", { file, outputFormat, bitrate, sampleRate });
    setSuccess(true);
    setError("");
    // Reset form after successful submission
    setTimeout(() => {
      setSuccess(false);
      setFile(null);
      setOutputFormat("mp3");
      setBitrate(128);
      setSampleRate("");
    }, 3000);
  };

  return (
    <div className="flex">
      <div className="flex-grow mr-6">
        <h1 className="text-3xl font-bold mb-2">Audio to MP3 Converter</h1>
        <p className="text-muted-foreground mb-6">Convert your audio files to MP3 format easily.</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="audio-upload" className="block text-sm font-medium mb-2">Upload Audio File</Label>
                <Input type="file" id="audio-upload" className="w-full" accept="audio/*" onChange={handleFileChange} />
                <p className="mt-1 text-sm text-muted-foreground">Supported formats: WAV, FLAC, AAC, OGG</p>
              </div>
              <div>
                <Label htmlFor="output-format" className="block text-sm font-medium mb-2">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="m4a">M4A</SelectItem>
                    <SelectItem value="ogg">OGG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bitrate" className="block text-sm font-medium mb-2">Bitrate (kbps): {bitrate}</Label>
                <Slider
                  id="bitrate"
                  min={64}
                  max={320}
                  step={32}
                  value={[bitrate]}
                  onValueChange={(value) => setBitrate(value[0])}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="sample-rate" className="block text-sm font-medium mb-2">Sample Rate (Hz)</Label>
                <Select value={sampleRate} onValueChange={setSampleRate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sample rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="44100">44.1 kHz</SelectItem>
                    <SelectItem value="48000">48 kHz</SelectItem>
                    <SelectItem value="96000">96 kHz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="default" className="w-full bg-primary text-white hover:bg-primary-dark">
                Convert to {outputFormat.toUpperCase()}
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