const nodemailer = require('nodemailer');
const config = require('../config/env');

let transporter = null;

const isEmailConfigured = () => {
  return Boolean(
    config.EMAIL_USER &&
    config.EMAIL_APP_PASSWORD &&
    config.CONTACT_RECEIVER
  );
};

const getTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }

  // Always sanitize credentials (remove spaces from app password, trim email)
  const user = config.EMAIL_USER.trim();
  const pass = config.EMAIL_APP_PASSWORD.replace(/\s+/g, '');

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
    });
  }

  return transporter;
};

/**
 * Send contact enquiry notifications:
 * 1. To company admin (CONTACT_RECEIVER) with client's email as reply-to.
 * 2. To client confirmation with CONTACT_RECEIVER as reply-to.
 */
const sendContactEmails = async (enquiry) => {
  if (!isEmailConfigured()) {
    console.warn('[Email Notice] Email credentials not configured in .env. Enquiry saved without email delivery.');
    return { status: 'not_configured', message: 'Email service is not configured in .env' };
  }

  const transport = getTransporter();
  if (!transport) {
    return { status: 'not_configured', message: 'Email transporter unavailable' };
  }

  const user = config.EMAIL_USER.trim();
  const receiver = config.CONTACT_RECEIVER.trim();

  try {
    // 1. Prepare Admin Notification Email
    const adminMailOptions = {
      from: `"NexaTech Enquiries" <${user}>`,
      to: receiver,
      replyTo: enquiry.email,
      subject: `[New Consultation Enquiry] ${enquiry.subject || 'Website Inquiry'} — from ${enquiry.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #070b14; color: #e2e8f0; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="color: #38bdf8; border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-top: 0; font-size: 20px;">
            New Lead / Project Inquiry Received
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 140px;">Client Name:</td><td style="color: #f8fafc; font-weight: bold;">${enquiry.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Client Email:</td><td><a href="mailto:${enquiry.email}" style="color: #38bdf8;">${enquiry.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Service Category:</td><td style="color: #f8fafc;">${enquiry.selectedService || 'General Inquiry'}</td></tr>
            ${enquiry.budget ? `<tr><td style="padding: 8px 0; color: #94a3b8;">Budget Range:</td><td style="color: #10b981; font-weight: bold;">${enquiry.budget}</td></tr>` : ''}
            ${enquiry.timeline ? `<tr><td style="padding: 8px 0; color: #94a3b8;">Timeline:</td><td style="color: #f8fafc;">${enquiry.timeline}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #94a3b8;">Subject:</td><td style="color: #f8fafc;">${enquiry.subject}</td></tr>
          </table>
          <div style="background: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold;">Project Details & Specifications:</p>
            <p style="margin: 0; white-space: pre-wrap; color: #f1f5f9; font-size: 14px; line-height: 1.5;">${enquiry.message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 11px; color: #64748b; font-family: monospace;">
            Origin: NexaTech Web Portal • Timestamp: ${new Date().toISOString()} • IP: ${enquiry.ip || 'unknown'}
          </p>
        </div>
      `,
    };

    // Send to admin first
    console.log(`[Email] Sending enquiry notification to receiver: ${receiver}...`);
    const adminInfo = await transport.sendMail(adminMailOptions);
    console.log(`[Email Success] Admin notification delivered. MessageId: ${adminInfo.messageId}`);

    // 2. Prepare and Send Client Confirmation (Best-effort; client email typo should not break admin email)
    if (enquiry.email && enquiry.email.includes('@')) {
      try {
        const clientMailOptions = {
          from: `"NexaTech Solutions" <${user}>`,
          to: enquiry.email,
          replyTo: receiver,
          subject: `Confirmation: We received your enquiry — NexaTech`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #070b14; color: #e2e8f0; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
              <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px;">Thank You for Reaching Out to NexaTech</h2>
              <p style="font-size: 14px; line-height: 1.5;">Hi ${enquiry.name},</p>
              <p style="font-size: 14px; line-height: 1.5;">We have successfully received your inquiry regarding <strong>"${enquiry.subject}"</strong>. Our engineering and project architecture team is reviewing your requirements and will get back to you within 24 business hours.</p>
              <div style="background: #0f172a; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #1e293b;">
                <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">Summary of your message:</p>
                <p style="margin: 0; font-style: italic; color: #cbd5e1; font-size: 13px;">"${enquiry.message}"</p>
              </div>
              <p style="font-size: 14px; line-height: 1.5;">Best regards,<br/><strong style="color: #38bdf8;">The NexaTech Engineering Team</strong></p>
            </div>
          `,
        };
        await transport.sendMail(clientMailOptions);
        console.log(`[Email Success] Confirmation sent to client: ${enquiry.email}`);
      } catch (clientErr) {
        console.warn(`[Email Notice] Client auto-reply failed (enquiry was still received by admin):`, clientErr.message);
      }
    }

    return { status: 'sent', message: 'Enquiry notification sent successfully to receiver inbox' };
  } catch (error) {
    console.error('[Email SMTP Error Details]:', error.message);
    if (error.code === 'EAUTH') {
      console.error('[Email Diagnostics] Google rejected the username/app password (535-5.7.8 BadCredentials). Check that 2-Step Verification is active and the 16-character App Password is newly generated.');
      return {
        status: 'failed',
        message: 'Gmail authentication failed. Generate a new 16-character Gmail App Password and update EMAIL_APP_PASSWORD.',
      };
    }
    return { status: 'failed', message: error.message };
  }
};

module.exports = {
  isEmailConfigured,
  sendContactEmails,
};
