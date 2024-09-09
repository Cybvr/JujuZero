import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface BrandGuidelinesProps {
  content: {
    colors: string[];
    logos: string[];
    typography: string[];
    brandValues: string[];
    tagline: string;
    missionStatement: string;
  };
  onSave: (newContent: Partial<BrandGuidelinesProps['content']>) => Promise<void>;
}

export default function BrandGuidelinesAsset({ content, onSave }: BrandGuidelinesProps) {
  const [localContent, setLocalContent] = useState(content);

  const handleChange = async (section: keyof typeof content, value: string | string[]) => {
    const newContent = { ...localContent, [section]: value };
    setLocalContent(newContent);
    await onSave({ [section]: value });
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Brand Guidelines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {localContent.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
                <Input
                  value={color}
                  onChange={(e) => handleChange('colors', localContent.colors.map((c, i) => i === index ? e.target.value : c))}
                  className="w-24"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Logos</h3>
          <div className="grid grid-cols-2 gap-4">
            {localContent.logos.map((logo, index) => (
              <div key={index} className="relative">
                <img src={logo} alt={`Logo ${index + 1}`} className="w-full h-auto" />
                <p className="mt-2 text-sm text-muted-foreground">Logo description or URL here</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Typography</h3>
          {localContent.typography.map((font, index) => (
            <Input
              key={index}
              value={font}
              onChange={(e) => handleChange('typography', localContent.typography.map((f, i) => i === index ? e.target.value : f))}
              className="mb-2"
            />
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Brand Values</h3>
          <Input
            value={localContent.brandValues.join(', ')}
            onChange={(e) => handleChange('brandValues', e.target.value.split(',').map(v => v.trim()))}
            className="mb-2"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tagline</h3>
          <Input
            value={localContent.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="mb-2"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mission Statement</h3>
          <Textarea
            value={localContent.missionStatement}
            onChange={(e) => handleChange('missionStatement', e.target.value)}
            className="mb-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}