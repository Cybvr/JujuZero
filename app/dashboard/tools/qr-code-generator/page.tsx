"use client";

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QrCode, Upload, Droplet, X } from 'lucide-react';
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { generateQRCode } from './qrCodeUtils';

const socialIcons = [
  'appstore.png', 'discord.png', 'facebook.png', 'instagram.png', 'linkedin.png',
  'paypal.png', 'playstore.png', 'reddit.png', 'slack.png', 'snapchat.png',
  'spotify.png', 'stripe.png', 'tiktok.png', 'twitch.png', 'twitter.png'
];

const pixelTypes = [
  { name: 'Square', value: 'square', image: '/images/pixels/square.png' },
  { name: 'Rounded', value: 'rounded', image: '/images/pixels/rounded.png' },
  { name: 'Dots', value: 'dots', image: '/images/pixels/dots.png' },
  { name: 'Diamond', value: 'diamond', image: '/images/pixels/diamond.png' },
];

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div 
            className="w-10 h-10 rounded-md border cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => document.getElementById(`${label}-picker`)?.click()}
          />
          <input
            id={`${label}-picker`}
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full"
          />
        </div>
        <Input 
          type="text" 
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-28"
        />
        <Droplet className="h-5 w-5 text-muted-foreground cursor-pointer" onClick={() => document.getElementById(`${label}-picker`)?.click()} />
      </div>
    </div>
  );
};

export default function QRCodeGenerator() {
  const [qrContent, setQrContent] = useState('');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedPixelType, setSelectedPixelType] = useState('square');
  const { user } = useAuth();
  const { toast } = useToast();

  const generateQRCodeWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!qrContent) {
      toast({
        title: "Error",
        description: "Please enter a URL for the QR code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const logo = uploadedImage || (selectedIcon ? `/images/logos/${selectedIcon}` : null);
      const qrCodeDataURL = await generateQRCode(qrContent, {
        fgColor,
        bgColor,
        logo,
        pixelStyle: selectedPixelType,
      });

      setQRCodeDataURL(qrCodeDataURL);
      setShowCustomization(true);
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated. You can now customize it.",
      });
    } catch (err) {
      console.error("Error generating QR code:", err);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQRCode = async () => {
    if (!qrContent) return;

    try {
      const logo = uploadedImage || (selectedIcon ? `/images/logos/${selectedIcon}` : null);
      const qrCodeDataURL = await generateQRCode(qrContent, {
        fgColor,
        bgColor,
        logo,
        pixelStyle: selectedPixelType,
      });

      setQRCodeDataURL(qrCodeDataURL);
    } catch (err) {
      console.error("Error updating QR code:", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setSelectedIcon(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconSelect = (icon: string | null) => {
    setSelectedIcon(icon);
    setUploadedImage(null);
  };

  useEffect(() => {
    if (showCustomization) {
      updateQRCode();
    }
  }, [fgColor, bgColor, uploadedImage, selectedIcon, selectedPixelType, showCustomization]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2 flex items-center text-foreground">
            <QrCode className="mr-2 h-6 w-6" />
            QR Code Generator
          </h1>
          <p className="text-muted-foreground text-sm">Create and customize QR codes for your business or personal use</p>
          <Separator className="my-4" />
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={generateQRCodeWrapper} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="qr-content" className="text-sm font-medium">QR Code URL</Label>
                <Input 
                  id="qr-content" 
                  placeholder="Enter URL for QR code" 
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                />
              </div>
              <Button 
                type="submit"
                variant="default" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </form>

            {showCustomization && (
              <div className="mt-8 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                <div className="w-full lg:w-1/2 space-y-6">
                  <h3 className="text-lg font-medium">Customize Your QR Code</h3>
                  <div className="space-y-4">
                    <ColorPicker color={fgColor} onChange={setFgColor} label="Foreground Color" />
                    <ColorPicker color={bgColor} onChange={setBgColor} label="Background Color" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pixel Type</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {pixelTypes.map((type) => (
                        <Button
                          key={type.value}
                          type="button"
                          variant={selectedPixelType === type.value ? "default" : "outline"}
                          className="p-2"
                          onClick={() => setSelectedPixelType(type.value)}
                        >
                          <img src={type.image} alt={type.name} className="w-6 h-6" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Add Logo or Icon</Label>
                    <div className="flex space-x-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Image...
                      </Button>
                      <Input 
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {socialIcons.map((icon) => (
                        <Button
                          key={icon}
                          type="button"
                          variant={selectedIcon === icon ? "default" : "outline"}
                          className="p-2"
                          onClick={() => handleIconSelect(icon)}
                        >
                          <img src={`/images/logos/${icon}`} alt={icon} className="w-6 h-6" />
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant={!selectedIcon && !uploadedImage ? "default" : "outline"}
                        className="p-2"
                        onClick={() => handleIconSelect(null)}
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <h3 className="text-lg font-medium mb-4">Preview</h3>
                  <div className="border border-border p-4 flex justify-center items-center bg-card aspect-square">
                    {qrCodeDataURL ? (
                      <img src={qrCodeDataURL} alt="Generated QR Code" className="max-w-full h-auto" />
                    ) : (
                      <p className="text-muted-foreground">QR code preview will appear here</p>
                    )}
                  </div>
                  {qrCodeDataURL && (
                    <div className="mt-4">
                      <Button 
                        variant="secondary"
                        className="w-full"
                        asChild
                      >
                        <a 
                          href={qrCodeDataURL} 
                          download="qrcode.png" 
                        >
                          Download QR Code
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toolbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}