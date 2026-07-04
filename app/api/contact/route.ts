import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactFormData = {
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  message: string;
};

export async function POST(request: Request) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("[contact] POST /api/contact called at", new Date().toISOString());

  try {
    const body: ContactFormData = await request.json();
    const { prefix, firstName, lastName, email, mobile, message } = body;

    console.log("[contact] Form data received:");
    console.log("  name   :", `${prefix ?? ""} ${firstName} ${lastName}`.trim());
    console.log("  email  :", email);
    console.log("  mobile :", mobile || "(none)");
    console.log("  message:", message?.slice(0, 120), message?.length > 120 ? "…" : "");

    if (!firstName || !lastName || !email || !message) {
      console.warn("[contact] Validation failed — missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const smtpHost   = process.env.CONTACT_SMTP_HOST;
    const port       = Number(process.env.CONTACT_SMTP_PORT) || 587;
    const smtpUser   = process.env.CONTACT_SMTP_USER;
    const toEmail    = process.env.CONTACT_TO_EMAIL;

    console.log("[contact] SMTP config:");
    console.log("  host   :", smtpHost);
    console.log("  port   :", port);
    console.log("  secure :", port === 465);
    console.log("  user   :", smtpUser);
    console.log("  to     :", toEmail);
    console.log("  pass   :", process.env.CONTACT_SMTP_PASS ? `set (${process.env.CONTACT_SMTP_PASS.length} chars)` : "NOT SET");

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: port === 465,       // true = direct SSL (465); false = STARTTLS (587)
      requireTLS: port !== 465,   // force STARTTLS upgrade when using port 587
      auth: {
        user: smtpUser,
        pass: process.env.CONTACT_SMTP_PASS,
      },
    });

    console.log("[contact] Verifying SMTP connection...");
    try {
      await transporter.verify();
      console.log("[contact] ✅ SMTP connection verified");
    } catch (verifyErr) {
      console.error("[contact] ❌ SMTP verify failed:", verifyErr);
      // don't abort — sendMail may still work on some servers even if verify() fails
    }

    const subject = `Contact Inquiry from ${prefix ? prefix + " " : ""}${firstName} ${lastName}`;
    console.log("[contact] Sending email...");
    console.log("  from   :", `"HMS Contact Form" <${smtpUser}>`);
    console.log("  to     :", toEmail);
    console.log("  replyTo:", email);
    console.log("  subject:", subject);

    const info = await transporter.sendMail({
      from: `"HMS Contact Form" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #052E39; margin-bottom: 4px;">New Contact Form Submission</h2>
          <hr style="border: 1px solid #e5e7eb; margin-bottom: 20px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 12px; background: #f9f9f9; border-left: 4px solid #1F8593; font-weight: bold; width: 120px;">Name</td>
              <td style="padding: 10px 12px; background: #f9f9f9;">${prefix ? prefix + " " : ""}${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-left: 4px solid #1F8593; font-weight: bold;">Email</td>
              <td style="padding: 10px 12px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background: #f9f9f9; border-left: 4px solid #1F8593; font-weight: bold;">Phone</td>
              <td style="padding: 10px 12px; background: #f9f9f9;">${mobile || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-left: 4px solid #1F8593; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 10px 12px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <hr style="border: 1px solid #e5e7eb; margin-top: 20px;" />
          <p style="color: #9ca3af; font-size: 12px;">Sent from the HMS contact form</p>
        </div>
      `,
    });

    console.log("[contact] ✅ Email sent successfully");
    console.log("  messageId :", info.messageId);
    console.log("  accepted  :", info.accepted);
    console.log("  rejected  :", info.rejected);
    console.log("  response  :", info.response);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("[contact] ❌ Email failed:");
    console.error("  error    :", error);
    if (error instanceof Error) {
      console.error("  message  :", error.message);
      console.error("  stack    :", error.stack);
      // Nodemailer SMTP errors carry extra fields
      const smtpErr = error as Error & { code?: string; command?: string; response?: string; responseCode?: number };
      if (smtpErr.code)         console.error("  code     :", smtpErr.code);
      if (smtpErr.command)      console.error("  command  :", smtpErr.command);
      if (smtpErr.response)     console.error("  response :", smtpErr.response);
      if (smtpErr.responseCode) console.error("  respCode :", smtpErr.responseCode);
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
