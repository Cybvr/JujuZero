import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ChevronRight, Palette, FileText, Layout } from 'lucide-react'
import dynamic from 'next/dynamic'
import ToolsFaqSection from "@/components/website/ToolsFaqSection"

const features = [
  { 
    name: 'Brand Guidelines', 
    description: 'Create comprehensive brand guidelines with ease. Our AI-powered tool helps you define your brand\'s visual identity, voice, and values.',
    image: '/images/marketing/feature1.png',
    icon: Palette
  },
  { 
    name: 'Marketing Copy', 
    description: 'Develop compelling marketing copy for various channels. Our AI assists in creating engaging content that resonates with your target audience.',
    image: '/images/marketing/feature2.png',
    icon: FileText
  },
  { 
    name: 'Landing Page', 
    description: 'Create stunning landing pages that convert. Our AI-powered tool helps you design and optimize high-converting landing pages.',
    image: '/images/marketing/feature3.png',
    icon: Layout
  },
]

const tools = [
  { name: 'QR Code Generator', description: 'Create custom QR codes', image: '/images/tools/1.png' },
  { name: 'Remove Background', description: 'Remove image backgrounds', image: '/images/tools/2.png' },
  { name: 'Compress Image', description: 'Compress images to save space', image: '/images/tools/3.png' },
  { name: 'Video to MP4', description: 'Convert videos to MP4 format', image: '/images/tools/video-to-mp4.png' },
]

const testimonials = [
  {
    content: "Juju has revolutionized our branding process. It's intuitive, powerful, and saves us countless hours.",
    name: "Alice Liu",
    role: "Content Creator",
    avatar: "/images/marketing/testimonial1.png"
  },
  {
    content: "As a startup, we needed efficient branding tools. Juju delivered beyond our expectations.",
    name: "Alejandra Rodriguez",
    role: "Startup Founder",
    avatar: "/images/marketing/testimonial2.png"
  },
  {
    content: "The AI-powered features in Juju have significantly enhanced my design workflow. Highly recommended!",
    name: "Kola Williams",
    role: "Freelance Designer",
    avatar: "/images/marketing/testimonial3.png"
  },
  {
    content: "Juju has transformed how we approach branding. It's an indispensable tool for our agency.",
    name: "Jennifer McFarland",
    role: "Creative Director",
    avatar: "/images/marketing/testimonial4.png"
  },
]

const LazyImage = dynamic(() => import('next/image'), { ssr: false })

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section className="relative w-full py-4 sm:py-24 lg:pt-20 lg:pb-36 px-4 sm:px-10 lg:px-20 bg-no-repeat bg-bottom bg-fill bg-fixed" style={{ backgroundImage: 'url(/images/marketing/tool.png)' }}>
          <div className="container mx-auto max-w-full sm:max-w-[80%] lg:max-w-[60%] text-center">
            <h1 className="mb-4 text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight">
              Meet your sidekick
            </h1>
            <p className="text-xl mb-6 text-muted-foreground px-4 sm:px-8 lg:px-24">
              The Ultimate Hub of Tools, Add-ons & Assets for Every Creator
            </p>
            <div className="flex justify-center">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Join for free</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-24 sm:py-24 px-4 sm:px-6 lg:px-8 bg-accent text-accent-foreground justify-center">
          <div className="container mx-auto max-w-full sm:max-w-[90%] lg:max-w-[80%] flex justify-center mb-8">
            <a href="https://www.producthunt.com/posts/juju?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-juju" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=490770&theme=light" 
                alt="Juju - Simple tools for everyday use | Product Hunt" 
                style={{ width: '250px', height: '54px' }} 
                width="250" 
                height="54" 
              />
            </a>
          </div>
          <div className="container mx-auto max-w-full sm:max-w-[90%] lg:max-w-[80%] text-center">
            <h2 className="mb-2 text-4xl font-bold">
              Smart Apps. High efficiency
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Tools to make your working easier
            </p>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-left">
              {tools.map((tool, index) => (
                <div key={index} className="flex flex-col items-start border-0 rounded-lg shadow-sm bg-card text-card-foreground p-4">
                  <LazyImage src={tool.image} alt={tool.name} width={200} height={160} className="w-full h-[160px] object-cover rounded-lg mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-left">{tool.name}</h3>
                  <p className="text-md text-muted-foreground text-left">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="container mx-auto max-w-full sm:max-w-[90%] lg:max-w-[80%] text-center bg-secondary p-8 sm:p-12 lg:p-16 rounded-lg">
            <h2 className="mb-2 text-4xl font-bold text-primary">How will Juju help you?</h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-start bg-accent p-8 rounded-lg text-left">
                <h3 className="text-xl font-semibold mb-2 text-primary">Time-saving</h3>
                <p className="text-md text-muted-foreground">
                  Juju is your time-saving ally, whether you're an entrepreneur, a YouTuber, or an Amazon seller. It automates copywriting, freeing you to tackle the bigger aspects of your work. Consider it our well-kept secret!
                </p>
              </div>
              <div className="flex flex-col items-start bg-accent p-8 rounded-lg text-left">
                <h3 className="text-xl font-semibold mb-2 text-primary">Cost-effective</h3>
                <p className="text-md text-muted-foreground">
                  Imagine Juju as your budget-friendly assistant for crafting high-quality, conversion-oriented content. It eliminates the need for costly agency fees, bringing expert-level copy creation to your fingertips.
                </p>
              </div>
              <div className="flex flex-col items-start bg-accent p-8 rounded-lg text-left">
                <h3 className="text-xl font-semibold mb-2 text-primary">Powered by AI</h3>
                <p className="text-md text-muted-foreground">
                  Juju's true enchantment lies in its AI-driven capabilities. What sets us apart is our ability to create personalized content that resonates perfectly with you and your audience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-full sm:max-w-[90%] lg:max-w-[80%]">
            <h2 className="mb-2 text-4xl font-bold text-center">Powerful Features for Your Brand</h2>
            <p className="text-xl text-primary-foreground/80 mb-8 text-center">
              Discover the tools that will elevate your brand to new heights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-card text-primary rounded-lg shadow-lg overflow-hidden">
                  <LazyImage src={feature.image} alt={feature.name} width={600} height={300} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <feature.icon className="w-10 h-6 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                    <p className="text-md text-primary/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-full sm:max-w-[90%] lg:max-w-[80%] bg-card text-card-foreground rounded-lg p-8 py-12 sm:py-24">
            <h2 className="text-center mb-2 text-4xl font-bold">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-8 sm:mb-16">
              Real stories from satisfied customers who've experienced the Juju difference.
            </p>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-accent text-accent-foreground p-4 rounded-lg">
                  <p className="text-md text-muted-foreground mb-4">{testimonial.content}</p>
                  <div className="flex items-center space-x-2">
                    <LazyImage src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full" />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-md text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ToolsFaqSection />

        <section className="w-full py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-full sm:max-w-[90%] lg:max-w-[80%]">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h2 className="mb-0 text-4xl font-bold">
                Content Creation at Superhuman Speed
              </h2>
              <p className="text-xl mb-6">
                Join thousands of innovators and entrepreneurs who are already using Juju to elevate their brands.
              </p>
              <Button className="bg-background text-foreground hover:bg-background/90 text-lg">
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