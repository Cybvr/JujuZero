// app/api/customer/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function GET() {
  try {
    const customers = await stripe.customers.list({ limit: 1 });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    const customer = customers.data[0];

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });
  } catch (err: any) {
    console.error('Error fetching customer:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}