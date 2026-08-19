/**
 * HealthGenie Email Routes
 * 
 * Exposes email-related API endpoints.
 */

import express from 'express';
import {
  sendEmail,
  sendOTP,
  sendReset,
  sendWelcome,
  verifySmtp
} from '../controllers/emailController.js';

const router = express.Router();

// Send a custom email
router.post('/send', sendEmail);

// Send OTP verification email
router.post('/send-otp', sendOTP);

// Send password reset email
router.post('/send-reset', sendReset);

// Send welcome email
router.post('/send-welcome', sendWelcome);

// Verify SMTP connection (health check for email)
router.get('/verify', verifySmtp);

export default router;
