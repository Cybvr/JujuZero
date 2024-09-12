import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
// Simple rate limiting implementation
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;
const ipMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  if (!ipMap.has(ip)) {
    ipMap.set(ip, [now]);
    return false;
  }

  const requests = ipMap.get(ip)!.filter(time => time > windowStart);
  requests.push(now);
  ipMap.set(ip, requests);

  return requests.length > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Rest of your email sending logic here
  // ...

  return NextResponse.json({ message: 'Feedback sent successfully' });
}