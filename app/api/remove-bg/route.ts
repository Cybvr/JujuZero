// File: app/api/remove-bg/route.ts
import { NextRequest, NextResponse } from 'next/server';

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image_file') as File | null;

    if (!imageFile) {
      console.error('No image file found in the request');
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    console.log('Image file received:', imageFile.name, 'Size:', imageFile.size, 'bytes');

    const imageBuffer = await imageFile.arrayBuffer();

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      console.error('Image buffer is empty or invalid');
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    console.log('Sending request to remove.bg API...');
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: Buffer.from(imageBuffer).toString('base64'),
        size: 'auto',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Remove.bg API error:', errorData);
      throw new Error(`Failed to process image: ${errorData.errors[0].title}`);
    }

    console.log('Successfully received response from remove.bg API');
    const processedImageBuffer = await response.arrayBuffer();

    return new NextResponse(processedImageBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Detailed error in remove-bg API route:', error);
    return NextResponse.json({ error: 'Image processing failed', details: (error as Error).message }, { status: 500 });
  }
}