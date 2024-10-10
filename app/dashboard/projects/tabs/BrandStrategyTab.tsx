// BrandStrategyTab.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Project } from '@/hooks/types';

interface BrandStrategyTabProps {
  brandStrategy: Project['brandStrategy'];
  updateProject: (section: keyof Project, data: any) => void;
  saveProject: (section: keyof Project) => Promise<void>;
}

const BrandStrategyTab: React.FC<BrandStrategyTabProps> = ({ brandStrategy, updateProject, saveProject }) => {
  const handleInputChange = (field: keyof NonNullable<Project['brandStrategy']>, value: string) => {
    updateProject('brandStrategy', { ...brandStrategy, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Strategy Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="mission" className="block text-sm font-medium mb-2">Mission:</label>
            <Textarea
              id="mission"
              value={brandStrategy?.mission || ''}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="vision" className="block text-sm font-medium mb-2">Vision:</label>
            <Textarea
              id="vision"
              value={brandStrategy?.vision || ''}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium mb-2">Target Audience:</label>
            <Textarea
              id="targetAudience"
              value={brandStrategy?.targetAudience || ''}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="positioning" className="block text-sm font-medium mb-2">Positioning:</label>
            <Textarea
              id="positioning"
              value={brandStrategy?.positioning || ''}
              onChange={(e) => handleInputChange('positioning', e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <Button onClick={() => saveProject('brandStrategy')} className="w-full sm:w-auto">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandStrategyTab;