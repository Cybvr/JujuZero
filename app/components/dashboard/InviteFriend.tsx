"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function InviteFriend() {
  const [email, setEmail] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviterUid: user.uid, inviteeEmail: email }),
      });
      if (response.ok) {
        alert('Invitation sent successfully!');
        setEmail('');
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Give 200 credits and earn 200 credits for each new referral who signs up for Juju.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Friend's email"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-primary text-primary-foreground rounded">
          Invite Friend
        </button>
      </form>
    </div>
  );
}