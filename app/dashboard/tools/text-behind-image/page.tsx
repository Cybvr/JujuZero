'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Toolbar from '@/components/dashboard/toolbar';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { getUserCredits, deductCredits } from '@/lib/credits';

const fontFamilies = [
  'Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana',
  'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
  'Trebuchet MS', 'Arial Black', 'Impact',
  // Google Fonts
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald',
  'Raleway', 'Merriweather', 'Poppins', 'Playfair Display',
  'Source Sans Pro', 'Ubuntu', 'Nunito', 'Crimson Text', 'Libre Baskerville',
  'Noto Sans', 'PT Sans', 'Quicksand', 'Rubik', 'Work Sans',
  // Signature-style Google Fonts
  'Pacifico', 'Dancing Script', 'Great Vibes', 'Satisfy', 'Allura',
  'Kaushan Script', 'Yellowtail', 'Tangerine', 'Pinyon Script', 'Mr Dafoe',
  'Alex Brush', 'Petit Formal Script', 'Carattere', 'Euphoria Script', 'Herr Von Muellerhoff',
  'Italianno', 'Lavishly Yours', 'Marck Script', 'Mrs Saint Delafield', 'Norican'
];

const TEXT_BEHIND_IMAGE_COST = 50; // Set the cost for using the text behind image tool

export default function TextBehindImagePage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(72);
  const [textOpacity, setTextOpacity] = useState(1);
  const [fontWeight, setFontWeight] = useState(400);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const credits = await getUserCredits(user.uid);
        setUserCredits(credits);
      }
    }
    fetchCredits();
  }, [user]);

  const processImage = useCallback(async (file: File) => {
    if (!user) {
      setShowAuthModal(true);
      return null;
    }

    if (userCredits === null || userCredits < TEXT_BEHIND_IMAGE_COST) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${TEXT_BEHIND_IMAGE_COST} credits to use this tool. Please add more credits.`,
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image_file', file);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to process image');
      }

      const processedImageBlob = await response.blob();
      const removedBgImageUrl = URL.createObjectURL(processedImageBlob);

      // Deduct credits
      await deductCredits(user.uid, TEXT_BEHIND_IMAGE_COST);
      setUserCredits(prevCredits => prevCredits !== null ? Math.max(prevCredits - TEXT_BEHIND_IMAGE_COST, 0) : null);

      toast({
        title: "Image Processed",
        description: `Your image has been successfully processed. ${TEXT_BEHIND_IMAGE_COST} credits have been deducted.`,
      });

      return removedBgImageUrl;
    } catch (err) {
      console.error('Image processing failed:', err);
      setError(err instanceof Error ? err.message : 'Image processing failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, userCredits, toast]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      const processedImageUrl = await processImage(file);
      if (processedImageUrl) {
        setRemovedBgImage(processedImageUrl);
        setProcessedImage(null);
        setError(null);
      }
    }
  };

  const updateCanvas = useCallback(() => {
    if (!canvasRef.current || !imagePreview || !removedBgImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw text
      ctx.globalAlpha = textOpacity;
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const x = (textPosition.x / 100) * canvas.width;
      const y = (textPosition.y / 100) * canvas.height;
      ctx.fillText(text, x, y);
      ctx.globalAlpha = 1;

      // Draw removed background image
      const removedBgImg = new Image();
      removedBgImg.onload = () => {
        ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
        setProcessedImage(canvas.toDataURL());
      };
      removedBgImg.src = removedBgImage;
    };
    img.src = imagePreview;
  }, [imagePreview, removedBgImage, text, fontFamily, fontSize, textOpacity, fontWeight, fontColor, textPosition]);

  useEffect(() => {
    if (removedBgImage) {
      updateCanvas();
    }
  }, [removedBgImage, text, fontFamily, fontSize, textOpacity, fontWeight, fontColor, textPosition, updateCanvas]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6 lg:w-1/2">
        <h1 className="text-xl sm:text-xl font-bold mb-2 text-foreground">Text Behind Image Tool</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Add text behind your images using AI</p>
        <Card className="bg-card shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="image-upload" className="block text-sm font-medium mb-2 text-foreground">Upload Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-background text-foreground"
                />
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Supported formats: JPG, PNG, WebP</p>
              </div>
              <div>
                <Label htmlFor="text-input" className="block text-sm font-medium mb-2 text-foreground">Text</Label>
                <Input
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here"
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="font-family" className="block text-sm font-medium mb-2 text-foreground">Font Family</Label>
                <Select onValueChange={setFontFamily} value={fontFamily}>
                  <SelectTrigger className="w-full bg-background text-foreground">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <Label htmlFor="font-size" className="block text-sm font-medium mb-2 text-foreground">Font Size</Label>
                  <Slider
                    id="font-size"
                    min={10}
                    max={500}
                    step={1}
                    defaultValue={[fontSize]}
                    onChange={(value) => setFontSize(value[0])}
                  />
                  <div className="mt-1 text-sm text-muted-foreground">
                    Font Size: {fontSize}px
                  </div>
                </div>
                <div className="w-1/2">
                  <Label htmlFor="text-opacity" className="block text-sm font-medium mb-2 text-foreground">Text Opacity</Label>
                  <Slider
                    id="text-opacity"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={[textOpacity * 100]}
                    onChange={(value) => setTextOpacity(value[0] / 100)}
                  />
                  <div className="mt-1 text-sm text-muted-foreground">
                    Opacity: {Math.round(textOpacity * 100)}%
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <Label htmlFor="text-position-x" className="block text-xs mb-1 text-foreground">X Position (%)</Label>
                  <Slider
                    id="text-position-x"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={[textPosition.x]}
                    onChange={(value) => setTextPosition(prev => ({ ...prev, x: value[0] }))}
                  />
                  <div className="mt-1 text-sm text-muted-foreground">
                    X: {textPosition.x}%
                  </div>
                </div>
                <div className="w-1/2">
                  <Label htmlFor="text-position-y" className="block text-xs mb-1 text-foreground">Y Position (%)</Label>
                  <Slider
                    id="text-position-y"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={[textPosition.y]}
                    onChange={(value) => setTextPosition(prev => ({ ...prev, y: value[0] }))}
                  />
                  <div className="mt-1 text-sm text-muted-foreground">
                    Y: {textPosition.y}%
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="font-weight" className="block text-sm font-medium mb-2 text-foreground">Font Weight</Label>
                <Select onValueChange={(value) => setFontWeight(Number(value))} value={fontWeight.toString()}>
                  <SelectTrigger className="w-full bg-background text-foreground">
                    <SelectValue placeholder="Select font weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
                      <SelectItem key={weight} value={weight.toString()}>{weight}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="font-color" className="block text-sm font-medium mb-2 text-foreground">Font Color</Label>
                <Input
                  id="font-color"
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {userCredits !== null && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your current balance: {userCredits} credits
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:w-1/2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Processing image...</span>
          </div>
        ) : removedBgImage ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2 text-foreground">Processed Image</h2>
            <div className="bg-muted p-2 rounded">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => {
                  if (processedImage) {
                    const link = document.createElement('a');
                    link.download = 'text-behind-image.png';
                    link.href = processedImage;
                    link.click();
                  }
                }}
                variant="secondary"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                disabled={!processedImage}
              >
                Download Image
              </Button>
            </div>
          </div>
        ) : imagePreview ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Selected Image</h3>
            <div className="bg-muted p-2 rounded">
              <img src={imagePreview} alt="Selected" className="max-w-full h-auto rounded max-h-48 object-contain" />
            </div>
          </div>
        ) : null}
      </div>
      <Toolbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}