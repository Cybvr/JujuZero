// @app/api/check-payment-method/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Assuming you store the Stripe customer ID in the user's session or database
    const stripeCustomerId = session.user.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json({ hasPaymentMethod: false });
    }

    const customer = await stripe.customers.retrieve(stripeCustomerId);
    const hasPaymentMethod = customer.default_source !== null || (customer.sources?.data.length ?? 0) > 0;

    return NextResponse.json({ hasPaymentMethod });
  } catch (error) {
    console.error('Error checking payment method:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}