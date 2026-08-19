import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

import { api } from '../../services/api';

export default function Signup() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const update = (key: string, val: string) => { 
    setForm(f => ({ ...f, [key]: val })); 
    setErrors((prev: any) => ({ ...prev, [key]: '' })); 
  };

  const validateForm = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});
      
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      router.replace({
        pathname: '/(auth)/verify-otp',
        params: { email: form.email }
      });

    } catch (error: any) {
      const serverMsg = error.response?.data?.message || '';
      if (serverMsg.toLowerCase().includes('already') || serverMsg.toLowerCase().includes('exists')) {
        setErrors({ form: 'An account with this email already exists. Try signing in.' });
      } else if (error.message === 'Network Error' || !error.response) {
        setErrors({ form: 'Unable to connect to server. Please check your connection.' });
      } else {
        setErrors({ form: 'Registration failed. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.bgCircle, { top: '-10%', left: '-10%', backgroundColor: 'rgba(0,245,255,0.06)' }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
        <GlassCard hover={false}>
          <View style={styles.header}>
            <Animated.View entering={ZoomIn.duration(800)} style={styles.iconContainer}>
              <Sparkles size={24} color="#020510" />
            </Animated.View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us on your health journey</Text>
          </View>

          <View style={styles.form}>
            <GlassInput 
              label="FULL NAME" 
              icon={User} 
              placeholder="Your full name" 
              value={form.name} 
              onChangeText={(t: string) => update('name', t)} 
              error={errors.name} 
            />
            
            <GlassInput 
              label="EMAIL" 
              icon={Mail} 
              placeholder="your@email.com" 
              value={form.email} 
              onChangeText={(t: string) => update('email', t)} 
              error={errors.email} 
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <View style={{ position: 'relative' }}>
              <GlassInput 
                label="PASSWORD" 
                icon={Lock} 
                placeholder="Min 6 characters" 
                value={form.password} 
                onChangeText={(t: string) => update('password', t)} 
                error={errors.password} 
                secureTextEntry={!showPw}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </TouchableOpacity>
            </View>

            <GlassInput 
              label="CONFIRM PASSWORD" 
              icon={Lock} 
              placeholder="Repeat password" 
              value={form.confirmPassword} 
              onChangeText={(t: string) => update('confirmPassword', t)} 
              error={errors.confirmPassword} 
              secureTextEntry={true}
            />

            {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}

            <GlassButton variant="primary" fullWidth onPress={handleSignup} disabled={loading} style={{ marginTop: 8 }}>
              {loading ? (
                <ActivityIndicator color="#020510" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.btnTextPrimary}>Create Account</Text>
                  <ArrowRight size={18} color="#020510" />
                </View>
              )}
            </GlassButton>

          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#020510',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  bgCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  content: {
    width: '100%',
    maxWidth: 480,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  form: {
    gap: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 38,
    zIndex: 10,
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
  },
  btnTextPrimary: {
    color: '#020510',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkText: {
    color: '#00F5FF',
    fontSize: 14,
    fontWeight: '600',
  }
});
