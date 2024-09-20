import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Juju?",
    answer: "JujuA is a web-based platform offering a suite of file conversion and editing tools, as well as branding and marketing project management. Our services include PDF tools, image editing, text tools, data conversion, AI-powered tools, and project management for branding and marketing campaigns.",
  },
  {
    question: "What are the main features and benefits of Juju?",
    answer: "Juju offers speed, security, time-saving, versatility, AI-powered tools, and regular updates. You can quickly process files and generate marketing content, with encrypted and securely stored files and projects. It's an all-in-one platform for various file types and marketing needs.",
  },
  {
    question: "How do I get started with Juju?",
    answer: "To get started, sign up or log in to access the dashboard. From there, you can view all your projects, create new ones, or manage existing projects. Each project can include brand guidelines, marketing copy, and landing page sections.",
  },
  {
    question: "What tools are available on Juju?",
    answer: "Juju offers a wide range of tools including PDF converters, image editors, text tools, data conversion tools, AI-powered tools like resume writing and text summarization, and an AI-powered Branding and Marketing Project Creator.",
  },
  {
    question: "What are the pricing options for Juju?",
    answer: "Juju offers flexible pricing plans: a monthly subscription at $15, an annual subscription at $6/month (billed annually), and a free tier with limited features. Payments are processed securely through our payment gateway.",
  },
  {
    question: "What are the system requirements for using Juju?",
    answer: "Juju is a web-based platform, so you only need a web browser (Chrome, Firefox, Safari, or Edge) and a stable internet connection. No additional software is required.",
  },
  {
    question: "How does Juju handle privacy and security?",
    answer: "At Juju, we prioritize the security of your data. All file transfers and project data are encrypted. Files are only stored temporarily during processing, and projects are securely stored for easy access. We conduct regular security audits to ensure compliance with industry standards.",
  },
  {
    question: "Can I use Juju for multiple projects or clients?",
    answer: "Yes, Juju supports multiple projects and clients. You can create separate workspaces for each project or client to keep your work organized. The dashboard allows you to easily manage and switch between different projects.",
  },
  {
    question: "How does the AI work in creating brand guidelines?",
    answer: "Our AI analyzes your existing brand assets, preferences, and industry trends to generate comprehensive brand guidelines tailored to your business. It uses this information to create initial project data, which you can then customize and refine.",
  },
  {
    question: "What kind of support is available for Juju users?",
    answer: "We offer multiple support channels for Juju users. You can reach us via email at info@visual.ng, visit our Help Center for FAQs and troubleshooting guides, or use our live chat support available during business hours.",
  },
]

export default function ToolsFaqSection() {
  return (
    <section className="w-full py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-accent">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-2 text-4xl font-bold text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-8">
          Get quick answers to common questions about Juju.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg text-body">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-body text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}