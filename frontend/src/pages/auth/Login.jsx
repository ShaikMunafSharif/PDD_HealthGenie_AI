import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';


export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrors({});

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'UNVERIFIED_EMAIL') {
          // Redirect to verification page
          navigate('/verify-otp', { state: { email } });
          return;
        }
        throw new Error(data.message || 'Login failed');
      }

      login({ ...data.user, token: data.token });
      navigate("/dashboard");

    } catch (error) {
      setErrors({ email: error.message });
    } finally {
      setLoading(false);
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
      {/* Background effects */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.08), transparent 70%)',
        top: '-10%',
        right: '-10%',
      }} />
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(57,255,20,0.06), transparent 70%)',
        bottom: '-5%',
        left: '-5%',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <GlassCard className="p-8" hover={false}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00F5FF, #39FF14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
              animate={{ boxShadow: ['0 0 20px rgba(0,245,255,0.3)', '0 0 40px rgba(0,245,255,0.5)', '0 0 20px rgba(0,245,255,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={28} color="#020510" />
            </motion.div>
            <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              Sign in to your health journey
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <GlassInput
              type="email"
              placeholder="Enter your email"
              label="EMAIL"
              icon={Mail}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
              error={errors.email}
            />

            <div style={{ position: 'relative' }}>
              <GlassInput
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                label="PASSWORD"
                icon={Lock}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: 38,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{
                color: 'var(--neon-pulse)',
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}>
                Forgot password?
              </Link>
            </div>

            <GlassButton variant="primary" type="submit" fullWidth disabled={loading}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 20, height: 20, border: '2px solid var(--neon-pulse)', borderTopColor: 'transparent', borderRadius: '50%' }}
                />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </GlassButton>

          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--neon-pulse)', textDecoration: 'none', fontWeight: 600 }}>
                Sign up
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
