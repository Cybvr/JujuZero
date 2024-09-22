"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Download } from 'lucide-react';
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
import jsPDF from 'jspdf';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const analyzeText = (text) => {
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 3);
  const wordCount = words.length;
  const uniqueWords = new Set(words).size;
  const wordFrequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const topWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const avgWordsPerSentence = wordCount / sentenceCount;

  return { wordCount, uniqueWords, topWords, sentenceCount, avgWordsPerSentence };
};

export default function VisualSummarizer() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { toast } = useToast();
  const resultsRef = useRef(null);

  const handleSummarize = async () => {
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
      const result = analyzeText(input);
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

  const exportAs = async (type) => {
    if (!resultsRef.current) return;

    const canvas = await html2canvas(resultsRef.current);
    const imageData = canvas.toDataURL('image/png');

    if (type === 'pdf') {
      const pdf = new jsPDF();
      pdf.addImage(imageData, 'PNG', 0, 0);
      pdf.save('visual_summary.pdf');
    } else if (type === 'jpg') {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'visual_summary.jpg';
      link.click();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-xl sm:text-xl font-bold mb-2">Visual Summarizer</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6">Analyze text and generate interactive visual summaries</p>

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
                  {isLoading ? 'Analyzing...' : 'Analyze Text'}
                </Button>
                {analysis && (
                  <div className="flex space-x-2">
                    <Button onClick={() => exportAs('pdf')} variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Export as PDF
                    </Button>
                    <Button onClick={() => exportAs('jpg')} variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Export as JPG
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card className="bg-card shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-4 sm:p-6" ref={resultsRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Word Statistics</h3>
                  <p>Total Words: {analysis.wordCount}</p>
                  <p>Unique Words: {analysis.uniqueWords}</p>
                  <p>Sentences: {analysis.sentenceCount}</p>
                  <p>Avg. Words per Sentence: {analysis.avgWordsPerSentence.toFixed(2)}</p>
                </div>

                <div className="h-64">
                  <h3 className="text-lg font-semibold mb-2">Top 10 Words</h3>
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

                <div className="h-64 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Word Distribution</h3>
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
            </CardContent>
          </Card>
        )}
      </div>
      <div className="w-full lg:w-auto">
        <Toolbar />
      </div>
    </div>
  );
}