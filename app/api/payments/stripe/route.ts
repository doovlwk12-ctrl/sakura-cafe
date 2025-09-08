import { NextRequest, NextResponse } from 'next/server';

// Only initialize Stripe if API key is available
let stripe: any = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const { amount, currency = 'SAR', customerEmail } = await request.json();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        source: 'sakura-cafe',
        customer_email: customerEmail,
      },
    });

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
