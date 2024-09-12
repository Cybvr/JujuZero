// app/not-found.tsx
"use client"
  import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen text-center bg-gray-100 dark:bg-[#1e1e1e]">
      <div className="max-w-md p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h1 className="mb-4 text-3xl font-bold text-yellow-600">404 - Page Not Found!</h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Sorry, the page you are looking for doesn’t exist. It might have been removed, or you may have mistyped the URL.
        </p>
      
        <button onClick={() => router.push('/')} className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-500 focus:outline-none">
          Take Me Home
        </button>
      </div>
    </div>
  );
}