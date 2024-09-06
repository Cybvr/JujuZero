// app/api/compress-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const quality = parseInt(formData.get('quality') as string);
    const format = formData.get('format') as string;
    const maxWidth = parseInt(formData.get('maxWidth') as string);

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let sharpImage = sharp(buffer);

    // Resize if maxWidth is provided
    if (maxWidth) {
      sharpImage = sharpImage.resize({ width: maxWidth, withoutEnlargement: true });
    }

    // Set format and quality
    if (format === 'jpeg') {
      sharpImage = sharpImage.jpeg({ quality });
    } else if (format === 'webp') {
      sharpImage = sharpImage.webp({ quality });
    } else {
      sharpImage = sharpImage.png({ quality });
    }

    const compressedBuffer = await sharpImage.toBuffer();
    const base64 = compressedBuffer.toString('base64');

    return NextResponse.json({ compressedImage: `data:image/${format};base64,${base64}` });
  } catch (error) {
    console.error('Error compressing image:', error);
    return NextResponse.json({ error: 'Failed to compress image' }, { status: 500 });
  }
}