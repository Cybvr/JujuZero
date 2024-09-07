"use client";
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is JujuAGI?",
    answer: "JujuAGI is an all-in-one AI-powered platform that offers a variety of tools to help businesses and individuals streamline their workflows, automate tasks, and boost productivity."
  },
  {
    question: "How secure is my data with JujuAGI?",
    answer: "We take data security very seriously. All data is encrypted in transit and at rest. We use industry-standard security protocols and regularly undergo security audits. Your data is automatically deleted after processing unless you choose to save it."
  },
  {
    question: "Can I use JujuAGI for free?",
    answer: "Yes, JujuAGI offers a range of free tools that you can use without signing up. However, some advanced features and tools require a paid subscription."
  },
  {
    question: "How often are new tools added?",
    answer: "We're constantly working on new tools and features. On average, we aim to release new tools or significant updates monthly. Keep an eye on our 'What's New' section for the latest additions!"
  },
  {
    question: "Is there a limit to how many files I can process?",
    answer: "Free users have a daily limit on file processing. Premium users enjoy higher or unlimited processing capabilities depending on their subscription tier. Check our pricing page for detailed information on limits for each plan."
  }
];

export const ToolsFaqSection = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};