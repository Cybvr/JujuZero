"use client"

import React, { useState } from 'react'
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

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const handleUpgrade = () => {
    // Implement your upgrade logic here
    console.log('Upgrade clicked')
  }

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
          onClick={handleUpgrade}
          disabled={option.isCurrent}
        >
          {option.isCurrent ? "Current Plan" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Pricing Plans</h1>
        <p className="text-xl text-muted-foreground">Choose the plan that fits your needs</p>
      </div>

      <Tabs value={billingPeriod} onValueChange={(value: 'monthly' | 'annual') => setBillingPeriod(value)} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="annual">Annual</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {renderPricingCard(freeTier, 0)}
        {renderPricingCard(paidTiers[billingPeriod], 1)}
      </div>
    </div>
  )
}