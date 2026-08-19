import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    setSent(true);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <GlassCard className="p-8" hover={false}>
          {sent ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ margin: '0 auto 20px' }}
              >
                <CheckCircle size={64} style={{ color: 'var(--neon-health)' }} />
              </motion.div>
              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Check Your Email</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                We've sent a password reset link to<br />
                <strong style={{ color: 'var(--neon-pulse)' }}>{email}</strong>
              </p>
              <Link to="/login">
                <GlassButton variant="primary"><ArrowLeft size={16} /> Back to Login</GlassButton>
              </Link>
            </motion.div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Forgot Password</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Enter your email to receive a reset link</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <GlassInput label="EMAIL ADDRESS" icon={Mail} type="email" placeholder="your@email.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }} error={error} />
                <GlassButton variant="primary" fullWidth onClick={handleSend}>
                  <Send size={18} /> Send Reset Link
                </GlassButton>
                <Link to="/login" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                  <ArrowLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Back to login
                </Link>
              </div>
            </>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
