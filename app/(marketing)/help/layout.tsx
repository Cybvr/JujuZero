// @/app/(marketing)/help/layout.tsx
"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const helpPages = [
  { title: 'Getting Started', path: '/help/getting-started' },
  { title: 'Account Management', path: '/help/account-management' },
  { title: 'File Conversion', path: '/help/file-conversion' },
  { title: 'Document Management', path: '/help/document-management' },
  { title: 'Collaboration', path: '/help/collaboration' },
  { title: 'AI Features', path: '/help/ai-features' },
  { title: 'Pricing and Plans', path: '/help/pricing-plans' },
  { title: 'Security and Privacy', path: '/help/security-privacy' },
  { title: 'Troubleshooting', path: '/help/troubleshooting' },
  { title: 'API Documentation', path: '/help/api-documentation' },
];

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6">
        <nav>
          <ul className="space-y-2">
            {helpPages.map((page) => (
              <li key={page.path}>
                <Link 
                  href={page.path}
                  className={`block p-2 rounded ${
                    pathname === page.path ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}