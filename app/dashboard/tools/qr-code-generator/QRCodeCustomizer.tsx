// QRCodeCustomizer.tsx
import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Upload, Palette, QrCode } from 'lucide-react';
import { CustomizationOptions } from './qrCodeUtils';

const socialLogos = [
  { name: 'Facebook', url: '/images/logos/facebook.png' },
  { name: 'Twitter', url: '/images/logos/twitter.png' },
  { name: 'Instagram', url: '/images/logos/instagram.png' },
  { name: 'LinkedIn', url: '/images/logos/linkedin.png' },
];

const pixelStyles = [
  { name: 'Square', value: 'square', url: '/images/pixels/square.png' },
  { name: 'Rounded', value: 'rounded', url: '/images/pixels/rounded.png' },
  { name: 'Dots', value: 'dots', url: '/images/pixels/dots.png' },
  { name: 'Diamond', value: 'diamond', url: '/images/pixels/diamond.png' },
];

interface QRCodeCustomizerProps {
  customizationOptions: CustomizationOptions;
  setCustomizationOptions: (options: Partial<CustomizationOptions>) => void;
}

const QRCodeCustomizer: React.FC<QRCodeCustomizerProps> = ({ customizationOptions, setCustomizationOptions }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomizationOptions({
          logo: e.target?.result as string,
          selectedSocialLogo: null,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLogoSelect = (url: string) => {
    setCustomizationOptions({
      selectedSocialLogo: url,
      logo: null,
    });
  };

  const handlePixelStyleSelect = (value: string) => {
    setCustomizationOptions({ pixelStyle: value });
  };

  const handleColorChange = (type: 'fgColor' | 'bgColor', value: string) => {
    setCustomizationOptions({ [type]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center">
        <Settings className="mr-2 h-5 w-5" /> Customization
      </h3>
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center">
          <Palette className="mr-2 h-4 w-4" /> Color Settings
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fg-color" className="text-sm">Foreground Color</Label>
            <div className="flex items-center space-x-2">
              <Input 
                type="color" 
                id="fg-color" 
                value={customizationOptions.fgColor}
                onChange={(e) => handleColorChange('fgColor', e.target.value)}
                className="w-10 h-10 p-1 rounded-md"
              />
              <Input 
                type="text" 
                value={customizationOptions.fgColor}
                onChange={(e) => handleColorChange('fgColor', e.target.value)}
                className="flex-grow"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bg-color" className="text-sm">Background Color</Label>
            <div className="flex items-center space-x-2">
              <Input 
                type="color" 
                id="bg-color" 
                value={customizationOptions.bgColor}
                onChange={(e) => handleColorChange('bgColor', e.target.value)}
                className="w-10 h-10 p-1 rounded-md"
              />
              <Input 
                type="text" 
                value={customizationOptions.bgColor}
                onChange={(e) => handleColorChange('bgColor', e.target.value)}
                className="flex-grow"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center">
          <QrCode className="mr-2 h-4 w-4" /> Pixel Style
        </h4>
        <div className="flex flex-wrap gap-2">
          {pixelStyles.map((style) => (
            <Button
              key={style.value}
              type="button"
              variant={customizationOptions.pixelStyle === style.value ? "default" : "outline"}
              className="p-2"
              onClick={() => handlePixelStyleSelect(style.value)}
            >
              <img 
                src={style.url} 
                alt={style.name} 
                className="w-6 h-6"
              />
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center">
          <Upload className="mr-2 h-4 w-4" /> Logo Settings
        </h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo-upload" className="text-sm">Upload Custom Logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" /> Choose File
            </Button>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Or Select Social Media Logo</Label>
            <div className="flex flex-wrap gap-2">
              {socialLogos.map((socialLogo) => (
                <Button
                  key={socialLogo.name}
                  type="button"
                    variant={customizationOptions.selectedSocialLogo === socialLogo.url ? "default" : "outline"}
                                      className="p-2"
                                      onClick={() => handleSocialLogoSelect(socialLogo.url)}
                                    >
                                      <img 
                                        src={socialLogo.url} 
                                        alt={socialLogo.name} 
                                        className="w-6 h-6"
                                      />
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          {(customizationOptions.logo || customizationOptions.selectedSocialLogo) && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Logo Preview</h4>
                              <div className="border border-border p-2 rounded-md">
                                <img 
                                  src={customizationOptions.logo || customizationOptions.selectedSocialLogo || ''} 
                                  alt="Selected Logo" 
                                  className="max-w-full max-h-20 object-contain mx-auto"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    };

                    export default QRCodeCustomizer;