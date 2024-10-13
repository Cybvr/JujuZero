import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia', // Updated to the new API version
});

export async function GET(req: Request) {
  try {
    const { user } = await req.json();

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ hasPaymentMethod: false });
    }

    const customerResponse = await stripe.customers.retrieve(user.stripeCustomerId);

    // Type guard to check if the customer is not deleted
    if ((customerResponse as Stripe.DeletedCustomer).deleted) {
      return NextResponse.json({ hasPaymentMethod: false });
    }

    const customer = customerResponse as Stripe.Customer;
    const hasPaymentMethod = !!customer.invoice_settings.default_payment_method;

    return NextResponse.json({ hasPaymentMethod });
  } catch (error) {
    console.error('Error checking payment method:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
