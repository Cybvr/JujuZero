import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { name, description, generatedContent } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant that updates project data for branding and marketing projects." },
        { role: "user", content: `Update the project data based on the following information:\nProject name: ${name}\nDescription: ${description}\nCurrent generated content: ${generatedContent}` }
      ],
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
              marketingCopy: { type: "string" },
              landingPage: { type: "string" },
            },
            required: ["name", "description", "brandGuidelines", "marketingCopy", "landingPage"],
          },
        },
      ],
      function_call: { name: "update_project_data" },
    });

    const functionCallResult = completion.choices[0].message?.function_call?.arguments;
    if (!functionCallResult) {
      return NextResponse.json({ error: "Failed to update project data" }, { status: 500 });
    }

    const parsedResult = JSON.parse(functionCallResult);
    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Error updating project data:", error);
    return NextResponse.json({ error: "Failed to update project data" }, { status: 500 });
  }
}