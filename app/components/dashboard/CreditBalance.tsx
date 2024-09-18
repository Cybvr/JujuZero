import React, { useState, useEffect } from 'react';
import { getUserCredits } from '@/lib/credits';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteFriend from './InviteFriend';
import Subscription from '@/components/dashboard/Subscription';

export default function CreditBalance() {
  const [credits, setCredits] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserCredits(user.uid).then(setCredits);
    }
  }, [user]);

  if (credits === null) return <div>Loading credits...</div>;

  return (
    <div className="p-4 bg-background rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-0">{credits} credits</h2>
      <p className="mb-4 text-sm text-muted-foreground">Credits let you create and edit. Each user gets their own credits.</p>

      <Tabs defaultValue="subscribe">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscribe">Get unlimited credits</TabsTrigger>
          <TabsTrigger value="invite">Invite Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="subscribe">
          <Subscription />
        </TabsContent>
        <TabsContent value="invite">
          <InviteFriend />
        </TabsContent>
      </Tabs>
    </div>
  );
}