import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronRight, Star } from 'lucide-react'
import dynamic from 'next/dynamic'

const features = [
  { 
    name: 'Brand Guidelines', 
    description: 'Create comprehensive brand guidelines with ease. Our AI-powered tool helps you define your brand\'s visual identity, voice, and values.',
    image: '/images/marketing/juju1.png'
  },
  { 
    name: 'Marketing Copy', 
    description: 'Develop compelling marketing copy for various channels. Our AI assists in creating engaging content that resonates with your target audience.',
    image: '/images/marketing/juju2.png'
  },
  { 
    name: 'Project Management', 
    description: 'Efficiently manage your branding projects from start to finish. Our intuitive project management tools keep everything organized.',
    image: '/images/marketing/juju3.png'
  },
]

const tools = [
  { name: 'QRCode Generator', description: 'Create custom QR codes' },
  { name: 'Remove Background', description: 'Remove image backgrounds' },
  { name: 'Compress Image', description: 'Compress images to save space' },
  { name: 'Video to MP4', description: 'Convert videos to MP4 format' },
]

const testimonials = [
  {
    content: "JujuAGI has revolutionized our branding process. It's intuitive, powerful, and saves us countless hours.",
    name: "Alice Johnson",
    role: "Marketing Director",
  },
  {
    content: "As a startup, we needed efficient branding tools. JujuAGI delivered beyond our expectations.",
    name: "Bob Smith",
    role: "Startup Founder",
  },
  {
    content: "The AI-powered features in JujuAGI have significantly enhanced my design workflow. Highly recommended!",
    name: "Carol Williams",
    role: "Freelance Designer",
  },
]

const faqs = [
  {
    question: "What is JujuAGI?",
    answer: "JujuAGI is an AI-powered branding and marketing platform that helps businesses create, manage, and optimize their brand identity and marketing materials.",
  },
  {
    question: "How does the AI work in creating brand guidelines?",
    answer: "Our AI analyzes your existing brand assets, preferences, and industry trends to generate comprehensive brand guidelines tailored to your business.",
  },
  {
    question: "Can I use JujuAGI for multiple projects or clients?",
    answer: "Yes, JujuAGI supports multiple projects and clients. You can create separate workspaces for each project or client to keep your work organized.",
  },
]

const LazyImage = dynamic(() => import('next/image'), { ssr: false })

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground dark">
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Simply Charming
                  </h1>
                  <p className="max-w-[600px] text-xl">
                    Transform Your Work with JujuAGI - No Fuss, All Magic
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-background text-primary hover:bg-background/90">Get Started Now</Button>
                  <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Learn More</Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <LazyImage src="/images/marketing/juju4.png" alt="JujuAGI Hero" width={600} height={300} className="w-full h-[300px] object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Your Brand</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
              Discover the tools that will elevate your brand to new heights.
            </p>
            <div className="space-y-24">
              {features.map((feature, index) => (
                <div key={index} className={`grid gap-6 lg:grid-cols-2 lg:gap-12 ${index === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {index !== 1 && (
                    <div className="flex items-center justify-center">
                      <LazyImage src={feature.image} alt={feature.name} width={600} height={300} className="w-full h-[300px] object-cover rounded-lg" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center space-y-4">
                    <h3 className="text-2xl font-semibold">{feature.name}</h3>
                    <p className="text-muted-foreground text-lg">{feature.description}</p>
                  </div>
                  {index === 1 && (
                    <div className="flex items-center justify-center">
                      <LazyImage src={feature.image} alt={feature.name} width={600} height={300} className="w-full h-[300px] object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Tools at Your Fingertips
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
              Streamline your workflow with our versatile toolkit.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool, index) => (
                <Card key={index} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg">{tool.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Real stories from satisfied customers who've experienced the JujuAGI difference.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg">{testimonial.content}</p>
                    </CardContent>
                  </CardHeader>
                  <CardContent className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-muted-foreground text-base">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Get quick answers to common questions about JujuAGI.
            </p>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-xl">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground text-lg">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">
                  Ready to Transform Your Work?
                </h2>
                <p className="max-w-[600px] text-xl text-muted-foreground mx-auto">
                  Join thousands of innovators and entrepreneurs who are already using JujuAGI to elevate their brands.
                </p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}