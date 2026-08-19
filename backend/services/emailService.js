/**
 * HealthGenie Email Service
 * 
 * Reusable, production-grade email service using Gmail SMTP via Nodemailer.
 * Features: retry mechanism, validation, structured logging, and async handling.
 * 
 * All credentials are loaded exclusively from environment variables.
 */

import nodemailer from 'nodemailer';
import {
  otpTemplate,
  welcomeTemplate,
  passwordResetTemplate,
  notificationTemplate
} from '../templates/emailTemplates.js';

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds between retries
const SMTP_TIMEOUT_MS = 10000; // 10 second connection timeout

// ─── Email Address Validator ─────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates an email address format.
 * @param {string} email - The email to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email address cannot be empty.' };
  }
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email address is too long.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: `Invalid email format: "${trimmed}"` };
  }
  return { valid: true };
}

// ─── SMTP Transporter (Lazy Singleton) ───────────────────────────────────────
let transporter = null;

/**
 * Creates or returns the cached Nodemailer SMTP transporter.
 * @returns {nodemailer.Transporter}
 * @throws {Error} If GMAIL credentials are missing from env
 */
function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USERNAME;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      'Gmail SMTP credentials are not configured. ' +
      'Set GMAIL_USERNAME and GMAIL_APP_PASSWORD in your .env file.'
    );
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS (upgrades to TLS)
    auth: {
      user: user,
      pass: pass
    },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    tls: {
      rejectUnauthorized: true // Enforce valid TLS certificates
    }
  });

  console.log('[EmailService] ✅ Gmail SMTP transporter initialized.');
  return transporter;
}

// ─── Utility: Sleep for retry delays ─────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Core: Send Email with Retry ─────────────────────────────────────────────
/**
 * Sends an email with automatic retry on temporary failures.
 * @param {object} mailOptions - Nodemailer mail options (to, subject, html, etc.)
 * @param {number} retries - Number of retry attempts remaining
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
async function sendMailWithRetry(mailOptions, retries = MAX_RETRIES) {
  // Validate recipient email
  const validation = validateEmail(mailOptions.to);
  if (!validation.valid) {
    console.error(`[EmailService] ❌ Validation failed: ${validation.error}`);
    return { success: false, error: validation.error };
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const transport = getTransporter();

      // Set default "from" if not provided
      if (!mailOptions.from) {
        mailOptions.from = `"HealthGenie" <${process.env.GMAIL_USERNAME}>`;
      }

      const info = await transport.sendMail(mailOptions);

      console.log(
        `[EmailService] ✅ Email sent successfully on attempt ${attempt}. ` +
        `MessageID: ${info.messageId} | To: ${mailOptions.to}`
      );

      return { success: true, messageId: info.messageId };
    } catch (err) {
      const isTemporary = 
        err.code === 'ECONNECTION' ||
        err.code === 'ETIMEDOUT' ||
        err.code === 'ESOCKET' ||
        err.responseCode === 421 || // Service temporarily unavailable
        err.responseCode === 450;   // Mailbox unavailable (temporary)

      console.warn(
        `[EmailService] ⚠️ Attempt ${attempt}/${retries} failed: ${err.message}` +
        (isTemporary ? ' (temporary - will retry)' : ' (permanent - aborting)')
      );

      // If it's a permanent error (auth failure, invalid recipient), don't retry
      if (!isTemporary) {
        // Check for authentication failure specifically
        if (err.responseCode === 535 || err.code === 'EAUTH') {
          return {
            success: false,
            error: 'Gmail authentication failed. Verify your GMAIL_USERNAME and GMAIL_APP_PASSWORD in .env. ' +
                   'Make sure you are using a Gmail App Password, not your regular password.'
          };
        }
        return { success: false, error: err.message };
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        const delay = RETRY_DELAY_MS * attempt;
        console.log(`[EmailService] ⏳ Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  return { success: false, error: `Failed to send email after ${retries} attempts.` };
}

// ─── Public API: Send OTP Email ──────────────────────────────────────────────
/**
 * Sends an OTP verification email.
 * @param {string} to - Recipient email
 * @param {string} recipientName - Recipient's display name
 * @param {string} otp - The OTP code
 * @param {number} expiryMinutes - Expiry time in minutes
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendOTPEmail(to, recipientName, otp, expiryMinutes = 10) {
  console.log(`[EmailService] 📧 Sending OTP email to ${to}...`);
  return sendMailWithRetry({
    to,
    subject: `${otp} is your HealthGenie verification code`,
    html: otpTemplate(recipientName, otp, expiryMinutes)
  });
}

// ─── Public API: Send Welcome Email ──────────────────────────────────────────
/**
 * Sends a welcome email to a newly registered user.
 * @param {string} to - Recipient email
 * @param {string} recipientName - User's display name
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendWelcomeEmail(to, recipientName) {
  console.log(`[EmailService] 📧 Sending welcome email to ${to}...`);
  return sendMailWithRetry({
    to,
    subject: 'Welcome to HealthGenie! 🧬 Your Health Journey Starts Now',
    html: welcomeTemplate(recipientName)
  });
}

// ─── Public API: Send Password Reset Email ───────────────────────────────────
/**
 * Sends a password reset email with a secure link.
 * @param {string} to - Recipient email
 * @param {string} recipientName - User's display name
 * @param {string} resetLink - The password reset URL
 * @param {number} expiryMinutes - Link expiry time
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendPasswordResetEmail(to, recipientName, resetLink, expiryMinutes = 30) {
  console.log(`[EmailService] 📧 Sending password reset email to ${to}...`);
  return sendMailWithRetry({
    to,
    subject: 'Reset Your HealthGenie Password 🔐',
    html: passwordResetTemplate(recipientName, resetLink, expiryMinutes)
  });
}

// ─── Public API: Send Custom Email ───────────────────────────────────────────
/**
 * Sends a custom email with arbitrary subject and HTML body.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject line
 * @param {string} html - Full HTML content for the email body
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendCustomEmail(to, subject, html) {
  console.log(`[EmailService] 📧 Sending custom email to ${to}...`);
  return sendMailWithRetry({ to, subject, html });
}

// ─── Public API: Send Notification Email ─────────────────────────────────────
/**
 * Sends a notification email using the standard notification template.
 * @param {string} to - Recipient email
 * @param {string} recipientName - User's display name
 * @param {string} subject - Notification subject
 * @param {string} message - HTML content for the notification body
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendNotificationEmail(to, recipientName, subject, message) {
  console.log(`[EmailService] 📧 Sending notification email to ${to}...`);
  return sendMailWithRetry({
    to,
    subject: subject,
    html: notificationTemplate(recipientName, subject, message)
  });
}

// ─── Public API: Verify SMTP Connection ──────────────────────────────────────
/**
 * Verifies that the SMTP connection and credentials are valid.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function verifyConnection() {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log('[EmailService] ✅ SMTP connection verified successfully.');
    return { success: true };
  } catch (err) {
    console.error(`[EmailService] ❌ SMTP verification failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}
