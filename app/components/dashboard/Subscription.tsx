import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { setUnlimitedCredits } from '@/lib/credits';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';

export default function Subscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Here you would typically integrate with a payment processor
      // For this example, we'll just set the user to have unlimited credits
      await setUnlimitedCredits(user.uid, true);
      alert('Successfully subscribed to Pro plan!');
    } catch (error) {
      console.error('Error subscribing to Pro plan:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gamma Pro</CardTitle>
        <CardDescription>Unlimited credits for your creative journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">$15/month</p>
          <p className="text-sm text-muted-foreground">Billed monthly</p>
        </div>
        <ul className="space-y-2">
          {[
            'Unlimited credits',
            'Priority support',
            'Early access to new features',
            'Exclusive Pro community'
          ].map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubscribe} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Subscribe Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}