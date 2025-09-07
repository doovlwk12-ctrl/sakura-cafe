import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'SAR', customerEmail, paymentMethod } = await request.json();

    // Tap Payments API integration
    const tapResponse = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TAP_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        customer: {
          email: customerEmail,
        },
        source: {
          id: getSourceId(paymentMethod),
        },
        redirect: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        },
        post: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/tap/webhook`,
        },
        metadata: {
          source: 'sakura-cafe',
          payment_method: paymentMethod,
        },
      }),
    });

    const result = await tapResponse.json();

    if (result.status === 'INITIATED') {
      return NextResponse.json({
        success: true,
        transactionId: result.id,
        redirectUrl: result.transaction.url,
        paymentUrl: result.transaction.url,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message || 'Tap payment failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Tap payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// Helper function to get source ID based on payment method
function getSourceId(paymentMethod: string): string {
  const sourceMap: { [key: string]: string } = {
    'mada': 'src_mada',
    'visa': 'src_visa',
    'mastercard': 'src_mastercard',
    'samsung_wallet': 'src_samsung_pay',
    'apple_pay': 'src_apple_pay',
    'google_pay': 'src_google_pay',
  };
  
  return sourceMap[paymentMethod] || 'src_all';
}
