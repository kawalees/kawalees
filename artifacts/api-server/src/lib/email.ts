const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "كواليس <noreply@kawalees.art>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log(`[Email] No RESEND_API_KEY set — skipping email to ${to}: ${subject}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Email] Failed to send email: ${err}`);
    }
  } catch (err) {
    console.error("[Email] Error sending email:", err);
  }
}

export function approvalEmailHtml(artistName: string): string {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #e5e5e5; border-radius: 12px;">
      <h1 style="color: #C8A96A; font-size: 28px; margin-bottom: 8px;">كواليس</h1>
      <h2 style="color: #ffffff; font-size: 22px; margin-top: 24px;">تمت الموافقة على ملفك المهني</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #d1d5db;">
        مرحباً ${artistName}،<br><br>
        يسعدنا إبلاغك بأن ملفك المهني على منصة <strong style="color: #C8A96A;">كواليس</strong> قد تمت مراجعته والموافقة عليه.
        أصبح ملفك الآن ظاهراً في الدليل المهني ويمكن لصناع المحتوى التواصل معك.
      </p>
      <a href="https://kawalees.art" style="display: inline-block; margin-top: 24px; padding: 12px 28px; background: #C8A96A; color: #0a0a0a; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        زيارة كواليس
      </a>
      <p style="margin-top: 32px; font-size: 13px; color: #6b7280;">
        فريق كواليس — المنصة الاحترافية لصناع الفن والمسرح
      </p>
    </div>
  `;
}

export function rejectionEmailHtml(artistName: string): string {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #e5e5e5; border-radius: 12px;">
      <h1 style="color: #C8A96A; font-size: 28px; margin-bottom: 8px;">كواليس</h1>
      <h2 style="color: #ffffff; font-size: 22px; margin-top: 24px;">بشأن طلب انضمامك</h2>
      <p style="font-size: 16px; line-height: 1.7; color: #d1d5db;">
        مرحباً ${artistName}،<br><br>
        شكراً لاهتمامك بالانضمام إلى منصة <strong style="color: #C8A96A;">كواليس</strong>.
        بعد مراجعة طلبك، لم نتمكن من قبوله في الوقت الحالي.
        يمكنك إعادة التقديم مستقبلاً مع تحديث معلوماتك وأعمالك.
      </p>
      <p style="margin-top: 32px; font-size: 13px; color: #6b7280;">
        فريق كواليس — المنصة الاحترافية لصناع الفن والمسرح
      </p>
    </div>
  `;
}
