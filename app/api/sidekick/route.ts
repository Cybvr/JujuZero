import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message, profession, focusArea, experience } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: `You are an AI assistant acting as a professional coach for a ${experience} ${profession} focusing on ${focusArea}. Provide advice, answer questions, and offer insights related to this profession, experience level, and focus area.` },
        { role: "user", content: message }
      ],
    });

    const aiMessage = completion.choices[0].message.content;

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}