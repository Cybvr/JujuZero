// File: /app/components/BrandWizard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getUserCredits, deductCredits } from '@/lib/credits';

const BRAND_GENERATION_COST = 100;

const samplePrompts = [
  {
    title: 'Snippet 1',
    fullText: 'Hi, my brand is a lemonade store selling fresh and organic lemonade to health-conscious consumers.',
  },
  {
    title: 'Snippet 2',
    fullText: 'Hello there! We are a tech startup focused on AI solutions that automate simple daily tasks.',
  },
  {
    title: 'Snippet 3',
    fullText: 'Greetings! Our brand champions eco-friendly clothing for a sustainable future.',
  },
];

export default function BrandWizard() {
  const [initialInput, setInitialInput] = useState({
    name: '',
    description: '',
  });
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('input');
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const credits = await getUserCredits(user.uid);
        setUserCredits(credits);
      }
    }
    fetchCredits();
  }, [user]);

  const maxDescriptionLength = 500;

  const validateInput = () => {
    if (initialInput.name.trim() === '') {
      setError('Brand name is required');
      return false;
    }
    if (initialInput.description.trim() === '') {
      setError('Brand description is required');
      return false;
    }
    if (initialInput.description.length < 10) {
      setError('Brand description should be at least 10 characters long');
      return false;
    }
    return true;
  };

  const generateFullBrand = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to generate a brand.',
        variant: 'destructive',
      });
      return;
    }

    if (userCredits === null || userCredits < BRAND_GENERATION_COST) {
      toast({
        title: 'Insufficient Credits',
        description: `You need ${BRAND_GENERATION_COST} credits to generate a brand. Please add more credits.`,
        variant: 'destructive',
      });
      return;
    }

    if (!validateInput()) return;

    setLoading(true);
    setError('');

    try {
      await deductCredits(user.uid, BRAND_GENERATION_COST);
      setUserCredits((prevCredits) => (prevCredits !== null ? Math.max(prevCredits - BRAND_GENERATION_COST, 0) : null));

      const response = await fetch('/api/openai/generateBrand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialInput),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjectData(data);
      setCurrentStep('review');
      toast({
        title: 'Brand Generated',
        description: `${BRAND_GENERATION_COST} credits have been deducted from your account.`,
      });
    } catch (error) {
      console.error('Error generating brand:', error);
      setError('Failed to generate brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxDescriptionLength) {
      setInitialInput((prev) => ({ ...prev, description: e.target.value }));
    }
  };

  const renderInputStep = () => (
    <div className="space-y-2">
      <Input
        placeholder="Brand Name"
        value={initialInput.name}
        onChange={(e) => setInitialInput((prev) => ({ ...prev, name: e.target.value }))}
        className="w-full"
      />
      <Textarea
        placeholder="Brief description or concept for your brand"
        value={initialInput.description}
        onChange={onDescriptionChange}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground text-right">
        {initialInput.description.length}/{maxDescriptionLength}
      </p>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Select a sample description to insert:</p>
        <div className="flex space-x-2">
          {samplePrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-8 w-auto flex items-center space-x-1"
              onClick={() => setInitialInput((prev) => ({ ...prev, description: prompt.fullText }))}
            >
              <PlusCircle className="h-3 w-3" />
              <span>{prompt.title}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={generateFullBrand} disabled={loading} className="flex items-center space-x-2">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <span>Build ({BRAND_GENERATION_COST} credits)</span>
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div>
      <p>Review your generated brand data here...</p>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{currentStep === 'input' ? 'Create Your Brand' : 'Review Your Brand'}</CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 'input' ? renderInputStep() : renderReviewStep()}
        {currentStep === 'review' && (
          <div className="mt-4 space-x-4">
            <Button onClick={() => setCurrentStep('input')}>Start Over</Button>
            <Button>Save Brand</Button>
          </div>
        )}
      </CardContent>
      {userCredits !== null && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Your current balance: {userCredits} credits
        </p>
      )}
    </Card>
  );
}