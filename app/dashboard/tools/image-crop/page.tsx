"use client";

import React, { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '../../../components/dashboard/toolbar';

const CustomSlider: React.FC<{
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}> = ({ id, min, max, step, value, onChange, className }) => {
  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className}
    />
  );
};

export default function ImageCropPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 30,
    height: 30,
    x: 0,
    y: 0
  });
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [zoom, setZoom] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onAspectRatioChange = (value: string) => {
    setAspectRatio(value);
    if (value === 'free') {
      setAspect(undefined);
    } else if (value === 'custom') {
      // Handle custom aspect ratio
    } else {
      const [width, height] = value.split(':').map(Number);
      setAspect(width / height);
    }
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (imgRef.current) {
      imgRef.current.style.transform = `scale(${newZoom})`;
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  const handleCropClick = async () => {
    if (!completedCrop || !imgRef.current) {
      setError('Please select a crop area');
      return;
    }

    try {
      const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop);
      console.log('Cropped image URL:', croppedImageUrl);
      setSuccess(true);
      setError('');
      // Here you would typically send the cropped image to a server or download it
    } catch (e) {
      setError('Failed to crop image');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2 text-foreground">Image Crop</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Crop images easily to your desired dimensions.</p>
        <Card className="bg-background shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block text-sm font-medium mb-2 text-foreground">Upload Image</Label>
                <Input type="file" id="image-upload" className="w-full bg-background text-foreground" accept="image/*" onChange={onSelectFile} />
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Supported formats: JPG, PNG, WebP, GIF</p>
              </div>
              {src && (
                <div className="max-w-full overflow-auto">
                  <ReactCrop
                    crop={crop}
                    onChange={(c, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                  >
                    <img ref={imgRef} src={src} style={{ maxWidth: '100%' }} />
                  </ReactCrop>
                </div>
              )}
              <div>
                <Label htmlFor="aspect-ratio" className="block text-sm font-medium mb-2 text-foreground">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
                  <SelectTrigger className="w-full bg-background text-foreground">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free Form</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zoom" className="block text-sm font-medium mb-2 text-foreground">Zoom</Label>
                <CustomSlider
                  id="zoom"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={onZoomChange}
                  className="w-full"
                />
              </div>
              <Button 
                variant="default" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={handleCropClick}
              >
                Crop Image
              </Button>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mt-4">
                <AlertDescription>Image cropped successfully!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <Toolbar />
    </div>
  );
}