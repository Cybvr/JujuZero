import { NextResponse } from 'next/server';

interface AnalysisResult {
  wordCount: number;
  uniqueWords: number;
  topWords: { word: string; count: number }[];
  sentenceCount: number;
  avgWordsPerSentence: number;
}

const analyzeText = (text: string): AnalysisResult => {
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 3);
  const wordCount = words.length;
  const uniqueWords = new Set(words).size;
  const wordFrequency: { [key: string]: number } = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const topWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const avgWordsPerSentence = wordCount / sentenceCount;

  return { wordCount, uniqueWords, topWords, sentenceCount, avgWordsPerSentence };
};

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No input text provided for analysis." }, { status: 400 });
    }

    const analysis = analyzeText(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in visual summarization:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}