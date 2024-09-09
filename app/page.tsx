"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/home');  // This will route to the marketing page
      }
    }
  }, [user, loading, router]);

  // Show a loading state while checking auth
  if (loading) {
    return <div>Loading...</div>;  // Or a more sophisticated loading component
  }

  // This component doesn't render anything itself, it just handles routing
  return null;
}