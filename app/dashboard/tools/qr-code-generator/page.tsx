"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QrCode, Settings } from 'lucide-react';
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";

export default function QRCodeGenerator() {
  const [qrContent, setQrContent] = useState('');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const { user } = useAuth();
  const { toast } = useToast();

  const generateQRCode = async (e: React.FormEvent) => {
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
      await updateQRCode();
      setShowConfig(true);
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated successfully.",
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
    try {
      const dataURL = await QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 1,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
      setQRCodeDataURL(dataURL);
    } catch (err) {
      console.error("Error updating QR code:", err);
    }
  };

  useEffect(() => {
    if (qrCodeDataURL) {
      updateQRCode();
    }
  }, [fgColor, bgColor]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2 flex items-center text-foreground">
            <QrCode className="mr-2 h-6 w-6" />
            QR Code Generator
          </h1>
          <p className="text-muted-foreground text-sm">Create custom QR codes for your business or personal use</p>
          <Separator className="my-4" />
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={generateQRCode} className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:space-x-6 pb-8">
                <div className="flex-grow space-y-6">
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
                  {showConfig && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium flex items-center">
                        <Settings className="mr-2 h-4 w-4" /> Configuration
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fg-color" className="text-sm">Foreground Color</Label>
                          <Input 
                            type="color" 
                            id="fg-color" 
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            className="h-10 px-3 py-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bg-color" className="text-sm">Background Color</Label>
                          <Input 
                            type="color" 
                            id="bg-color" 
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="h-10 px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="lg:w-1/2 mt-6 lg:mt-0">
                  <h3 className="text-sm font-medium mb-4">Preview</h3>
                  <div className="border border-border p-1 flex justify-center items-center bg-card h-full">
                    {qrCodeDataURL ? (
                      <img src={qrCodeDataURL} alt="Generated QR Code" className="max-w-full h-auto" />
                    ) : (
                      <p className="text-muted-foreground">QR code preview will appear here</p>
                    )}
                  </div>
                </div>
              </div>
              {qrCodeDataURL && (
                <div className="flex justify-end mt-8">
                  <Button 
                    variant="secondary"
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
            </form>
          </CardContent>
        </Card>
      </div>
      <Toolbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}