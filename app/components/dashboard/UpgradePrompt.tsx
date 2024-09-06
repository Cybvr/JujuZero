import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradePrompt({ isOpen, onClose }: UpgradePromptProps) {
  const handleUpgrade = () => {
    // Dummy upgrade function
    console.log('User wants to upgrade');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
        </DialogHeader>
        <p>Upgrade to Pro for unlimited tool usage and document storage!</p>
        <Button onClick={handleUpgrade}>Upgrade Now</Button>
      </DialogContent>
    </Dialog>
  );
}