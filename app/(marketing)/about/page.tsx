import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Users, Target, MessageSquare } from "lucide-react"

const features = [
  { icon: Zap, title: "Powerful Tools", description: "Cutting-edge file conversion and editing capabilities" },
  { icon: Users, title: "User-Centric", description: "Intuitive interface designed for all skill levels" },
  { icon: Target, title: "Precision", description: "Accurate results that meet your exact needs" },
  { icon: MessageSquare, title: "Support", description: "Dedicated team ready to assist you" },
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/marketing/herobg.png" 
            alt="Juju Hero" 
            fill
            style={{ objectFit: 'cover' }}
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-white container mx-auto max-w-6xl px-4">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">Reimagining File Management</h1>
          <p className="text-xl mb-8 max-w-2xl">Juju is pioneering the future of digital asset handling, making it effortless, intuitive, and powerful.</p>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="bg-white text-black hover:bg-white/90">
              Discover Juju
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
                  We envision a world where managing digital assets is seamless and intuitive, enabling users to focus on their creativity and productivity without technological barriers.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Mission</h3>
                <p className="text-lg">
                  Our mission is to provide an all-in-one solution that empowers users to convert, edit, and manage their files with unprecedented ease, enhancing productivity across all levels of expertise.
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
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl mb-8 max-w-2xl">Join thousands of satisfied users who have revolutionized their file management with Juju.</p>
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