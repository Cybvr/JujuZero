import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    const response = await openai.images.generate({
      prompt: description,
      n: 1,
      size: "512x512", // Size of the logo
      response_format: "url",
    });

    const url = response.data[0]?.url; // Assuming the API response holds the URL

    return NextResponse.json({ url });

  } catch (error) {
    console.error("Error in logo generation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}