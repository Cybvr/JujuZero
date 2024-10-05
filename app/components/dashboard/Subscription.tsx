import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addCredits } from '@/lib/credits';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';

const SUBSCRIPTION_CREDITS = 1000;

export default function Subscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await addCredits(user.uid, SUBSCRIPTION_CREDITS);
      alert(`Successfully subscribed! ${SUBSCRIPTION_CREDITS} credits added to your account.`);
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Juju Pro</CardTitle>
        <CardDescription>More credits for your creative journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">$12/month</p>
          <p className="text-sm text-muted-foreground">Billed monthly</p>
        </div>
        <ul className="space-y-2">
          {[
            `${SUBSCRIPTION_CREDITS} credits per month`,
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