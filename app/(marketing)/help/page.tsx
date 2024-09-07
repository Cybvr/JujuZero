"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users, FileText, Zap, CreditCard, Shield, HelpCircle, Code } from "lucide-react";
import Link from 'next/link';

const helpCategories = [
  { title: 'Getting Started', icon: BookOpen, path: '/help/getting-started', description: 'Learn the basics of using JujuAGI and set up your account.' },
  { title: 'Account Management', icon: Users, path: '/help/account-management', description: 'Manage your profile, settings, and subscription details.' },
  { title: 'File Conversion', icon: FileText, path: '/help/file-conversion', description: 'Convert files between different formats effortlessly.' },
  { title: 'Document Management', icon: FileText, path: '/help/document-management', description: 'Organize, edit, and share your documents efficiently.' },
  { title: 'Collaboration', icon: Users, path: '/help/collaboration', description: 'Work together with team members on projects and files.' },
  { title: 'AI Features', icon: Zap, path: '/help/ai-features', description: 'Leverage AI-powered tools for enhanced productivity.' },
  { title: 'Pricing and Plans', icon: CreditCard, path: '/help/pricing-plans', description: 'Understand our pricing structure and choose the right plan.' },
  { title: 'Security and Privacy', icon: Shield, path: '/help/security-privacy', description: 'Learn about our security measures and data protection policies.' },
  { title: 'Troubleshooting', icon: HelpCircle, path: '/help/troubleshooting', description: 'Find solutions to common issues and get support.' },
  { title: 'API Documentation', icon: Code, path: '/help/api-documentation', description: 'Integrate JujuAGI into your own applications.' },
];

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Help Center</h1>
      <p className="text-muted-foreground mb-6">Find answers to your questions and learn how to make the most of JujuAGI.</p>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpCategories.map((category, index) => (
          <Link href={category.path} key={index}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <category.icon className="w-5 h-5 text-primary" />
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Need more help?</h2>
        <p className="text-muted-foreground mb-4">
          If you can't find what you're looking for, our support team is here to assist you.
        </p>
        <Link href="/support" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  );
}