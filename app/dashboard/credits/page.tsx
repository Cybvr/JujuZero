"use client";
import React from 'react';
import CreditBalance from '@/components/dashboard/CreditBalance';
import InviteFriend from '@/components/dashboard/InviteFriend';

export default function CreditsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Credits Management</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Current Balance</h2>
        <CreditBalance />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Invite Friends to Earn Credits</h2>
        <InviteFriend />
      </div>
    </div>
  );
}