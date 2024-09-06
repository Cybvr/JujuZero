"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '../../../components/dashboard/toolbar';

export default function AddWatermarkPage() {
  const [image, setImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyWatermark = () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      setError('Unable to create canvas context.');
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.font = '48px Arial';
      ctx.fillStyle = watermarkColor;
      ctx.globalAlpha = 0.5;

      const metrics = ctx.measureText(watermarkText);
      const textWidth = metrics.width;
      const textHeight = 48; // Approximate height of the text

      let x, y;
      switch (watermarkPosition) {
        case 'top-left':
          x = 10;
          y = textHeight;
          break;
        case 'top-right':
          x = canvas.width - textWidth - 10;
          y = textHeight;
          break;
        case 'bottom-left':
          x = 10;
          y = canvas.height - 10;
          break;
        case 'bottom-right':
          x = canvas.width - textWidth - 10;
          y = canvas.height - 10;
          break;
        case 'center':
          x = (canvas.width - textWidth) / 2;
          y = canvas.height / 2;
          break;
        default:
          x = 10;
          y = canvas.height - 10;
      }

      ctx.fillText(watermarkText, x, y);

      setSuccess(true);
      setError('');
    };
    img.src = image;
  };

  return (
    <div className="flex">
      <div className="flex-grow mr-6">
        <h1 className="text-3xl font-bold mb-2">Add Watermark</h1>
        <p className="text-muted-foreground mb-6">Easily add watermarks to your images with our tool.</p>
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">Upload Image</Label>
                <Input type="file" id="image-upload" className="w-full" onChange={handleImageUpload} accept="image/*" />
                <p className="mt-1 text-sm text-muted-foreground">Supported formats: JPG, PNG, WebP</p>
              </div>
              {image && (
                <div className="mt-4">
                  <img src={image} alt="Uploaded" className="max-w-full h-auto" />
                </div>
              )}
              <div>
                <Label htmlFor="watermark-text" className="block text-sm font-medium mb-2">Watermark Text</Label>
                <Input 
                  type="text" 
                  id="watermark-text" 
                  placeholder="Enter watermark text" 
                  className="w-full"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="watermark-position" className="block text-sm font-medium mb-2">Watermark Position</Label>
                <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="watermark-color" className="block text-sm font-medium mb-2">Watermark Color</Label>
                <Input 
                  type="color" 
                  id="watermark-color" 
                  className="w-full h-10"
                  value={watermarkColor}
                  onChange={(e) => setWatermarkColor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="additional-notes" className="block text-sm font-medium mb-2">Additional Notes</Label>
                <Textarea 
                  id="additional-notes" 
                  placeholder="Enter any additional notes or instructions" 
                  className="w-full"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
              <Button 
                variant="default" 
                className="w-full bg-primary text-white hover:bg-primary-dark"
                onClick={applyWatermark}
              >
                Add Watermark
              </Button>
            </div>
          </CardContent>
        </Card>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4">
            <AlertDescription>Watermark added successfully!</AlertDescription>
          </Alert>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <Toolbar />
    </div>
  );
}