import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

import { api } from '../../services/api';

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      login({ ...data.user, token: data.token });
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      const errData = error.response?.data;
      if (errData?.code === 'UNVERIFIED_EMAIL') {
        router.replace({
          pathname: '/(auth)/verify-otp',
          params: { email }
        });
        return;
      }
      
      // If network fails or server offline, allow instant offline access
      if (error.message === 'Network Error' || !error.response) {
        console.warn('Backend server unreachable, logging in via fallback local session');
        login({
          uid: 'demo-user-123',
          name: email ? email.split('@')[0] : 'HealthGenie User',
          email: email || 'user@healthgenie.com',
          token: 'demo-token'
        });
        router.replace('/(tabs)/dashboard');
        return;
      }

      const status = error.response?.status;
      const serverMsg = errData?.message || '';

      // Map to user-friendly messages
      if (status === 401 || serverMsg.toLowerCase().includes('invalid')) {
        setErrors({ form: 'Invalid email or password. Please try again.' });
      } else if (status === 404 || serverMsg.toLowerCase().includes('not found') || serverMsg.toLowerCase().includes('no user')) {
        setErrors({ form: 'No account found with this email address.' });
      } else if (status === 429) {
        setErrors({ form: 'Too many login attempts. Please wait and try again.' });
      } else {
        setErrors({ form: 'Something went wrong. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Background gradients simulated */}
      <View style={[styles.bgCircle, { top: '-10%', right: '-10%', backgroundColor: 'rgba(0,245,255,0.08)' }]} />
      <View style={[styles.bgCircle, { bottom: '-5%', left: '-5%', backgroundColor: 'rgba(57,255,20,0.06)' }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
        <GlassCard hover={false}>
          <View style={styles.header}>
            <Animated.View entering={ZoomIn.duration(800)} style={styles.iconContainer}>
              <Sparkles size={28} color="#020510" />
            </Animated.View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your health journey</Text>
          </View>

          <View style={styles.form}>
            <GlassInput
              label="EMAIL"
              icon={Mail}
              placeholder="Enter your email"
              value={email}
              onChangeText={(t: string) => { setEmail(t); setErrors({}); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <View style={{ position: 'relative' }}>
              <GlassInput
                label="PASSWORD"
                icon={Lock}
                placeholder="Enter your password"
                value={password}
                onChangeText={(t: string) => { setPassword(t); setErrors({}); }}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </TouchableOpacity>
            </View>

            {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <GlassButton variant="primary" fullWidth onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#020510" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.btnTextPrimary}>Sign In</Text>
                  <ArrowRight size={18} color="#020510" />
                </View>
              )}
            </GlassButton>

          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.linkText}>Sign up</Text>
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
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  content: {
    width: '100%',
    maxWidth: 440,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    gap: 16,
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
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#00F5FF',
    fontSize: 13,
    fontWeight: '600',
  },
  btnTextPrimary: {
    color: '#020510',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
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
    marginTop: 24,
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
