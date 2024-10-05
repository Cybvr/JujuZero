// components/ui/Feedback.tsx
"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface FeedbackProps {
  onFeedback: (type: 'up' | 'down') => void;
  feedback: 'up' | 'down' | null;
}

const Feedback: React.FC<FeedbackProps> = ({ onFeedback, feedback }) => {
  const { toast } = useToast();

  const handleFeedback = (type: 'up' | 'down') => {
    onFeedback(type);
    toast({
      title: "Feedback Received",
      description: type === 'up' ? "Thanks for the positive feedback!" : "We'll work on making it better!",
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <p>Did you find this analysis helpful?</p>
      <Button variant="ghost" onClick={() => handleFeedback('up')}>
        <ThumbsUp className={`h-6 w-6 ${feedback === 'up' ? 'text-green-600' : ''}`} />
      </Button>
      <Button variant="ghost" onClick={() => handleFeedback('down')}>
        <ThumbsDown className={`h-6 w-6 ${feedback === 'down' ? 'text-red-600' : ''}`} />
      </Button>
    </div>
  );
};

export default Feedback;
