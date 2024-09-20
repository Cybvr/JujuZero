import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Puzzle, Sparkles } from 'lucide-react'

const features = [
  { 
    name: 'AI-Powered Creativity', 
    description: 'Unlock your potential with cutting-edge AI tools designed to amplify your creative process.',
    icon: Sparkles
  },
  { 
    name: 'Seamless Workflow', 
    description: 'Experience a frictionless creative journey with our intuitive, integrated toolkit.',
    icon: Puzzle
  },
  { 
    name: 'Rapid Results', 
    description: 'Transform ideas into reality at lightning speed, boosting your productivity to new heights.',
    icon: Zap
  },
]

const testimonials = [
  {
    content: "Juju has become my secret weapon. It's like having a team of experts at my fingertips.",
    name: "Emma Chen",
    role: "Digital Artist",
    avatar: "/images/testimonials/emma.jpg"
  },
  {
    content: "The efficiency gains with Juju are mind-blowing. It's changed how we approach every project.",
    name: "Marcus Johnson",
    role: "Marketing Director",
    avatar: "/images/testimonials/marcus.jpg"
  },
]

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Empower Your</span>{' '}
                  <span className="block text-purple-600 xl:inline">Creative Journey</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Juju fuses AI innovation with intuitive design, revolutionizing how creators bring ideas to life.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10">
                      Get started
                      <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/images/hero-image.jpg"
            alt="Juju in action"
            width={1920}
            height={1080}
          />
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to create
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Juju brings together powerful tools and intuitive design to streamline your creative process.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Loved by creators worldwide</span>
            <span className="block text-purple-600">See what our users are saying</span>
          </h2>
          <div className="mt-16 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-lg text-gray-600">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="mt-4 flex items-center">
                    <Image className="h-10 w-10 rounded-full" src={testimonial.avatar} alt="" width={40} height={40} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-purple-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to elevate your creativity?</span>
            <span className="block">Start using Juju today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-purple-200">
            Join thousands of creators who are already using Juju to bring their ideas to life faster and more efficiently than ever before.
          </p>
          <Button className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 sm:w-auto">
            Get started for free
          </Button>
        </div>
      </section>
    </div>
  )
}