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
    const { paymentData, amount } = await request.json();

    // Process Google Pay payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'sar',
      payment_method_data: {
        type: 'card',
        card: {
          token: paymentData.paymentMethodData.tokenizationData.token,
        },
      } as any,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    });

    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        transactionId: paymentIntent.id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Google Pay processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Google Pay processing failed' },
      { status: 500 }
    );
  }
}
