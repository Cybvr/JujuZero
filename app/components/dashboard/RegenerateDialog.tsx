import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Briefcase, CoffeeIcon } from 'lucide-react';

interface RegenerateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (prompt: string, option: string) => Promise<void>;
}

export function RegenerateDialog({ isOpen, onClose, onRegenerate }: RegenerateDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = async (option: string) => {
    await onRegenerate(prompt, option);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Regenerate Project Content</DialogTitle>
          <DialogDescription>
            Choose how you want to regenerate your project content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Ask Juju to...</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              variant={selectedOption === 'try_something_else' ? 'default' : 'outline'} 
              onClick={() => handleOptionClick('try_something_else')}
              className="justify-start"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Try Something Else
            </Button>
            <Button 
              variant={selectedOption === 'more_professional' ? 'default' : 'outline'} 
              onClick={() => handleOptionClick('more_professional')}
              className="justify-start"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              More Professional
            </Button>
            <Button 
              variant={selectedOption === 'more_casual' ? 'default' : 'outline'} 
              onClick={() => handleOptionClick('more_casual')}
              className="justify-start"
            >
              <CoffeeIcon className="mr-2 h-4 w-4" />
              More Casual
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}