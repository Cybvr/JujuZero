import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant that checks grammar and improves writing."},
        {"role": "user", "content": `Please check and correct the grammar of the following text, and provide the corrected version: "${text}"`}
      ],
    });

    const correctedText = response.choices[0].message.content;

    return NextResponse.json({ correctedText });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Grammar check failed' }, { status: 500 });
  }
}