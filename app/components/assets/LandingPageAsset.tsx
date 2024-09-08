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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bloom Box - Premium Flower Subscription Service</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 1rem;
        }
        nav {
            display: flex;
            justify-content: center;
            background-color: #45a049;
            padding: 0.5rem;
        }
        nav a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
        }
        .hero {
            background-color: #66bb6a;
            color: white;
            text-align: center;
            padding: 2rem;
        }
        .cta-button {
            background-color: white;
            color: #4CAF50;
            border: none;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
        .section {
            padding: 2rem;
            text-align: center;
        }
        .features {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        .feature {
            flex-basis: 30%;
            margin: 1rem;
        }
        .pricing {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        .plan {
            border: 1px solid #ddd;
            padding: 1rem;
            margin: 1rem;
            flex-basis: 30%;
        }
        footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 1rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>Bloom Box</h1>
        <p>Premium flower subscription service</p>
    </header>
    <nav>
        <a href="#how-it-works">How It Works</a>
        <a href="#pricing">Pricing</a>
        <a href="#about">About Us</a>
    </nav>
    <div class="hero">
        <h2>Bring Nature's Beauty to Your Doorstep</h2>
        <p>Curated, seasonal bouquets delivered to your home</p>
        <button class="cta-button">Subscribe Now</button>
    </div>
    <div id="how-it-works" class="section">
        <h2>How It Works</h2>
        <div class="features">
            <div class="feature">
                <h3>Choose Your Plan</h3>
                <p>Select a subscription that fits your floral needs.</p>
            </div>
            <div class="feature">
                <h3>We Curate & Deliver</h3>
                <p>Our experts handpick seasonal blooms for you.</p>
            </div>
            <div class="feature">
                <h3>Enjoy Your Blooms</h3>
                <p>Revel in the beauty of fresh flowers in your home.</p>
            </div>
        </div>
    </div>
    <div id="pricing" class="section">
        <h2>Choose Your Bloom Box</h2>
        <div class="pricing">
            <div class="plan">
                <h3>Petite Posy</h3>
                <p>$39/month</p>
                <ul>
                    <li>Monthly delivery</li>
                    <li>Small seasonal bouquet</li>
                    <li>Perfect for small spaces</li>
                </ul>
                <button class="cta-button">Choose Plan</button>
            </div>
            <div class="plan">
                <h3>Bountiful Bouquet</h3>
                <p>$69/month</p>
                <ul>
                    <li>Bi-weekly delivery</li>
                    <li>Medium seasonal bouquet</li>
                    <li>Ideal for flower enthusiasts</li>
                </ul>
                <button class="cta-button">Choose Plan</button>
            </div>
            <div class="plan">
                <h3>Luxe Collection</h3>
                <p>$99/month</p>
                <ul>
                    <li>Weekly delivery</li>
                    <li>Large premium bouquet</li>
                    <li>Perfect for homes & offices</li>
                </ul>
                <button class="cta-button">Choose Plan</button>
            </div>
        </div>
    </div>
    <div id="about" class="section">
        <h2>About Bloom Box</h2>
        <p>At Bloom Box, we're passionate about bringing the beauty of nature into your home. Our team of expert florists curate seasonal bouquets that capture the essence of each time of year, delivering joy and freshness straight to your doorstep.</p>
    </div>
    <footer>
        <p>&copy; 2023 Bloom Box. All rights reserved.</p>
    </footer>
</body>
</html>`

interface LandingPageAssetProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function Component({ content, onChange }: LandingPageAssetProps) {
  const [activeTab, setActiveTab] = useState('preview')
  const [copied, setCopied] = useState(false)
  const [localContent, setLocalContent] = useState(content || landingPageContent)

  const handleDownload = () => {
    const blob = new Blob([localContent], { type: 'text/html' })
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
    navigator.clipboard.writeText(localContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
    onChange(newContent)
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Bloom Box Landing Page</h2>
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
                srcDoc={localContent}
                title="Landing Page Preview"
                className="w-full h-[600px] border-0"
                sandbox="allow-scripts"
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <textarea
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-[600px] p-4 font-mono text-sm bg-muted rounded-md"
              />
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