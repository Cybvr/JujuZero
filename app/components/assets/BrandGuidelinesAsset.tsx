import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, Copy, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const generateColors = () => {
  const colors: string[] = [];
  for (let i = 0; i < 4; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 30) + 35; // 35-65%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

interface BrandGuidelinesAssetProps {
  content: any;
  onChange: (newContent: any) => void;
}

export default function BrandGuidelinesAsset({ content, onChange }: BrandGuidelinesAssetProps) {
  const [colors, setColors] = useState(content?.colors || []);
  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    if (colors.length === 0) {
      const newColors = generateColors();
      setColors(newColors);
      onChange({ ...content, colors: newColors });
    }
  }, []);

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
  };

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleColorChange = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
    onChange({ ...content, colors: newColors });
  };

  const safeContent = {
    logos: Array.isArray(content?.logos) && content.logos.length === 3 
      ? content.logos 
      : ['/placeholder.svg?height=200&width=200', '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=200&width=200'],
    typography: Array.isArray(content?.typography) ? content.typography : [],
  };

  return (
    <TooltipProvider>
      <div className="p-4 space-y-6 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Brand Guidelines</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white text-black border-gray-300">
                Export as <ChevronDown className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('png')}>Export as PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('jpg')}>Export as JPG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">Logos</h2>
          <div className="flex space-x-4 overflow-x-auto">
            {safeContent.logos.map((logo, index) => (
              <div key={index} className="flex-shrink-0">
                <img src={logo} alt={`Logo ${index + 1}`} className="h-24 w-24 object-cover border border-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <h2 className="text-base font-semibold">Colors</h2>
          <div className="flex space-x-4 overflow-x-auto">
            {colors.map((color, index) => (
              <div key={index} className="flex-shrink-0 flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-md shadow-md mb-2" 
                  style={{ backgroundColor: color }}
                ></div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white text-black border-gray-300 text-xs"
                  onClick={() => handleCopyColor(color)}
                >
                  {copiedColor === color ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                  {color}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <h2 className="text-base font-semibold">Typography</h2>
          <div className="space-y-2">
            {safeContent.typography.map((typography, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="p-2 bg-gray-50 rounded-md cursor-help">
                    <h3 className="font-semibold text-xs">{typography.title}</h3>
                    <p className="text-xs mt-1">{typography.description}</p>
                    {typography.example && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <span className="text-xs text-gray-500">Example:</span>
                        <p className="mt-1" style={{fontFamily: typography.fontFamily, fontSize: typography.fontSize}}>
                          {typography.example}
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Font: {typography.fontFamily}</p>
                  <p>Size: {typography.fontSize}</p>
                  {typography.additionalInfo && <p>{typography.additionalInfo}</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}