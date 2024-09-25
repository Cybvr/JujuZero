import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2, Layers, Zap, Palette } from "lucide-react"

const features = [
  { icon: Wand2, title: "Advanced Tools", description: "Access a wide range of cutting-edge tools to enhance your digital workflow." },
  { icon: Layers, title: "All-in-One Platform", description: "From image editing to file conversion, find all the tools you need in one place." },
  { icon: Zap, title: "Efficiency Boost", description: "Streamline your work process and increase productivity with our intuitive toolkit." },
  { icon: Palette, title: "Creative Freedom", description: "Unleash your creativity with our versatile set of design and editing tools." },
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/marketing/herobg.png" 
            alt="Juju Toolkit" 
            fill
            style={{ objectFit: 'cover' }}
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-white container mx-auto max-w-6xl px-4">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">Your All-in-One Digital Toolkit</h1>
          <p className="text-xl mb-8 max-w-2xl">Juju brings together powerful tools and intuitive design, revolutionizing how creators and professionals work with digital assets.</p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Explore Juju
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-16">Our Vision & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Vision</h3>
                <p className="text-lg">
                  We envision a world where digital creation and management are accessible to everyone, empowering users to bring their ideas to life without technological barriers.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Mission</h3>
                <p className="text-lg">
                  Our mission is to provide a comprehensive, user-friendly toolkit that combines advanced utilities with creative tools, enhancing productivity and innovation for individuals and businesses alike.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-16 text-foreground">Why Choose Juju?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card text-card-foreground">
                <CardContent className="p-6 flex items-start">
                  <feature.icon className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Amplify Your Digital Workflow?</h2>
          <p className="text-xl mb-8 max-w-2xl">Join creators, professionals, and businesses who are leveraging Juju's comprehensive toolkit to transform their digital processes.</p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}