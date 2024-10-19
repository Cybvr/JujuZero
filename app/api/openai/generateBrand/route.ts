// File: /app/api/openai/generateBrand.ts

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Use "gpt-3.5-turbo" if "gpt-4" is not available
      messages: [
        { role: "system", content: "You are an expert brand strategist and designer. Generate a comprehensive brand profile based on the given name and description, including SEO insights and social media posts." },
        { role: "user", content: `Create a full brand profile for a brand named "${name}" with the following description: "${description}". The profile should include brand strategy, visual identity, brand voice, social media posts, and SEO insights.` }
      ],
      functions: [
        {
          name: "generate_brand_profile",
          description: "Generate a comprehensive brand profile",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              tagline: { type: "string" },
              brandStrategy: {
                type: "object",
                properties: {
                  mission: { type: "string" },
                  vision: { type: "string" },
                  targetAudience: { type: "string" },
                  positioning: { type: "string" },
                },
              },
              visualIdentity: {
                type: "object",
                properties: {
                  logoDescription: { type: "string" },
                  colorPalette: { type: "array", items: { type: "string" } },
                  typography: {
                    type: "object",
                    properties: {
                      primary: { type: "string" },
                      secondary: { type: "string" },
                    },
                  },
                },
              },
              brandVoice: {
                type: "object",
                properties: {
                  toneOfVoice: { type: "string" },
                  keyMessages: { type: "array", items: { type: "string" } },
                },
              },
              socialMedia: {
                type: "object",
                properties: {
                  posts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        platform: { type: "string" },
                        post: { type: "string" },
                        hashtags: { type: "array", items: { type: "string" } },
                        cta: { type: "string" },
                      },
                    },
                  },
                },
              },
              seoInsights: {
                type: "object",
                properties: {
                  keywords: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        keyword: { type: "string" },
                        volume: { type: "number" },
                        difficulty: { type: "string" },
                      },
                    },
                  },
                  metaDescription: { type: "string" },
                },
              },
            },
            required: ["name", "tagline", "brandStrategy", "visualIdentity", "brandVoice", "socialMedia", "seoInsights"],
          },
        },
      ],
      function_call: { name: "generate_brand_profile" },
    });

    const functionCallResult = completion.choices[0].message?.function_call?.arguments;
    if (!functionCallResult) {
      return NextResponse.json({ error: "Failed to generate brand profile" }, { status: 500 });
    }

    const parsedResult = JSON.parse(functionCallResult);
    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
