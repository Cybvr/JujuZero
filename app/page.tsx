"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Use 'next/navigation' here

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

return null;  // We don't even need to render anything here
}