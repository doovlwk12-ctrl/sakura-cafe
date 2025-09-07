import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { validationURL } = await request.json();

    // Validate merchant session with Apple Pay
    const session = await stripe.applePayDomains.create({
      domain_name: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
    });

    // Create merchant session
    const merchantSession = await stripe.applePaySessions.create({
      domain_name: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
      display_name: 'مقهى ساكورا',
      merchant_identifier: process.env.APPLE_PAY_MERCHANT_ID!,
    });

    return NextResponse.json(merchantSession);
  } catch (error) {
    console.error('Apple Pay validation error:', error);
    return NextResponse.json(
      { error: 'Apple Pay validation failed' },
      { status: 500 }
    );
  }
}
