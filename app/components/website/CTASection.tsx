'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export const CTASection = () => {
  return (
    <section className="bg-blue-600 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Ready to get started?</h2>
        <p className="text-base mb-6 max-w-xl mx-auto">
          Join Juju today and streamline your work processes.
        </p>
        <Link href="/dashboard/register" passHref>
          <Button 
            variant="secondary" 
            size="default" 
            className="font-medium hover:bg-blue-100 transition duration-300"
          >
            Start now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}