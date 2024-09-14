// app/dashboard/sidekick/layout.tsx

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';

export default function SidekickLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}