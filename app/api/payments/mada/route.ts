import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'SAR', customerEmail } = await request.json();

    // Mada payment integration
    // In a real implementation, you would integrate with Mada's API
    const madaResponse = await fetch('https://api.mada.com.sa/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MADA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        merchant_id: process.env.MADA_MERCHANT_ID,
        customer_email: customerEmail,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      }),
    });

    const result = await madaResponse.json();

    if (result.status === 'success') {
      return NextResponse.json({
        success: true,
        transactionId: result.transaction_id,
        redirectUrl: result.redirect_url,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message || 'Mada payment failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Mada payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
