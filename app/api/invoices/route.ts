// app/api/invoices/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function GET() {
  try {
    const invoices = await stripe.invoices.list({ limit: 10 });

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount_due / 100,
      status: invoice.status,
      date: new Date(invoice.created * 1000).toLocaleDateString(),
      url: invoice.hosted_invoice_url,
    }));

    return NextResponse.json(formattedInvoices);
  } catch (err: any) {
    console.error('Error fetching invoices:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}