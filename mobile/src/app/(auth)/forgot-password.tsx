import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { api } from '../../services/api';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/email/send-reset', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.bgCircle, { top: '-10%', right: '-10%', backgroundColor: 'rgba(0,245,255,0.08)' }]} />

      <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
        <GlassCard hover={false}>
          {sent ? (
            <Animated.View entering={ZoomIn.duration(400)} style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <CheckCircle size={56} color="#39FF14" />
              </View>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a password reset link to{'\n'}
                <Text style={styles.highlightText}>{email}</Text>
              </Text>

              <GlassButton variant="primary" fullWidth onPress={() => router.push('/(auth)/login')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ArrowLeft size={18} color="#020510" />
                  <Text style={styles.btnTextPrimary}>Back to Login</Text>
                </View>
              </GlassButton>
            </Animated.View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
              </View>

              <View style={styles.form}>
                <GlassInput
                  label="EMAIL ADDRESS"
                  icon={Mail}
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={(t: string) => { setEmail(t); setError(''); }}
                  error={error}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <GlassButton variant="primary" fullWidth onPress={handleSend} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#020510" />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Send size={18} color="#020510" />
                      <Text style={styles.btnTextPrimary}>Send Reset Link</Text>
                    </View>
                  )}
                </GlassButton>

                <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backBtn}>
                  <ArrowLeft size={16} color="#6B7280" />
                  <Text style={styles.backText}>Back to login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  highlightText: {
    color: '#00F5FF',
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  btnTextPrimary: {
    color: '#020510',
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  backText: {
    color: '#6B7280',
    fontSize: 14,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconCircle: {
    marginBottom: 16,
  }
});
