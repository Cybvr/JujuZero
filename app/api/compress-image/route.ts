import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // This endpoint is no longer used for image compression
    // You can use it for logging or other purposes if needed
    return NextResponse.json({ message: 'Image compression is now handled client-side' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}