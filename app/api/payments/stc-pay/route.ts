import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'SAR', customerEmail, customerPhone } = await request.json();

    // MyFatoorah API integration for STC Pay
    const myfatoorahResponse = await fetch('https://apitest.myfatoorah.com/v2/SendPayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MYFATOORAH_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        InvoiceAmount: amount,
        CurrencyIso: currency,
        CustomerName: 'عميل مقهى ساكورا',
        CustomerEmail: customerEmail,
        CustomerMobile: customerPhone,
        DisplayCurrencyIso: currency,
        MobileCountryCode: '+966',
        CallBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        ErrorUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error`,
        Language: 'ar',
        CustomerReference: `sakura-cafe-${Date.now()}`,
        UserDefinedField: 'STC Pay Payment',
        ExpireDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        ApiCustomFileds: 'STC Pay',
        InvoiceItems: [
          {
            ItemName: 'طلب من مقهى ساكورا',
            Quantity: 1,
            UnitPrice: amount,
          }
        ],
        PaymentMethods: ['stcpay'], // STC Pay only
      }),
    });

    const result = await myfatoorahResponse.json();

    if (result.IsSuccess) {
      const stcPayUrl = result.Data.PaymentMethods.find(
        (method: any) => method.PaymentMethodEn === 'STC Pay'
      )?.PaymentMethodUrl;

      return NextResponse.json({
        success: true,
        transactionId: result.Data.InvoiceId,
        redirectUrl: stcPayUrl,
        paymentUrl: stcPayUrl,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.Message || 'STC Pay payment failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('STC Pay payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
