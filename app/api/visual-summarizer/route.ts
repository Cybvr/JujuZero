import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractTextFromPDF(file: Buffer): Promise<string> {
  try {
    const data = await pdfParse(file);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string;
    const file = formData.get('file') as File;
    let inputText = text;

    console.log('Form data received:', { text, file });

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      inputText = await extractTextFromPDF(buffer);
      console.log('Extracted text from PDF:', inputText);
    }

    console.log('Input text for summarization:', inputText);

    if (!inputText) {
      throw new Error("No input text provided for summarization.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert at summarizing text and creating interactive dashboard-like summaries. Convert the given text into a structured summary that can be easily rendered as React components in a dashboard layout."
        },
        {
          role: "user",
          content: `Summarize the following text and provide a structure for an interactive dashboard representation. The structure should be in JSON format with an array of components. Each component should have a 'type' (header, paragraph, list, barChart, pieChart, or metric) and 'content'. For charts, provide the data in the format required by the chart type. For metrics, provide a label and a value.
          Text to summarize:
          ${inputText}
          Respond only with the JSON structure.`
        }
      ],
    });

    console.log('OpenAI completion response:', JSON.stringify(completion, null, 2));

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("No choices returned from OpenAI.");
    }

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No content returned from OpenAI.");
    }

    const summaryStructure = JSON.parse(aiResponse);
    if (!Array.isArray(summaryStructure)) {
      throw new Error("Invalid structure returned from OpenAI. Expected an array.");
    }

    console.log('Parsed summary structure:', summaryStructure);

    return NextResponse.json({ components: summaryStructure });
  } catch (error) {
    console.error("Error in visual summarization:", error);
    // Ensure we always return a JSON response, even for errors
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}