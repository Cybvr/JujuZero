import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function scrapeWebsite(url: string) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract text content
    const bodyText = $('body').text().trim().slice(0, 2000); // Limit to first 2000 characters

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    // Extract headings
    const headings = $('h1, h2, h3').map((i, el) => $(el).text()).get().join(' | ');

    return {
      text: bodyText,
      metaDescription,
      headings
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website');
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      throw new Error('URL is required');
    }

    console.log('Received URL:', url);

    const scrapedData = await scrapeWebsite(url);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are a brand expert that analyzes website content and extracts key brand elements. Provide insightful and specific information about the brand based on the content. Always respond in valid JSON format." },
        { role: "user", content: `Analyze the following website data and provide brand-related insights:

          URL: ${url}
          Meta Description: ${scrapedData.metaDescription}
          Headings: ${scrapedData.headings}
          Body Content: ${scrapedData.text}

          Based on this content, provide brand-related insights. Be creative and extract any relevant information about the brand, its offerings, its audience, or its market position. Don't limit yourself to specific categories, but provide any insights that seem relevant and valuable.

          Respond in JSON format with key-value pairs for each insight you identify.` 
        }
      ],
    });

    let brandInsights;
    try {
      brandInsights = JSON.parse(completion.choices[0].message?.content || '{}');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', completion.choices[0].message?.content);
      brandInsights = {
        error: "Unable to analyze brand information"
      };
    }

    console.log('Brand insights:', brandInsights);

    return NextResponse.json(brandInsights);
  } catch (error) {
    console.error("Detailed error in brand analysis:", error);
    return NextResponse.json({ error: error.message || "Brand analysis failed" }, { status: 500 });
  }
}