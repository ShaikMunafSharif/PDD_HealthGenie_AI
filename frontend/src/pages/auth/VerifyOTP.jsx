import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  
  // Get email from router state
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    // Allow pasting full OTP
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus last filled input or end
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Success
      login({ ...data.user, token: data.token });
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;

    try {
      setResending(true);
      setError('');
      
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.06), transparent 70%)',
        top: '-10%', left: '-10%',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <GlassCard className="p-8" hover={false}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00F5FF, #39FF14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShieldCheck size={28} color="#020510" />
            </motion.div>
            <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              Verify Your Email
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
              We've sent a 6-digit verification code to
            </p>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: 48,
                    height: 56,
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxShadow: digit ? '0 0 10px rgba(0, 245, 255, 0.1)' : 'none',
                    borderColor: digit ? 'rgba(0, 245, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0, 245, 255, 0.8)'}
                  onBlur={(e) => {
                    if (!digit) e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
              ))}
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ color: '#EF4444', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}
              >
                {error}
              </motion.p>
            )}

            <GlassButton variant="primary" type="submit" fullWidth disabled={loading || otp.join('').length !== 6}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 20, height: 20, border: '2px solid var(--neon-pulse)', borderTopColor: 'transparent', borderRadius: '50%' }}
                />
              ) : (
                <>Verify & Continue <ArrowRight size={18} /></>
              )}
            </GlassButton>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || resending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendTimer > 0 ? 'var(--text-secondary)' : 'var(--neon-pulse)',
                  cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                }}
              >
                {resending ? 'Sending...' : resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/signup" style={{ 
              color: 'var(--text-secondary)', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}>
              <ArrowLeft size={16} /> Change Email
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
