import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, style } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const styleInstructions = {
      standard: "Paraphrase the text in a standard way, maintaining the original tone and complexity.",
      formal: "Paraphrase the text in a more formal and professional tone.",
      simple: "Paraphrase the text using simpler language and shorter sentences.",
      creative: "Paraphrase the text in a more creative and engaging way, using vivid language and metaphors where appropriate."
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant that paraphrases text." },
        { role: "user", content: `Please paraphrase the following text. ${styleInstructions[style as keyof typeof styleInstructions]}\n\nText: "${text}"` }
      ],
    });

    const paraphrasedText = completion.choices[0].message?.content;

    if (!paraphrasedText) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ paraphrasedText });
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return NextResponse.json({ error: "Paraphrasing failed" }, { status: 500 });
  }
}