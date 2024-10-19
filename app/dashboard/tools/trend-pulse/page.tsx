// app/dashboard/tools/trend-pulse/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Toolbar from '@/components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { useToast } from "@/components/ui/use-toast";
import { deductCredits, getUserCredits } from '@/lib/credits';
import { Loader2, BarChart2, TrendingUp, MessageCircle } from 'lucide-react';

const TREND_PULSE_COST = 50;

interface RedditPost {
  data: {
    author: string;
    title: string;
    score: number;
  }
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  }
}

type Mention = {
  user: string;
  text: string;
};

interface SocialData {
  mentionsCount: number;
  topInfluencers: string[];
  recentMentions: Mention[];
  sentimentScore?: number;
  sentiments?: number[];
}

interface SentimentResponse {
  sentiments: number[];
  averageSentiment: number;
}

const fetchRedditData = async (keyword: string): Promise<SocialData> => {
  const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=100`;

  const response = await fetch(searchUrl);

  if (!response.ok) {
    throw new Error('Failed to fetch data from Reddit API');
  }

  const data: RedditResponse = await response.json();

  const mentionsCount = data.data.children.length;
  const topPosters = new Map<string, number>();
  const recentMentions: Mention[] = [];

  data.data.children.forEach((post: RedditPost) => {
    // Track top posters
    topPosters.set(post.data.author, (topPosters.get(post.data.author) || 0) + post.data.score);

    // Get recent mentions
    recentMentions.push({
      user: post.data.author,
      text: post.data.title
    } as Mention);
  });

  // Get top 3 posters
  const top3Posters = Array.from(topPosters.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);

  return {
    mentionsCount,
    topInfluencers: top3Posters,
    recentMentions: recentMentions.slice(0, 10) // Get top 10 mentions for sentiment analysis
  };
};

const analyzeSentiment = async (texts: string[]): Promise<SentimentResponse> => {
  const response = await fetch('/api/analyze-sentiment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  });

  if (!response.ok) {
    throw new Error('Sentiment analysis failed');
  }

  return await response.json();
};

export default function TrendPulse() {
  const [keyword, setKeyword] = useState<string>('');
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [userCredits, setUserCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      getUserCredits(user.uid).then(credits => setUserCredits(credits));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!keyword) {
      setError("Please enter a keyword.");
      return;
    }

    if (userCredits !== null && userCredits < TREND_PULSE_COST) {
      setError("Not enough credits. Please purchase more credits to use this tool.");
      return;
    }

    setLoading(true);
    setError('');
    setSocialData(null);

    try {
      // Deduct credits
      await deductCredits(user.uid, TREND_PULSE_COST);
      setUserCredits(prevCredits => prevCredits !== null ? prevCredits - TREND_PULSE_COST : null);

      // Fetch social data
      const redditData = await fetchRedditData(keyword);

      // Analyze sentiment
      const sentimentData = await analyzeSentiment(redditData.recentMentions.map(mention => mention.text));

      const fullSocialData: SocialData = {
        ...redditData,
        sentimentScore: sentimentData.averageSentiment,
        sentiments: sentimentData.sentiments
      };

      setSocialData(fullSocialData);

      toast({
        title: "Trend Pulse Analysis Complete",
        description: "Your trend analysis report is ready.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze trends";
      setError("An error occurred while analyzing trends: " + errorMessage);
      toast({
        title: "Error",
        description: "Failed to analyze trends. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-2xl font-bold mb-2">Trend Pulse</h1>
        <p className="text-muted-foreground mb-6">Monitor social trends and analyze online conversations with AI-powered sentiment analysis. Cost: {TREND_PULSE_COST} credits</p>
        {user && userCredits !== null && (
          <p className="text-sm text-muted-foreground mb-4">Your credits: {userCredits}</p>
        )}
        <Card className="bg-background shadow-md rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <Label htmlFor="keyword" className="block text-sm font-medium mb-2">
                Enter keyword or topic
              </Label>
              <Input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full mb-4"
                placeholder="e.g., AI tools"
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Analyze Trends
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {socialData && (
          <Card className="mt-6 bg-background shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Trend Analysis Report</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <MessageCircle className="mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mentions</p>
                    <p className="text-lg font-semibold">{socialData.mentionsCount}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BarChart2 className="mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sentiment Score</p>
                    <p className="text-lg font-semibold">{socialData.sentimentScore?.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Top Influencers</p>
                    <p className="text-lg font-semibold">{socialData.topInfluencers.join(', ')}</p>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recent Mentions with Sentiment</h3>
              <ul className="space-y-2">
                {socialData.recentMentions.map((mention, index) => (
                  <li key={index} className="bg-secondary p-2 rounded">
                    <p className="font-semibold">{mention.user}</p>
                    <p>{mention.text}</p>
                    <p className="text-sm text-muted-foreground">
                      Sentiment: {socialData.sentiments?.[index].toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
      <Toolbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}