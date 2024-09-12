import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ToolsFaqSection from "@/components/website/ToolsFaqSection";
import { CTASection } from "@/components/website/CTASection";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, UserCircle2, Crown } from 'lucide-react';

const tools = [
  { name: 'QRCode Generator', description: 'Create custom QR codes', path: '/dashboard/tools/qr-code-generator', imageSrc: '/images/tools/1.png', access: 'free' },
  { name: 'Remove Background', description: 'Remove image backgrounds', path: '/dashboard/tools/remove-background', imageSrc: '/images/tools/2.png', access: 'free' },
  { name: 'Compress Image', description: 'Compress images to save space', path: '/dashboard/tools/compress-image', imageSrc: '/images/tools/3.png', access: 'free' },
  { name: 'Video to MP4', description: 'Convert videos to MP4 format', path: '/dashboard/tools/video-to-mp4', imageSrc: '/images/tools/video-to-mp4.png', access: 'free' },
];

const MarketingLandingPage: React.FC = () => {
  return (
    <>
      <header className="text-center py-20 bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800">
        <h1 className="h1 mb-2">Simply Charming</h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">Transform Your Work with JujuAGI - No Fuss, All Magic</p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          Get Started Now
        </Button>
      </header>

      <section className="text-center mb-16 py-8">
        <p className="text-body font-semibold text-gray-600">Trusted by 20,000+ Innovators, Entrepreneurs, and Forward-Thinking Companies</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="h2 mb-6 text-center">Powerful Tools at Your Fingertips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card key={tool.path} className="hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <img src={tool.imageSrc} alt={tool.name} className="w-full h-40 object-cover" />
                <Badge 
                  variant={tool.access === 'free' ? "secondary" : tool.access === 'signin' ? "default" : "destructive"}
                  className="absolute top-2 right-2 p-1"
                >
                  {tool.access === 'free' ? <Zap size={16} /> : tool.access === 'signin' ? <UserCircle2 size={16} /> : <Crown size={16} />}
                </Badge>
              </div>
              <CardHeader className="p-3">
                <CardTitle className="text-base">{tool.name}</CardTitle>
                <p className="text-small text-gray-600">{tool.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <ToolsFaqSection />
      <CTASection />
    </>
  );
};

export default MarketingLandingPage;