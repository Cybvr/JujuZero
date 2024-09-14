"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

const professions = [
  "Entrepreneur", "Software Developer", "Marketing Specialist", "Product Manager",
  "Data Scientist", "UX/UI Designer", "Financial Analyst", "Business Consultant",
  "Sales Representative", "Human Resources Manager",
];

const focusAreas = [
  "Career Growth", "Skill Development", "Leadership", "Work-Life Balance",
  "Networking", "Industry Trends", "Problem Solving", "Communication Skills",
];

const experienceLevels = [
  "Entry Level", "Mid-Level", "Senior", "Executive",
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Sidekick() {
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome to Sidekick! 👋 I'm here to assist you with your professional development journey. To get started:

1. Click the '+' button on the left to set your profession, focus area, and experience level.
2. Once you've set your preferences, feel free to ask me anything related to your career or skills.
3. I'll provide personalized advice based on your profile.

What would you like to discuss today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedProfession || !selectedFocusArea || !selectedExperience) {
      toast({
        title: "Incomplete Information",
        description: "Please select all options and enter a message.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/sidekick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          profession: selectedProfession,
          focusArea: selectedFocusArea,
          experience: selectedExperience,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hide-footer">
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-8">
          

          {/* Chat Messages */}
          <Card className="mb-6 bg-background">
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-200px)] pr-4" ref={scrollAreaRef}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[70%] ${
                        message.role === 'user' 
                          ? 'bg-violet-700 text-white rounded-br-none' 
                          : 'bg-background text-foreground border border-border rounded-bl-none'
                      }`}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Input Field and Filter Button - Fixed at Bottom */}
        <div className="sticky bottom-6 md:bottom-8 sm:bottom-8 left-0 right-0 bg-background p-1 border-t">
          <div className="container mx-auto flex space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Options</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="profession" className="text-right">
                      Profession
                    </Label>
                    <Select onValueChange={(value) => setSelectedProfession(value)} value={selectedProfession}>
                      <SelectTrigger id="profession" className="col-span-3">
                        <SelectValue placeholder="Select a profession" />
                      </SelectTrigger>
                      <SelectContent>
                        {professions.map((profession) => (
                          <SelectItem key={profession} value={profession}>
                            {profession}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="focusArea" className="text-right">
                      Focus Area
                    </Label>
                    <Select onValueChange={(value) => setSelectedFocusArea(value)} value={selectedFocusArea}>
                      <SelectTrigger id="focusArea" className="col-span-3">
                        <SelectValue placeholder="Select a focus area" />
                      </SelectTrigger>
                      <SelectContent>
                        {focusAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="experience" className="text-right">
                      Experience
                    </Label>
                    <Select onValueChange={(value) => setSelectedExperience(value)} value={selectedExperience}>
                      <SelectTrigger id="experience" className="col-span-3">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}