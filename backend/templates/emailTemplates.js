/**
 * HealthGenie Email Templates
 * 
 * Professional, mobile-responsive HTML email templates
 * used across the application for transactional emails.
 */

// Shared base layout wrapper for all emails
const baseLayout = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f0f4f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    
    /* Container */
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    
    /* Header */
    .email-header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%); padding: 32px 24px; text-align: center; }
    .email-header h1 { color: #ffffff; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px; }
    .email-header .logo-icon { font-size: 48px; margin-bottom: 8px; display: block; }
    .email-header .tagline { color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 6px; }
    
    /* Body */
    .email-body { padding: 32px 28px; color: #334155; line-height: 1.7; font-size: 15px; }
    .email-body h2 { color: #1e293b; font-size: 22px; margin: 0 0 16px; font-weight: 600; }
    .email-body p { margin: 0 0 14px; }
    
    /* OTP Box */
    .otp-box { background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%); border: 2px dashed #8b5cf6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 36px; font-weight: 800; color: #6366f1; letter-spacing: 8px; font-family: 'Courier New', monospace; }
    .otp-expiry { color: #64748b; font-size: 13px; margin-top: 10px; }
    
    /* Button */
    .btn-primary { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 20px 0; transition: all 0.3s; }
    .btn-primary:hover { opacity: 0.9; }
    
    /* Info Box */
    .info-box { background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 20px 0; }
    .info-box p { margin: 0; font-size: 14px; color: #475569; }
    
    /* Warning */
    .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 14px 18px; margin: 20px 0; }
    .warning-box p { margin: 0; font-size: 13px; color: #92400e; }
    
    /* Feature List */
    .feature-list { list-style: none; padding: 0; margin: 20px 0; }
    .feature-list li { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #475569; }
    .feature-list li:last-child { border-bottom: none; }
    .feature-list li::before { content: '✅'; margin-right: 10px; }
    
    /* Footer */
    .email-footer { background: #f8fafc; padding: 24px 28px; text-align: center; border-top: 1px solid #e2e8f0; }
    .email-footer p { margin: 4px 0; font-size: 12px; color: #94a3b8; }
    .email-footer a { color: #6366f1; text-decoration: none; }
    .social-links { margin: 12px 0; }
    .social-links a { margin: 0 8px; font-size: 14px; color: #64748b; text-decoration: none; }
    
    /* Responsive */
    @media only screen and (max-width: 620px) {
      .email-container { margin: 8px !important; border-radius: 12px !important; }
      .email-header { padding: 24px 16px !important; }
      .email-header h1 { font-size: 22px !important; }
      .email-body { padding: 24px 18px !important; }
      .otp-code { font-size: 28px !important; letter-spacing: 6px !important; }
      .btn-primary { padding: 12px 28px !important; font-size: 14px !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 0;">
    <tr>
      <td align="center">
        <div class="email-container">
          <!-- Header -->
          <div class="email-header">
            <span class="logo-icon">🧬</span>
            <h1>HealthGenie</h1>
            <div class="tagline">Your AI-Powered Health Companion</div>
          </div>
          
          <!-- Body Content -->
          <div class="email-body">
            ${bodyContent}
          </div>
          
          <!-- Footer -->
          <div class="email-footer">
            <div class="social-links">
              <a href="#">🌐 Website</a>
              <a href="#">📱 App</a>
              <a href="#">💬 Support</a>
            </div>
            <p>Need help? Contact us at <a href="mailto:healthgenieai915@gmail.com">healthgenieai915@gmail.com</a></p>
            <p>&copy; ${new Date().getFullYear()} HealthGenie. All rights reserved.</p>
            <p>You received this email because you signed up on HealthGenie.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * OTP Verification Email Template
 * @param {string} recipientName - User's name
 * @param {string} otp - The OTP code
 * @param {number} expiryMinutes - Minutes until OTP expires
 */
export const otpTemplate = (recipientName, otp, expiryMinutes = 10) => {
  const body = `
    <h2>Verify Your Email Address</h2>
    <p>Hello <strong>${recipientName || 'User'}</strong>,</p>
    <p>We received a request to verify your email address. Please use the OTP code below to complete your verification:</p>
    
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="otp-expiry">⏱️ This code expires in <strong>${expiryMinutes} minutes</strong></div>
    </div>
    
    <div class="warning-box">
      <p>🔒 <strong>Security Notice:</strong> Never share this code with anyone. HealthGenie staff will never ask you for this code.</p>
    </div>
    
    <p>If you did not request this verification, please ignore this email or contact our support team immediately.</p>
  `;
  return baseLayout('Verify Your Email - HealthGenie', body);
};

/**
 * Welcome Email Template
 * @param {string} recipientName - User's name
 */
export const welcomeTemplate = (recipientName) => {
  const body = `
    <h2>Welcome to HealthGenie! 🎉</h2>
    <p>Hello <strong>${recipientName || 'Health Champion'}</strong>,</p>
    <p>We're thrilled to have you on board! Your journey towards smarter, AI-powered health management starts now.</p>
    
    <div class="info-box">
      <p>🧬 <strong>Your account has been successfully created.</strong> Explore all the powerful features waiting for you.</p>
    </div>
    
    <p><strong>Here's what you can do with HealthGenie:</strong></p>
    <ul class="feature-list">
      <li>AI-Powered Symptom Analysis & Health Score</li>
      <li>Personalized Diet & Exercise Plans</li>
      <li>Nearby Doctor & Hospital Finder</li>
      <li>Women's Health & Pregnancy Tracker</li>
      <li>Emergency SOS & First Aid Guides</li>
      <li>Real-Time AI Health Chat Assistant</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="#" class="btn-primary">🚀 Start Exploring HealthGenie</a>
    </div>
    
    <p>If you have any questions, don't hesitate to reach out to our support team. We're here to help!</p>
  `;
  return baseLayout('Welcome to HealthGenie', body);
};

/**
 * Password Reset Email Template
 * @param {string} recipientName - User's name
 * @param {string} resetLink - The password reset URL
 * @param {number} expiryMinutes - Minutes until link expires
 */
export const passwordResetTemplate = (recipientName, resetLink, expiryMinutes = 30) => {
  const body = `
    <h2>Reset Your Password 🔐</h2>
    <p>Hello <strong>${recipientName || 'User'}</strong>,</p>
    <p>We received a request to reset the password associated with your HealthGenie account. Click the button below to set a new password:</p>
    
    <div style="text-align: center;">
      <a href="${resetLink}" class="btn-primary">🔑 Reset My Password</a>
    </div>
    
    <div class="info-box">
      <p>⏱️ This link will expire in <strong>${expiryMinutes} minutes</strong> for security reasons.</p>
    </div>
    
    <p>If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; font-size: 13px; color: #6366f1; background: #f1f5f9; padding: 10px; border-radius: 6px;">${resetLink}</p>
    
    <div class="warning-box">
      <p>⚠️ If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
    </div>
  `;
  return baseLayout('Reset Your Password - HealthGenie', body);
};

/**
 * General Notification Email Template
 * @param {string} recipientName - User's name
 * @param {string} subject - Notification subject
 * @param {string} message - HTML or text message body
 */
export const notificationTemplate = (recipientName, subject, message) => {
  const body = `
    <h2>${subject}</h2>
    <p>Hello <strong>${recipientName || 'User'}</strong>,</p>
    <div style="margin: 16px 0;">${message}</div>
    <div class="info-box">
      <p>This is an automated notification from HealthGenie. If you have questions, please contact our support team.</p>
    </div>
  `;
  return baseLayout(subject + ' - HealthGenie', body);
};
