// BrandVoiceTab.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Project } from '@/hooks/types';

interface BrandVoiceTabProps {
  brandVoice: Project['brandVoice'];
  updateProject: (section: keyof Project, data: any) => void;
  saveProject: (section: keyof Project) => Promise<void>;
}

const BrandVoiceTab: React.FC<BrandVoiceTabProps> = ({ brandVoice, updateProject, saveProject }) => {
  const handleInputChange = (field: keyof NonNullable<Project['brandVoice']>, value: any) => {
    updateProject('brandVoice', { ...brandVoice, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Brand Voice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="toneOfVoice" className="block text-sm font-medium mb-2">Tone of Voice:</label>
            <Textarea
              id="toneOfVoice"
              value={brandVoice?.toneOfVoice || ''}
              onChange={(e) => handleInputChange('toneOfVoice', e.target.value)}
              className="w-full"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Key Messages:</label>
            {brandVoice?.keyMessages?.map((message, index) => (
              <Input
                key={index}
                value={message}
                onChange={(e) => {
                  const newMessages = [...(brandVoice?.keyMessages || [])];
                  newMessages[index] = e.target.value;
                  handleInputChange('keyMessages', newMessages);
                }}
                className="w-full mt-2"
              />
            ))}
            <Button 
              onClick={() => {
                const newMessages = [...(brandVoice?.keyMessages || []), ''];
                handleInputChange('keyMessages', newMessages);
              }}
              className="mt-2"
            >
              Add Key Message
            </Button>
          </div>
          <Button onClick={() => saveProject('brandVoice')} className="w-full sm:w-auto">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandVoiceTab;