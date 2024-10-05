// components/dashboard/VisualSummarizer.tsx
"use client"
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Download, Copy } from 'lucide-react';
import Toolbar from '../../../components/dashboard/toolbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import html2canvas from 'html2canvas';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { getUserCredits, deductCredits } from '@/lib/credits';
import Feedback from "@/components/ui/Feedback";
import SamplePrompts from "@/components/ui/SamplePrompts";

const ANALYSIS_COST = 25;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AnalysisResult {
  wordCount: number;
  uniqueWords: number;
  topWords: { word: string; count: number }[];
  sentenceCount: number;
  avgWordsPerSentence: number;
}

export default function VisualSummarizer() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  React.useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const credits = await getUserCredits(user.uid);
        setUserCredits(credits);
      }
    }
    fetchCredits();
  }, [user]);

  const handleSummarize = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (userCredits === null || userCredits < ANALYSIS_COST) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${ANALYSIS_COST} credits to analyze text. Please add more credits.`,
        variant: "destructive",
      });
      return;
    }

    if (!input) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await deductCredits(user.uid, ANALYSIS_COST);
      setUserCredits(prevCredits => prevCredits !== null ? Math.max(prevCredits - ANALYSIS_COST, 0) : null);

      const response = await fetch('/api/visual-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Error",
        description: "Failed to analyze text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsImage = async () => {
    if (!resultsRef.current) {
      toast({
        title: "Error",
        description: "No results to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = await html2canvas(resultsRef.current);
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'visual_summary.png';
      link.click();

      toast({
        title: "Success",
        description: "Exported as PNG",
        variant: "default",
      });
    } catch (error) {
      console.error('Error during export:', error);
      toast({
        title: "Error",
        description: "Failed to export as PNG. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    const textSummary = `
      Top Words: ${analysis.topWords.map(w => `${w.word}: ${w.count}`).join(', ')}
    `;
    navigator.clipboard.writeText(textSummary);
    toast({
      title: "Copied",
      description: "Text analysis copied to clipboard!",
      variant: "default",
    });
  };

  // Generating a natural text summary based on themes
  const generateTextSummary = () => {
    if (!analysis) return "";

    const mostFrequentWords = analysis.topWords.map(w => w.word).join(', ');
    const topicSuggestion = mostFrequentWords ? `It seems to focus on concepts like "${mostFrequentWords}".` : "However, it doesn't strongly focus on any particular theme.";

    return `From the input provided, the text appears to focus on key themes and ideas, particularly centered around the concepts of ${mostFrequentWords}. Take a look at the visual breakdown to dive deeper into the main themes and understand the structure better.`;
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">Visual Summarizer</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Analyze text and generate interactive visual summaries.</p>

        {/* Sample Prompts */}
        <SamplePrompts onSelectPrompt={setInput} />

        <Card className="bg-card shadow-md rounded-lg overflow-hidden mb-4">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your text here for analysis"
                  className="min-h-[200px] mb-4"
                />
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={handleSummarize} disabled={isLoading}>
                  {isLoading ? 'Analyzing...' : `Analyze Text (${ANALYSIS_COST} credits)`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card className="bg-card shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-4 sm:p-6" ref={resultsRef}>
              <div>
                {/* Story-like summary */}
                <h2 className="text-lg font-semibold mb-4">Text Analysis Summary</h2>
                <p>{generateTextSummary()}</p>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysis.topWords}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="word" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.topWords}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ word, percent }) => `${word} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analysis.topWords.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Export and Copy buttons moved to results section */}
              <div className="flex space-x-4 mt-6">
                <Button onClick={exportAsImage} variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export as PNG
                </Button>
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="mr-2 h-4 w-4" /> Copy
                                    to Clipboard
                                  </Button>
                                </div>

                                {/* Thumbs up/down feedback */}
                                <Feedback feedback={feedback} onFeedback={setFeedback} />
                              </CardContent>
                            </Card>
                          )}
                        </div>
                        <div className="w-full lg:w-auto">
                          <Toolbar />
                        </div>
                        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
                      </div>
                    );
                  }
