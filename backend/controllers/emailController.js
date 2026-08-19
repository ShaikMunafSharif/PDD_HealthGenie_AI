/**
 * HealthGenie Email Controller
 * 
 * Handles all email-related API requests with proper validation,
 * error handling, and secure response formatting.
 */

import {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendCustomEmail,
  sendNotificationEmail,
  verifyConnection,
  validateEmail
} from '../services/emailService.js';

// ─── Helper: Generate a 6-digit OTP ─────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── POST /api/email/send ────────────────────────────────────────────────────
/**
 * Send a custom email.
 * Body: { to, subject, html, recipientName? }
 */
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, html, recipientName } = req.body;

    // Validation
    if (!to) return res.status(400).json({ status: 'ERROR', message: 'Recipient email (to) is required.' });
    if (!subject) return res.status(400).json({ status: 'ERROR', message: 'Email subject is required.' });
    if (!html) return res.status(400).json({ status: 'ERROR', message: 'Email HTML body is required.' });

    const emailCheck = validateEmail(to);
    if (!emailCheck.valid) {
      return res.status(400).json({ status: 'ERROR', message: emailCheck.error });
    }

    const result = await sendCustomEmail(to, subject, html);

    if (result.success) {
      return res.json({
        status: 'OK',
        message: 'Email sent successfully.',
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({ status: 'ERROR', message: result.error });
    }
  } catch (err) {
    console.error('[EmailController] Error in sendEmail:', err.message);
    return res.status(500).json({ status: 'ERROR', message: 'Internal server error while sending email.' });
  }
};

// ─── POST /api/email/send-otp ────────────────────────────────────────────────
/**
 * Send an OTP verification email.
 * Body: { to, recipientName?, expiryMinutes? }
 * Returns: { otp } (so the caller can store/verify it)
 */
export const sendOTP = async (req, res) => {
  try {
    const { to, recipientName, expiryMinutes = 10 } = req.body;

    if (!to) return res.status(400).json({ status: 'ERROR', message: 'Recipient email (to) is required.' });

    const emailCheck = validateEmail(to);
    if (!emailCheck.valid) {
      return res.status(400).json({ status: 'ERROR', message: emailCheck.error });
    }

    const otp = generateOTP();
    const result = await sendOTPEmail(to, recipientName || 'User', otp, expiryMinutes);

    if (result.success) {
      return res.json({
        status: 'OK',
        message: 'OTP email sent successfully.',
        otp: otp, // Return OTP for backend verification (store in DB/session in production)
        expiryMinutes: expiryMinutes,
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({ status: 'ERROR', message: result.error });
    }
  } catch (err) {
    console.error('[EmailController] Error in sendOTP:', err.message);
    return res.status(500).json({ status: 'ERROR', message: 'Internal server error while sending OTP.' });
  }
};

// ─── POST /api/email/send-reset ──────────────────────────────────────────────
/**
 * Send a password reset email.
 * Body: { to, recipientName?, resetLink, expiryMinutes? }
 */
export const sendReset = async (req, res) => {
  try {
    const { to, recipientName, resetLink, expiryMinutes = 30 } = req.body;

    if (!to) return res.status(400).json({ status: 'ERROR', message: 'Recipient email (to) is required.' });
    if (!resetLink) return res.status(400).json({ status: 'ERROR', message: 'Password reset link is required.' });

    const emailCheck = validateEmail(to);
    if (!emailCheck.valid) {
      return res.status(400).json({ status: 'ERROR', message: emailCheck.error });
    }

    const result = await sendPasswordResetEmail(to, recipientName || 'User', resetLink, expiryMinutes);

    if (result.success) {
      return res.json({
        status: 'OK',
        message: 'Password reset email sent successfully.',
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({ status: 'ERROR', message: result.error });
    }
  } catch (err) {
    console.error('[EmailController] Error in sendReset:', err.message);
    return res.status(500).json({ status: 'ERROR', message: 'Internal server error while sending reset email.' });
  }
};

// ─── POST /api/email/send-welcome ────────────────────────────────────────────
/**
 * Send a welcome email to a new user.
 * Body: { to, recipientName? }
 */
export const sendWelcome = async (req, res) => {
  try {
    const { to, recipientName } = req.body;

    if (!to) return res.status(400).json({ status: 'ERROR', message: 'Recipient email (to) is required.' });

    const emailCheck = validateEmail(to);
    if (!emailCheck.valid) {
      return res.status(400).json({ status: 'ERROR', message: emailCheck.error });
    }

    const result = await sendWelcomeEmail(to, recipientName || 'Health Champion');

    if (result.success) {
      return res.json({
        status: 'OK',
        message: 'Welcome email sent successfully.',
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({ status: 'ERROR', message: result.error });
    }
  } catch (err) {
    console.error('[EmailController] Error in sendWelcome:', err.message);
    return res.status(500).json({ status: 'ERROR', message: 'Internal server error while sending welcome email.' });
  }
};

// ─── GET /api/email/verify ───────────────────────────────────────────────────
/**
 * Verify SMTP connection and credentials.
 */
export const verifySmtp = async (req, res) => {
  try {
    const result = await verifyConnection();

    if (result.success) {
      return res.json({
        status: 'OK',
        message: 'SMTP connection verified. Gmail is configured correctly.',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        encryption: 'STARTTLS'
      });
    } else {
      return res.status(500).json({
        status: 'ERROR',
        message: 'SMTP verification failed.',
        error: result.error,
        troubleshooting: [
          'Ensure GMAIL_USERNAME is set in .env',
          'Ensure GMAIL_APP_PASSWORD is a 16-character App Password (not your regular password)',
          'Enable 2-Step Verification on your Google Account',
          'Generate an App Password at https://myaccount.google.com/apppasswords'
        ]
      });
    }
  } catch (err) {
    console.error('[EmailController] Error in verifySmtp:', err.message);
    return res.status(500).json({ status: 'ERROR', message: err.message });
  }
};
