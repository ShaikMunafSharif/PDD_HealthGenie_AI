import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Ruler, Weight, Calendar } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';


export default function Signup() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, val) => { 
    setForm(f => ({ ...f, [key]: val })); 
    setErrors(prev => ({ ...prev, [key]: '' })); 
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Navigate to OTP verification page
      navigate('/verify-otp', { state: { email: form.email } });

    } catch (error) {
      setErrors(prev => ({ ...prev, email: error.message }));
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
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.06), transparent 70%)',
        top: '-10%', left: '-10%',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <GlassCard className="p-8" hover={false}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <motion.div
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00F5FF, #39FF14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles size={24} color="#020510" />
            </motion.div>
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9rem' }}>
              Join us on your health journey
            </p>
          </div>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GlassInput 
              label="FULL NAME" 
              icon={User} 
              placeholder="Your full name" 
              value={form.name} 
              onChange={(e) => update('name', e.target.value)} 
              error={errors.name} 
            />
            <GlassInput 
              label="EMAIL" 
              icon={Mail} 
              type="email" 
              placeholder="your@email.com" 
              value={form.email} 
              onChange={(e) => update('email', e.target.value)} 
              error={errors.email} 
            />
            <div style={{ position: 'relative' }}>
              <GlassInput 
                label="PASSWORD" 
                icon={Lock} 
                type={showPw ? 'text' : 'password'} 
                placeholder="Min 6 characters" 
                value={form.password} 
                onChange={(e) => update('password', e.target.value)} 
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
                  color: 'var(--text-secondary)' 
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <GlassInput 
              label="CONFIRM PASSWORD" 
              icon={Lock} 
              type="password" 
              placeholder="Repeat password" 
              value={form.confirmPassword} 
              onChange={(e) => update('confirmPassword', e.target.value)} 
              error={errors.confirmPassword} 
            />
            
            <GlassButton variant="primary" type="submit" fullWidth disabled={loading}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 20, height: 20, border: '2px solid var(--neon-pulse)', borderTopColor: 'transparent', borderRadius: '50%' }}
                />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </GlassButton>

          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--neon-pulse)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
