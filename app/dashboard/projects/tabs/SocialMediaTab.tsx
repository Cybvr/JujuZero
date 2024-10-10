// SocialMediaTab.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from '@/hooks/types';

interface SocialMediaTabProps {
  socialMedia: Project['socialMedia'];
  updateProject: (section: keyof Project, data: any) => void;
  saveProject: (section: keyof Project) => Promise<void>;
}

const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ socialMedia, updateProject, saveProject }) => {
  const handlePostChange = (index: number, field: 'content' | 'platform', value: string) => {
    const newPosts = [...(socialMedia?.suggestedPosts || [])];
    newPosts[index] = { ...newPosts[index], [field]: value };
    updateProject('socialMedia', { ...socialMedia, suggestedPosts: newPosts });
  };

  const addNewPost = () => {
    const newPosts = [...(socialMedia?.suggestedPosts || []), { content: '', platform: '' }];
    updateProject('socialMedia', { ...socialMedia, suggestedPosts: newPosts });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <label className="block text-sm font-medium mb-2">Suggested Posts:</label>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {socialMedia?.suggestedPosts?.map((post, index) => (
              <div key={index} className="mb-4 p-4 bg-muted rounded-lg">
                <Textarea
                  value={post.content}
                  onChange={(e) => handlePostChange(index, 'content', e.target.value)}
                  className="w-full mb-2"
                  rows={3}
                  placeholder="Post content"
                />
                <Input
                  value={post.platform}
                  onChange={(e) => handlePostChange(index, 'platform', e.target.value)}
                  className="w-full"
                  placeholder="Platform"
                />
              </div>
            ))}
          </ScrollArea>
          <Button onClick={addNewPost} className="w-full sm:w-auto">Add New Post</Button>
          <Button onClick={() => saveProject('socialMedia')} className="w-full sm:w-auto mt-4">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaTab;