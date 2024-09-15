import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X, Image as ImageIcon, Upload } from 'lucide-react'

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
  const [newColor, setNewColor] = useState('');

  const handleChange = async (section: keyof typeof content, value: string | string[]) => {
    const newContent = { ...localContent, [section]: value };
    setLocalContent(newContent);
    await onSave({ [section]: value });
  };

  const addColor = () => {
    if (newColor) {
      const updatedColors = [...localContent.colors, newColor];
      handleChange('colors', updatedColors);
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = localContent.colors.filter((_, i) => i !== index);
    handleChange('colors', updatedColors);
  };

  const removeLogo = (index: number) => {
    const updatedLogos = localContent.logos.filter((_, i) => i !== index);
    handleChange('logos', updatedLogos);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to a server and get a URL back
      // For this example, we'll use a fake URL
      const fakeUrl = URL.createObjectURL(file);
      const updatedLogos = [...localContent.logos, fakeUrl];
      handleChange('logos', updatedLogos);
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Brand Guidelines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Colors</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {localContent.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2 bg-background p-2 rounded-md">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
                <span>{color}</span>
                <Button variant="ghost" size="sm" onClick={() => removeColor(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Enter color (e.g., #FF0000)"
              className="w-48"
            />
            <Button onClick={addColor}>
              <Plus className="h-4 w-4 mr-2" /> Add Color
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Logos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {localContent.logos.slice(0, 3).map((logo, index) => (
              <div key={index} className="relative bg-muted rounded-lg p-4 flex items-center justify-center aspect-square group">
                <div className="absolute inset-0 flex items-center justify-center">
                  {logo ? (
                    <img 
                      src={logo} 
                      alt={`Logo ${index + 1}`} 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if(e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                        }
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100" 
                  onClick={() => removeLogo(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="relative bg-muted rounded-lg p-4 flex items-center justify-center aspect-square">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Upload className="h-16 w-16 mb-2" />
                <span className="text-sm">Upload Logo</span>
              </div>
            </div>
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