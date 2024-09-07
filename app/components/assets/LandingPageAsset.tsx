"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Download, Code, Eye, Copy, Check } from "lucide-react"

const landingPageContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BloomBox - Premium Flower Subscription</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #f4f4f4;
            color: #333;
        }

        header {
            background: url('https://images.unsplash.com/photo-1578929775615-d0e4c72a0f55') center/cover no-repeat;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
            padding: 0 20px;
            position: relative;
            overflow: hidden;
        }

        .header-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin: 0;
            font-weight: 700;
            text-transform: uppercase;
        }

        .hero-content p {
            font-size: 1.4rem;
            margin: 20px 0;
            max-width: 600px;
            line-height: 1.6;
        }

        .cta-button {
            background-color: #ff6584;
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 30px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: background 0.3s;
            text-decoration: none;
            margin-top: 20px;
        }

        .cta-button:hover {
            background-color: #e0516d;
        }

        .features,
        .testimonials,
        .plans {
            padding: 80px 20px;
            text-align: center;
        }

        .features h2,
        .testimonials h2,
        .plans h2 {
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: #ff6584;
        }

        .feature-grid,
        .plan-grid,
        .testimonial-grid {
            display: grid;
            gap: 30px;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            margin-top: 30px;
        }

        .feature-item,
        .plan-item,
        .testimonial-item {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }

        .feature-item:hover,
        .plan-item:hover,
        .testimonial-item:hover {
            transform: translateY(-10px);
        }

        .feature-item img {
            width: 60px;
            margin-bottom: 20px;
        }

        .plan-item h3 {
            font-size: 1.8rem;
            margin: 20px 0;
        }

        .plan-item p {
            color: #666;
            margin-bottom: 15px;
        }

        .plan-item .plan-price {
            font-size: 2rem;
            color: #ff6584;
            margin: 20px 0;
        }

        .footer {
            background-color: #333;
            color: #fff;
            text-align: center;
            padding: 30px;
        }

        .footer p {
            margin: 0;
        }

        .subscribe-btn {
            background-color: #ff6584;
            color: #fff;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
            text-decoration: none;
        }

        .subscribe-btn:hover {
            background-color: #e0516d;
        }
    </style>
</head>

<body>

    <!-- Header / Hero Section -->
    <header>
        <div class="header-overlay"></div>
        <div class="hero-content">
            <h1>BloomBox</h1>
            <p>Premium flower subscription service delivering curated, seasonal bouquets right to your door.</p>
            <a href="#subscribe" class="cta-button">Get Started</a>
        </div>
    </header>

    <!-- Features Section -->
    <section class="features">
        <h2>Why Choose BloomBox?</h2>
        <div class="feature-grid">
            <div class="feature-item">
                <img src="https://img.icons8.com/ios-filled/50/ff6584/flower.png" alt="Fresh Flowers">
                <h3>Fresh & Seasonal</h3>
                <p>Enjoy hand-picked, seasonal flowers curated by our expert florists.</p>
            </div>
            <div class="feature-item">
                <img src="https://img.icons8.com/ios-filled/50/ff6584/calendar.png" alt="Flexible Delivery">
                <h3>Flexible Delivery</h3>
                <p>Choose a delivery schedule that suits your lifestyle.</p>
            </div>
            <div class="feature-item">
                <img src="https://img.icons8.com/ios-filled/50/ff6584/wallet.png" alt="Affordable Plans">
                <h3>Affordable Plans</h3>
                <p>High-quality bouquets at a price that won't break the bank.</p>
            </div>
        </div>
    </section>

    <!-- Subscription Plans Section -->
    <section class="plans" id="subscribe">
        <h2>Subscription Plans</h2>
        <div class="plan-grid">
            <div class="plan-item">
                <h3>Monthly</h3>
                <p>Perfect for flower lovers.</p>
                <p class="plan-price">£29.99</p>
                <a href="#" class="subscribe-btn">Subscribe Now</a>
            </div>
            <div class="plan-item">
                <h3>Bi-Weekly</h3>
                <p>Keep your home always blooming.</p>
                <p class="plan-price">£54.99</p>
                <a href="#" class="subscribe-btn">Subscribe Now</a>
            </div>
            <div class="plan-item">
                <h3>Weekly</h3>
                <p>For the ultimate flower enthusiast.</p>
                <p class="plan-price">£99.99</p>
                <a href="#" class="subscribe-btn">Subscribe Now</a>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
        <h2>What Our Customers Say</h2>
        <div class="testimonial-grid">
            <div class="testimonial-item">
                <p>"BloomBox has transformed my home! The flowers are always fresh and beautifully arranged."</p>
                <h4>- Sarah L.</h4>
            </div>
            <div class="testimonial-item">
                <p>"I love the flexibility and the quality of the blooms. Highly recommend BloomBox!"</p>
                <h4>- Michael K.</h4>
            </div>
            <div class="testimonial-item">
                <p>"Receiving my BloomBox delivery is the highlight of my week. Gorgeous flowers every time."</p>
                <h4>- Emma W.</h4>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; 2024 BloomBox. All rights reserved.</p>
    </footer>

</body>

</html>`

export default function LandingPageAsset() {
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    const blob = new Blob([landingPageContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bloombox-landing-page.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(landingPageContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Landing Page</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="bg-background text-foreground border-input" onClick={handleDownload}>
                <Download className="mr-2 h-3 w-3" /> Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download this landing page</TooltipContent>
          </Tooltip>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="mr-2 h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-md p-4 bg-background">
              <iframe
                srcDoc={landingPageContent}
                title="Landing Page Preview"
                className="w-full h-[500px] border-0"
                sandbox="allow-scripts"
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <pre className="p-4 rounded-md overflow-x-auto bg-muted">
                <code>{landingPageContent}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-background"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}