// app/api/subscription/route.ts

import { NextResponse } from 'next/server';
import { pricingPlans } from 'app/lib/pricingPlans';

export async function GET(request: Request) {
  // Return the pricing plans
  return NextResponse.json(pricingPlans);
}

export async function POST(request: Request) {
  // Handle subscription creation/update logic here
  // This is just a placeholder, you'll need to implement the actual logic
  const body = await request.json();

  // Example: Create a subscription based on the selected plan
  // You would typically interact with Stripe or your payment processor here

  return NextResponse.json({ message: 'Subscription updated successfully' });
}