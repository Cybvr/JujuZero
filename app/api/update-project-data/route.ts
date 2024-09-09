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
      functions: [
        {
          name: "update_project_data",
          description: "Update project data based on the conversation",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              brandGuidelines: {
                type: "object",
                properties: {
                  colors: { type: "array", items: { type: "string" } },
                  logos: { type: "array", items: { type: "string" } },
                  typography: { type: "array", items: { type: "string" } },
                  brandValues: { type: "array", items: { type: "string" } },
                  tagline: { type: "string" },
                  missionStatement: { type: "string" },
                },
              },
              marketingCopy: {
                type: "object",
                properties: {
                  brandOverview: { type: "string" },
                  targetAudience: { type: "string" },
                  keyMessages: { type: "array", items: { type: "string" } },
                  marketingChannels: { type: "array", items: { type: "object" } },
                },
              },
              landingPage: { type: "string" },
            },
            required: ["name", "description"],
          },
        },
      ],
      function_call: { name: "update_project_data" },
    });

    const functionCallResult = JSON.parse(completion.choices[0].message.function_call.arguments);
    return NextResponse.json(functionCallResult);
  } catch (error) {
    console.error("Error updating project data:", error);
    return NextResponse.json({ error: "Failed to update project data" }, { status: 500 });
  }
}