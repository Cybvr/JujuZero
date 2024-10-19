// app/api/analyze-sentiment/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { texts } = await request.json();
    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const sentiments = await Promise.all(texts.map(async (text) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: "You are a sentiment analysis assistant. Provide a sentiment score between -1 (very negative) and 1 (very positive) for the given text." },
          { role: "user", content: `Analyze the sentiment of this text: "${text}"` }
        ],
      });
      const sentimentScore = parseFloat(completion.choices[0].message?.content || "0");
      return isNaN(sentimentScore) ? 0 : sentimentScore;
    }));

    const averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

    return NextResponse.json({ sentiments, averageSentiment });
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    return NextResponse.json({ error: "Sentiment analysis failed" }, { status: 500 });
  }
}