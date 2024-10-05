"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { QrCode, Settings } from 'lucide-react';
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { getUserCredits, deductCredits } from '@/lib/credits';

const QR_CODE_COST = 10;
const MAX_CREDITS = 500;

export default function QRCodeGenerator() {
  const [qrContent, setQrContent] = useState('');
  const [qrSize, setQrSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const credits = await getUserCredits(user.uid);
        setUserCredits(credits);
      }
    }
    fetchCredits();
  }, [user]);

  const generateQRCode = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (userCredits === null || userCredits < QR_CODE_COST) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${QR_CODE_COST} credits to generate a QR code. Please add more credits.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Deduct credits first
      await deductCredits(user.uid, QR_CODE_COST);
      setUserCredits(prevCredits => prevCredits !== null ? Math.max(prevCredits - QR_CODE_COST, 0) : null);

      const dataURL = await QRCode.toDataURL(qrContent || 'https://replit.com', {
        width: qrSize,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
      setQRCodeDataURL(dataURL);
      toast({
        title: "QR Code Generated",
        description: `${QR_CODE_COST} credits have been deducted from your account.`,
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
            <form className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="qr-content" className="text-sm font-medium">QR Code Content</Label>
                  <Textarea 
                    id="qr-content" 
                    placeholder="Enter text or URL for QR code" 
                    className="resize-none"
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Settings className="mr-2 h-4 w-4" /> Configuration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="qr-size" className="text-sm">QR Code Size</Label>
                      <Select onValueChange={(value) => setQrSize(Number(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200">Small (200x200)</SelectItem>
                          <SelectItem value="300">Medium (300x300)</SelectItem>
                          <SelectItem value="400">Large (400x400)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Preview</h3>
                  <div className="border border-border p-4 flex justify-center items-center bg-card">
                    {qrCodeDataURL && <img src={qrCodeDataURL} alt="Generated QR Code" className="max-w-full h-auto" />}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="default" 
                  onClick={generateQRCode} 
                  className="w-full sm:w-auto"
                  disabled={isLoading || (userCredits !== null && userCredits < QR_CODE_COST)}
                >
                  {isLoading ? 'Generating...' : `Generate QR Code (${QR_CODE_COST} credits)`}
                </Button>
                {qrCodeDataURL && (
                  <Button 
                    variant="secondary"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <a 
                      href={qrCodeDataURL} 
                      download="qrcode.png" 
                    >
                      Download QR Code
                    </a>
                  </Button>
                )}
              </div>
              {userCredits !== null && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your current balance: {userCredits} credits
                </p>
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