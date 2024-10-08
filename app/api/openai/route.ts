// File: /app/api/openai/route.ts

import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates comprehensive brand strategy and identity data for marketing projects." },
        { role: "user", content: `Generate a complete brand project based on the following information:\nProject name: ${name}\nDescription: ${description}` }
      ],
      functions: [
        {
          name: "generate_project_data",
          description: "Generate comprehensive project data based on the project name and description",
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
                required: ["mission", "vision", "targetAudience", "positioning"]
              },
              visualIdentity: {
                type: "object",
                properties: {
                  logo: { type: "string", description: "A description of the logo" },
                  colorPalette: { type: "array", items: { type: "string" } },
                  typography: {
                    type: "object",
                    properties: {
                      primary: { type: "string" },
                      secondary: { type: "string" },
                    },
                    required: ["primary", "secondary"]
                  },
                },
                required: ["logo", "colorPalette", "typography"]
              },
              brandVoice: {
                type: "object",
                properties: {
                  toneOfVoice: { type: "string" },
                  keyMessages: { type: "array", items: { type: "string" } },
                },
                required: ["toneOfVoice", "keyMessages"]
              },
              design: {
                type: "object",
                properties: {
                  templates: { type: "array", items: { type: "string" }, description: "Descriptions of design templates" },
                },
                required: ["templates"]
              },
              socialMedia: {
                type: "object",
                properties: {
                  scheduledPosts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        content: { type: "string" },
                        scheduledDate: { type: "string", format: "date-time" },
                        platform: { type: "string" },
                      },
                      required: ["content", "scheduledDate", "platform"]
                    }
                  },
                },
                required: ["scheduledPosts"]
              },
              analytics: {
                type: "object",
                properties: {
                  weeklyEngagement: { type: "number" },
                  websiteTraffic: { type: "number" },
                },
                required: ["weeklyEngagement", "websiteTraffic"]
              },
            },
            required: ["name", "tagline", "brandStrategy", "visualIdentity", "brandVoice", "design", "socialMedia", "analytics"],
          },
        },
      ],
      function_call: { name: "generate_project_data" },
    });

    const functionCallResult = completion.choices[0].message?.function_call?.arguments;
    if (!functionCallResult) {
      return NextResponse.json({ error: "Failed to generate project data" }, { status: 500 });
    }

    const parsedResult = JSON.parse(functionCallResult);
    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}