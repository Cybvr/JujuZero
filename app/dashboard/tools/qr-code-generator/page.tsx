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

export default function QRCodeGenerator() {
  const [qrContent, setQrContent] = useState('');
  const [qrSize, setQrSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');

  useEffect(() => {
    generateQRCode();
  }, [qrContent, qrSize, fgColor, bgColor]);

  const generateQRCode = async () => {
    try {
      const dataURL = await QRCode.toDataURL(qrContent || 'https://replit.com', {
        width: qrSize,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
      setQRCodeDataURL(dataURL);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  return (
    <div className="flex">
      <div className="flex-grow mr-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <QrCode className="mr-2" />
            QR Code Generator
          </h1>
          <p className="text-muted-foreground">Create custom QR codes for your business or personal use</p>
          <Separator orientation="horizontal" className="my-4" />
        </div>
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <Label htmlFor="qr-content" className="text-lg font-semibold">QR Code Content</Label>
                  <Textarea 
                    id="qr-content" 
                    placeholder="Enter text or URL for QR code" 
                    className="w-full h-32 resize-none"
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Settings className="mr-2" /> Configuration
                  </h3>
                  <div>
                    <Label htmlFor="qr-size" className="block mb-2">QR Code Size</Label>
                    <Select onValueChange={(value) => setQrSize(Number(value))}>
                      <SelectTrigger className="w-full">
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
                    <Label htmlFor="fg-color" className="block mb-2">Foreground Color</Label>
                    <Input 
                      type="color" 
                      id="fg-color" 
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bg-color" className="block mb-2">Background Color</Label>
                    <Input 
                      type="color" 
                      id="bg-color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <div className="border p-4 flex justify-center items-center bg-white">
                    {qrCodeDataURL && <img src={qrCodeDataURL} alt="Generated QR Code" />}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Button variant="default" size="lg" className="px-8 py-2 text-lg" onClick={generateQRCode}>
                  Generate QR Code
                </Button>
                {qrCodeDataURL && (
                  <a 
                    href={qrCodeDataURL} 
                    download="qrcode.png" 
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                  >
                    Download QR Code
                  </a>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toolbar />
    </div>
  );
}