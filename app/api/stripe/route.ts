import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const { action } = body;

    if (action === 'create_checkout_session') {
      if (!process.env.STRIPE_PRICE_ID) {
        throw new Error('STRIPE_PRICE_ID is not set in environment variables');
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${request.headers.get('origin')}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}/dashboard/billing`,
      });

      return NextResponse.json({ sessionId: session.id });
    } else if (action === 'create_portal_session') {
      const customers = await stripe.customers.list({ limit: 1 });
      console.log('Customers:', customers);

      const customerId = customers.data[0]?.id;

      if (!customerId) {
        console.error('No customer found');
        return NextResponse.json({ error: 'No customer found' }, { status: 404 });
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${request.headers.get('origin')}/dashboard/billing`,
      });

      return NextResponse.json({ url: portalSession.url });
    }

    console.error('Invalid action:', action);
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Detailed error:', err);

    let errorMessage = err.message;
    if (err.type === 'StripeInvalidRequestError') {
      errorMessage = `Stripe API Error: ${err.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}