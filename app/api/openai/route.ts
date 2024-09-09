import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  const { messages } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",  // Updated to use the latest model
      messages: messages,
    });
    return NextResponse.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error("Detailed OpenAI API error:", error);
    return NextResponse.json({ error: error.message || "Failed to get AI response" }, { status: 500 });
  }
}