// File: /app/dashboard/projects/new/page.tsx

import React from 'react';
import BrandWizard from '@/components/BrandWizard';

export default function NewProjectPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8" 
      style={{ 
        background: 'linear-gradient(to right, purple, violet)' 
      }}
    >
      <BrandWizard />
    </div>
  );
}