import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Plus, Trash2 } from "lucide-react"

interface MarketingChannel {
  name: string;
  description: string;
}

interface MarketingKitContent {
  brandOverview: string;
  targetAudience: string;
  keyMessages: string[];
  marketingChannels: MarketingChannel[];
}

interface MarketingKitProps {
  content: MarketingKitContent;
  onChange: (newContent: MarketingKitContent) => void;
}

export default function MarketingCopyAsset({ content, onChange }: MarketingKitProps) {
  const [newMessage, setNewMessage] = useState('')
  const [newChannel, setNewChannel] = useState<MarketingChannel>({ name: '', description: '' })

  useEffect(() => {
    // Initialize content if it's undefined
    if (!content) {
      onChange({
        brandOverview: '',
        targetAudience: '',
        keyMessages: [],
        marketingChannels: []
      });
    }
  }, [content, onChange]);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = 'marketing_kit.json'
    link.href = window.URL.createObjectURL(blob)
    link.click()
  }

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      onChange({ ...content, keyMessages: [...(content.keyMessages || []), newMessage.trim()] })
      setNewMessage('')
    }
  }

  const handleRemoveMessage = (index: number) => {
    const updatedMessages = (content.keyMessages || []).filter((_, i) => i !== index)
    onChange({ ...content, keyMessages: updatedMessages })
  }

  const handleAddChannel = () => {
    if (newChannel.name.trim() && newChannel.description.trim()) {
      onChange({ ...content, marketingChannels: [...(content.marketingChannels || []), newChannel] })
      setNewChannel({ name: '', description: '' })
    }
  }

  const handleRemoveChannel = (index: number) => {
    const updatedChannels = (content.marketingChannels || []).filter((_, i) => i !== index)
    onChange({ ...content, marketingChannels: updatedChannels })
  }

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Marketing Copy</CardTitle>
        <CardDescription>
          Develop your brand's voice and messaging strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="brand-overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="brand-overview">Brand Overview</TabsTrigger>
            <TabsTrigger value="target-audience">Target Audience</TabsTrigger>
          </TabsList>
          <TabsContent value="brand-overview">
            <Textarea
              value={content.brandOverview}
              onChange={(e) => onChange({ ...content, brandOverview: e.target.value })}
              placeholder="Enter your brand overview..."
              className="min-h-[200px]"
            />
          </TabsContent>
          <TabsContent value="target-audience">
            <Textarea
              value={content.targetAudience}
              onChange={(e) => onChange({ ...content, targetAudience: e.target.value })}
              placeholder="Describe your target audience..."
              className="min-h-[200px]"
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Key Messages</h3>
          <div className="space-y-2">
            {(content.keyMessages || []).map((message, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={message} readOnly className="flex-grow" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveMessage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="New key message"
              className="flex-grow"
            />
            <Button onClick={handleAddMessage}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Marketing Channels</h3>
          <div className="space-y-4">
            {(content.marketingChannels || []).map((channel, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-semibold">{channel.name}</h4>
                      <p className="text-sm text-gray-500">{channel.description}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveChannel(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove channel</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-2 mt-4">
            <Input
              value={newChannel.name}
              onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
              placeholder="Channel name"
            />
            <Textarea
              value={newChannel.description}
              onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
              placeholder="Channel description"
            />
            <Button onClick={handleAddChannel}>
              <Plus className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Marketing Kit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}