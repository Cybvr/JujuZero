"use client";

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "What is JujuAGI?",
    answer: "JujuAGI is an all-in-one platform for file conversion and editing tasks. We offer a suite of tools including PDF conversion, image editing, text tools, data conversion, and AI-powered features."
  },
  {
    question: "What file formats does JujuAGI support?",
    answer: "JujuAGI supports a wide range of file formats including PDF, JPG, PNG, Excel, CSV, XML, and JSON. Check our documentation for a full list of supported formats."
  },
  {
    question: "Is my data secure when using JujuAGI?",
    answer: "Yes, we prioritize your data security. All file transfers are encrypted, and files are only stored temporarily during processing. We conduct regular security audits to ensure compliance with industry standards."
  },
  {
    question: "How much does JujuAGI cost?",
    answer: "JujuAGI offers a flexible pricing plan with a monthly subscription of $10. We also have a free tier with limited features. Check our pricing page for more details."
  },
  {
    question: "Can I use JujuAGI on my mobile device?",
    answer: "Yes, JujuAGI is a web-based platform that works on any device with a modern web browser and stable internet connection."
  },
  {
    question: "How long does it take to process a file?",
    answer: "Processing time varies depending on the file size and the specific task. However, most operations are completed within seconds to a few minutes."
  },
  {
    question: "Do I need to install any software to use JujuAGI?",
    answer: "No, JujuAGI is entirely web-based. You only need a modern web browser to access all our tools and features."
  },
  {
    question: "What is the maximum file size I can upload?",
    answer: "The maximum file size varies depending on the tool you're using. Generally, we support files up to 100MB, but please check the specific tool's instructions for exact limits."
  },
  {
    question: "Can I batch process multiple files?",
    answer: "Yes, many of our tools support batch processing. You can upload multiple files at once for tasks like PDF merging or image conversion."
  },
  {
    question: "How often are new features added to JujuAGI?",
    answer: "We regularly update JujuAGI with new features and improvements. We typically roll out updates on a monthly basis, but major features may be added quarterly."
  },
  {
    question: "What if I need help using a tool?",
    answer: "We offer multiple support channels. You can refer to our detailed documentation, check our FAQs, or contact our support team via email or live chat during business hours."
  },
  {
    question: "Can I create projects in JujuAGI?",
    answer: "Yes, JujuAGI allows you to create and manage projects. You can organize your files, collaborate with team members, and keep track of your work efficiently."
  },
  {
    question: "What are some of the popular tools available in JujuAGI?",
    answer: "Some of our popular tools include QR Code Generator, Remove Background, Compress Image, and Video to MP4 converter. We're constantly adding new tools based on user feedback."
  },
  {
    question: "How does JujuAGI handle document management?",
    answer: "JujuAGI provides a robust document management system. You can upload, organize, edit, and share documents easily. Our system supports various file types and allows for easy collaboration."
  },
  {
    question: "Is there a limit to how many documents I can store?",
    answer: "The storage limit depends on your subscription plan. Free users have a limited storage capacity, while paid subscribers enjoy more generous limits. Check our pricing page for specific details."
  },
  {
    question: "Can I collaborate with others on JujuAGI?",
    answer: "Yes, JujuAGI supports collaboration. You can share projects and documents with team members, assign tasks, and work together in real-time."
  },
  {
    question: "What AI-powered features does JujuAGI offer?",
    answer: "JujuAGI incorporates AI in various tools, such as smart image editing, text summarization, and content generation. We're continually expanding our AI capabilities to enhance user productivity."
  },
  {
    question: "How do I get started with JujuAGI?",
    answer: "Getting started is easy! Simply sign up for an account on our website, choose your plan, and you'll have immediate access to our suite of tools. We also offer tutorials and guides to help you make the most of JujuAGI."
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">Find answers to common questions about JujuAGI</p>
      </div>

      <Card className="mb-12 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Search FAQs</CardTitle>
          <CardDescription>Type your question or keywords to find relevant answers</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="e.g., How do I upload files?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredFaqs.map((faq, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground mt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <Card className="mt-8 shadow-sm">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No FAQs found matching your search. Try different keywords or browse all questions.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}