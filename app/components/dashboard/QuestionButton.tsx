import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HelpCircle } from 'lucide-react';
import { FeedbackDialog } from '@/components/ui/FeedbackDialog';
import ChangelogPopup from '@/components/dashboard/ChangelogPopup';

const QuestionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-accent text-muted-foreground hover:bg-background">
              <HelpCircle className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => window.open('/help-faq', '_blank')}>
              Help & FAQ
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsFeedbackDialogOpen(true)}>
              Feedback
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsChangelogOpen(true)}>
              What's New
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <FeedbackDialog
        isOpen={isFeedbackDialogOpen}
        onClose={() => setIsFeedbackDialogOpen(false)}
      />
      <ChangelogPopup
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </>
  );
};

export default QuestionButton;