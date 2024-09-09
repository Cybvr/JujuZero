"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const features = [
  "Access to all tools",
  "10 GB storage",
  "Priority email support",
  "Access to documents"
]

const freeTier = {
  title: "Free",
  price: "$0/mo",
  description: "For casual users",
  features: [
    "Access to 4 tools",
    "1 GB storage",
    "Community support",
    "No access to documents"
  ],
  isCurrent: true
}

const paidTiers = {
  monthly: {
    title: "Pro",
    price: "$15.00/mo",
    description: "Billed monthly",
    discountedPrice: "$30.00",
    features: features
  },
  annual: {
    title: "Pro",
    price: "$6.00/mo",
    description: "Billed annually",
    discountedPrice: "$12.00",
    savings: "Save 60%",
    features: features
  }
}

export default function Component() {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const renderPricingCard = (option, index) => (
    <Card key={index} className={`flex flex-col ${index === 1 ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle>{option.title}</CardTitle>
        <CardDescription>{option.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="text-3xl font-bold mb-2">{option.price}</div>
        {option.discountedPrice && (
          <div className="text-sm text-muted-foreground mb-4">
            <span className="line-through">{option.discountedPrice}</span>
            {option.savings && (
              <span className="text-green-500 ml-2">{option.savings}</span>
            )}
          </div>
        )}
        <ul className="space-y-2 mb-6 flex-grow">
          {option.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center">
              {feature.startsWith("No ") ? (
                <X className="h-5 w-5 text-destructive mr-2" />
              ) : (
                <Check className="h-5 w-5 text-primary mr-2" />
              )}
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={index === 1 ? "default" : "secondary"}
          onClick={() => option.isCurrent ? null : router.push('/signup')}
          disabled={option.isCurrent}
        >
          {option.isCurrent ? "Current Plan" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 text-center bg-background">
      <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
      <p className="text-md text-muted-foreground mb-6">Select the perfect plan for your needs</p>
      <Tabs defaultValue="monthly" onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'annual')}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 mx-auto">
          <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
          <TabsTrigger value="annual">Annual Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {renderPricingCard(freeTier, 0)}
            {renderPricingCard(paidTiers.monthly, 1)}
          </div>
        </TabsContent>
        <TabsContent value="annual" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {renderPricingCard(freeTier, 0)}
            {renderPricingCard(paidTiers.annual, 1)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}