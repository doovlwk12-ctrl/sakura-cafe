import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, expiryDate, points } = body;

    console.log('📧 محاولة إرسال إيميل حقيقي...');
    console.log(`📬 إلى: ${userEmail}`);

    // استخدام خدمة Resend لإرسال إيميل حقيقي
    const emailContent = {
      from: 'Sakura Cafe <noreply@sakura-cafe.com>',
      to: [userEmail],
      subject: 'تنبيه: نقاطك على وشك الانتهاء - مقهى ساكورا',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f8b5c1, #e91e63); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🌸 مقهى ساكورا</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Sakura Cafe</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #e91e63; text-align: center; margin-top: 0;">تنبيه انتهاء النقاط</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              مرحباً عزيزي العميل،
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              نود أن ننبهك أن لديك <strong style="color: #e91e63; font-size: 18px;">${points} نقطة</strong> 
              ستنتهي صلاحيتها في <strong style="color: #e91e63;">${expiryDate}</strong>
            </p>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-right: 4px solid #e91e63; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #e91e63; margin-top: 0;">💡 نصيحة:</h3>
              <p style="margin: 0; color: #555;">استخدم نقاطك الآن للحصول على مكافآت رائعة أو منتجات مجانية!</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3001/account/rewards" 
                 style="background: linear-gradient(135deg, #f8b5c1, #e91e63); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;
                        box-shadow: 0 4px 8px rgba(233, 30, 99, 0.3);">
                استخدم نقاطك الآن
              </a>
            </div>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>ملاحظة:</strong> هذا إيميل تلقائي من نظام مقهى ساكورا. يرجى عدم الرد على هذا الإيميل.
              </p>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
              شكراً لاختيارك مقهى ساكورا 🌸<br>
              <small>هذا الإيميل تم إرساله في ${new Date().toLocaleString('ar-SA')}</small>
            </p>
          </div>
        </div>
      `
    };

    // محاولة إرسال إيميل حقيقي باستخدام Resend
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_fake_key'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailContent)
      });

      if (resendResponse.ok) {
        const resendResult = await resendResponse.json();
        console.log('✅ تم إرسال الإيميل الحقيقي بنجاح:', resendResult.id);
        
        return NextResponse.json({ 
          success: true, 
          message: 'تم إرسال الإيميل الحقيقي بنجاح',
          emailId: resendResult.id,
          sentTo: userEmail,
          realEmail: true,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('فشل في إرسال الإيميل الحقيقي');
      }
    } catch (resendError) {
      console.log('⚠️ فشل في إرسال الإيميل الحقيقي، استخدام المحاكاة:', resendError);
      
      // في حالة فشل الإرسال الحقيقي، نستخدم المحاكاة
      const emailRecord = {
        id: `simulated_email_${Date.now()}`,
        to: userEmail,
        subject: emailContent.subject,
        sentAt: new Date().toISOString(),
        status: 'simulated',
        type: 'points_expiry_notification',
        points: points,
        expiryDate: expiryDate
      };

      console.log('✅ تم إرسال الإيميل المحاكي بنجاح:', emailRecord.id);

      return NextResponse.json({ 
        success: true, 
        message: 'تم إرسال التنبيه (محاكاة)',
        emailId: emailRecord.id,
        sentTo: userEmail,
        realEmail: false,
        simulated: true,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('خطأ في إرسال الإيميل:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'حدث خطأ في إرسال التنبيه',
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
