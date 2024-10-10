// VisualIdentityTab.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Project } from '@/hooks/types';

interface VisualIdentityTabProps {
  visualIdentity: Project['visualIdentity'];
  updateProject: (section: keyof Project, data: any) => void;
  saveProject: (section: keyof Project) => Promise<void>;
}

const VisualIdentityTab: React.FC<VisualIdentityTabProps> = ({ visualIdentity, updateProject, saveProject }) => {
  const handleInputChange = (field: keyof NonNullable<Project['visualIdentity']>, value: any) => {
    updateProject('visualIdentity', { ...visualIdentity, [field]: value });
  };

  const handleTypographyChange = (field: keyof NonNullable<NonNullable<Project['visualIdentity']>['typography']>, value: string) => {
    updateProject('visualIdentity', {
      ...visualIdentity,
      typography: {
        ...visualIdentity?.typography,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Visual Identity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="logoDescription" className="block text-sm font-medium mb-2">Logo Description:</label>
            <Textarea
              id="logoDescription"
              value={visualIdentity?.logoDescription || ''}
              onChange={(e) => handleInputChange('logoDescription', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Color Palette:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {visualIdentity?.colorPalette?.map((color, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newPalette = [...(visualIdentity?.colorPalette || [])];
                      newPalette[index] = e.target.value;
                      handleInputChange('colorPalette', newPalette);
                    }}
                    className="w-12 h-12 p-1 rounded-full"
                  />
                  <span className="text-xs mt-1">{color}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="primaryFont" className="block text-sm font-medium mb-2">Primary Font:</label>
            <Input
              id="primaryFont"
              value={visualIdentity?.typography?.primary || ''}
              onChange={(e) => handleTypographyChange('primary', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="secondaryFont" className="block text-sm font-medium mb-2">Secondary Font:</label>
            <Input
              id="secondaryFont"
              value={visualIdentity?.typography?.secondary || ''}
              onChange={(e) => handleTypographyChange('secondary', e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={() => saveProject('visualIdentity')} className="w-full sm:w-auto">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualIdentityTab;