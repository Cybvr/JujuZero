"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import ContactForm from '@/components/ui/ContactForm';

const faqItems = [
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
    answer: "JujuAGI offers a flexible pricing plan with a monthly subscription of $10. Payments are processed securely through Flutterwave."
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
    answer: "The maximum file size varies depending on the tool you&apos;re using. Generally, we support files up to 100MB, but please check the specific tool&apos;s instructions for exact limits."
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
];

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline text-left hover:bg-muted px-4 rounded-t"
      >
        {question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="overflow-hidden text-sm bg-muted/50 px-4 py-2 rounded-b">
          <div className="pb-4 pt-0">{answer}</div>
        </div>
      )}
    </div>
  );
};

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Support</h1>
      <p className="text-muted-foreground mb-6">We&apos;re here to help you with any questions or concerns.</p>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary" />
              <span>Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <p>Email: <a href="mailto:info@visual.ng" className="text-primary hover:underline">info@visual.ng</a></p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <p>Phone: <a href="tel:+2348097153197" className="text-primary hover:underline">+234 809 715 3197</a></p>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <p>Address: Plot 1 block, Marwa busstop, 128 Remi Olowude St, Lekki Phase I, Lekki 105102, Lagos</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Our support team is available Monday to Friday, 9am to 5pm WAT. 
              We aim to respond to all inquiries within 24 hours.
            </p>
            <ContactForm />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}