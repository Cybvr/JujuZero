import React, { useState } from 'react'
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

const defaultContent: MarketingKitContent = {
  brandOverview: '',
  targetAudience: '',
  keyMessages: [],
  marketingChannels: [],
};

export default function MarketingKit({ content = defaultContent, onChange }: MarketingKitProps) {
  const [newMessage, setNewMessage] = useState('')
  const [newChannel, setNewChannel] = useState<MarketingChannel>({ name: '', description: '' })

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
    const updatedMessages = content.keyMessages?.filter((_, i) => i !== index) || []
    onChange({ ...content, keyMessages: updatedMessages })
  }

  const handleAddChannel = () => {
    if (newChannel.name.trim() && newChannel.description.trim()) {
      onChange({ ...content, marketingChannels: [...(content.marketingChannels || []), newChannel] })
      setNewChannel({ name: '', description: '' })
    }
  }

  const handleRemoveChannel = (index: number) => {
    const updatedChannels = content.marketingChannels?.filter((_, i) => i !== index) || []
    onChange({ ...content, marketingChannels: updatedChannels })
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Marketing Kit</h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white text-primary border-primary"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" /> Download Kit
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download this marketing kit</TooltipContent>
          </Tooltip>
        </div>

        <Tabs defaultValue="brand" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="brand">Brand Overview</TabsTrigger>
            <TabsTrigger value="audience">Target Audience</TabsTrigger>
            <TabsTrigger value="messages">Key Messages</TabsTrigger>
            <TabsTrigger value="channels">Marketing Channels</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <Card>
              <CardHeader>
                <CardTitle>Brand Overview</CardTitle>
                <CardDescription>Summarize your brand's essence and values</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter your brand overview here..."
                  value={content.brandOverview}
                  onChange={(e) => onChange({ ...content, brandOverview: e.target.value })}
                  rows={6}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience">
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>Describe your ideal customer or audience</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Describe your target audience here..."
                  value={content.targetAudience}
                  onChange={(e) => onChange({ ...content, targetAudience: e.target.value })}
                  rows={6}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Key Messages</CardTitle>
                <CardDescription>List your brand's core messages or value propositions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.keyMessages?.map((message, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input value={message} readOnly />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveMessage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="New key message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button onClick={handleAddMessage}>
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Channels</CardTitle>
                <CardDescription>List and describe your primary marketing channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.marketingChannels?.map((channel, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="flex-grow space-y-2">
                        <Input value={channel.name} readOnly />
                        <Textarea value={channel.description} readOnly rows={2} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveChannel(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Input 
                      placeholder="Channel name"
                      value={newChannel.name}
                      onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    />
                    <Textarea 
                      placeholder="Channel description"
                      value={newChannel.description}
                      onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                      rows={2}
                    />
                    <Button onClick={handleAddChannel}>
                      <Plus className="h-4 w-4 mr-2" /> Add Channel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}