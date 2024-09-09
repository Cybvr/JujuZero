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
        { role: "system", content: "You are a helpful assistant that generates project data for branding and marketing projects." },
        { role: "user", content: `Generate a complete project based on the following information:\nProject name: ${name}\nDescription: ${description}` }
      ],
      functions: [
        {
          name: "generate_project_data",
          description: "Generate project data based on the project name and description",
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