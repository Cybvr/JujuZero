import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { YoutubeTranscript } from 'youtube-transcript';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { video_url, option } = await request.json();

    // Extract video ID from URL
    const videoId = extractVideoId(video_url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Fetch transcript
    const transcript = await fetchTranscript(videoId);

    // Process the transcript based on the selected option
    const result = await processTranscript(transcript, option);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json({ error: 'Video processing failed' }, { status: 500 });
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    return transcriptItems.map(item => item.text).join(' ');
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    throw new Error('Failed to fetch transcript');
  }
}

async function processTranscript(transcript: string, option: string): Promise<string> {
  const instructions = {
    summary: "Provide a concise summary of the main points discussed in the video, capturing the key ideas and conclusions in about 3-5 paragraphs.",
    faq: "Generate a FAQ with 5 question-answer pairs based on the transcript.",
    studyGuide: "Create a study guide with 5-7 key points based on the transcript.",
    tableOfContents: "Generate a table of contents with 5-7 main sections and timestamps based on the transcript.",
    timeline: "Create a timeline of 5-7 key events with approximate timestamps based on the transcript.",
    briefingDoc: "Summarize the transcript into a brief document of 3-4 paragraphs."
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "You are a helpful assistant that analyzes video transcripts." },
      { role: "user", content: `${instructions[option as keyof typeof instructions]}\n\nTranscript: "${transcript}"` }
    ],
  });

  const result = completion.choices[0].message?.content;
  if (!result) {
    throw new Error('No response from OpenAI');
  }

  return result;
}