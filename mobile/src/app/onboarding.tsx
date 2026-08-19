import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft, ZoomIn } from 'react-native-reanimated';
import { Sparkles, Brain, Activity, Shield, Target, Dumbbell, Apple, Droplets, Moon, Heart, ArrowRight, ArrowLeft, SkipForward, PartyPopper } from 'lucide-react-native';
import { GlassButton, GlassCard } from '../components/ui/Components';
import { useAuthStore } from '../store/healthStore';

const { width } = Dimensions.get('window');

const features = [
  { id: '1', icon: Brain, title: 'AI-Powered Analysis', desc: 'Get instant health insights from advanced AI', color: '#00F5FF' },
  { id: '2', icon: Activity, title: 'Complete Health Tracking', desc: 'Monitor diet, exercise, water & more', color: '#39FF14' },
  { id: '3', icon: Shield, title: 'Emergency Ready', desc: 'Quick access to emergency support 24/7', color: '#FF6B35' },
];

const goals = [
  { id: 'weight', icon: Target, label: 'Manage Weight', color: '#00F5FF' },
  { id: 'fitness', icon: Dumbbell, label: 'Get Fit', color: '#39FF14' },
  { id: 'nutrition', icon: Apple, label: 'Eat Healthier', color: '#FFB347' },
  { id: 'hydration', icon: Droplets, label: 'Stay Hydrated', color: '#00F5FF' },
  { id: 'sleep', icon: Moon, label: 'Better Sleep', color: '#BF5FFF' },
  { id: 'mental', icon: Brain, label: 'Mental Wellness', color: '#BF5FFF' },
  { id: 'heart', icon: Heart, label: 'Heart Health', color: '#FF6B35' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const router = useRouter();
  const setOnboardingComplete = useAuthStore(s => s.setOnboardingComplete);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const skipToDashboard = () => {
    setOnboardingComplete();
    router.replace('/(auth)/login');
  };

  const handleFinish = () => {
    setOnboardingComplete();
    router.replace('/(auth)/login');
  };

  const renderStepIndicators = (current: number) => (
    <View style={styles.indicatorContainer}>
      {[1, 2, 3].map(s => (
        <View 
          key={s} 
          style={[
            styles.indicator, 
            { 
              width: s === current ? 24 : 8,
              backgroundColor: s === current ? '#00F5FF' : s < current ? '#39FF14' : 'rgba(100,180,255,0.2)' 
            }
          ]} 
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={skipToDashboard}>
        <Text style={styles.skipText}>Skip</Text>
        <SkipForward size={14} color="#9CA3AF" />
      </TouchableOpacity>

      {step === 1 && (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContainer}>
          <Animated.View entering={ZoomIn.delay(200)} style={styles.orbContainer}>
            <View style={styles.orb}>
              <Sparkles size={40} color="#020510" />
            </View>
          </Animated.View>

          <Text style={styles.title}>Meet Your Health Partner</Text>
          <Text style={styles.subtitle}>
            HealthGenie AI combines cutting-edge artificial intelligence with comprehensive health tracking to be your personal health companion.
          </Text>

          <View style={styles.featuresList}>
            {features.map((f, i) => (
              <Animated.View key={f.id} entering={SlideInRight.delay(400 + i * 150)}>
                <GlassCard style={styles.featureCard} hover={false}>
                  <View style={[styles.featureIconContainer, { backgroundColor: `${f.color}15`, borderColor: `${f.color}30` }]}>
                    <f.icon size={22} color={f.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureTitle}>{f.title}</Text>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>

          {renderStepIndicators(1)}
          
          <GlassButton variant="primary" onPress={() => setStep(2)}>
            <Text style={styles.btnText}>Continue</Text>
            <ArrowRight size={18} color="#020510" />
          </GlassButton>
        </Animated.View>
      )}

      {step === 2 && (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContainer}>
          <Text style={styles.title}>Personalize Your Experience</Text>
          <Text style={styles.subtitle}>
            Select your health goals so we can customize your journey
          </Text>

          <ScrollView contentContainerStyle={styles.goalsGrid} showsVerticalScrollIndicator={false}>
            {goals.map((g, i) => {
              const isSelected = selectedGoals.includes(g.id);
              return (
                <Animated.View key={g.id} entering={ZoomIn.delay(100 + i * 50)} style={styles.goalWrapper}>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => toggleGoal(g.id)}
                    style={[
                      styles.goalCard,
                      {
                        backgroundColor: isSelected ? `${g.color}15` : '#111827',
                        borderColor: isSelected ? `${g.color}60` : '#1F2937'
                      }
                    ]}
                  >
                    <g.icon size={28} color={isSelected ? g.color : '#9CA3AF'} style={{ marginBottom: 8 }} />
                    <Text style={[styles.goalText, { color: isSelected ? '#FFFFFF' : '#9CA3AF' }]}>{g.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>

          {renderStepIndicators(2)}

          <View style={styles.buttonRow}>
            <GlassButton style={{ flex: 1, marginRight: 8 }} onPress={() => setStep(1)}>
              <ArrowLeft size={18} color="#111827" />
              <Text style={[styles.btnText, { color: '#111827' }]}> Back</Text>
            </GlassButton>
            <GlassButton variant="primary" style={{ flex: 2 }} onPress={() => setStep(3)}>
              <Text style={styles.btnText}>Continue</Text>
              <ArrowRight size={18} color="#020510" />
            </GlassButton>
          </View>
        </Animated.View>
      )}

      {step === 3 && (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={[styles.stepContainer, { justifyContent: 'center' }]}>
          <Animated.View entering={ZoomIn.delay(300)} style={styles.orbContainer}>
            <View style={[styles.orb, { backgroundColor: '#39FF14' }]}>
              <PartyPopper size={44} color="#020510" />
            </View>
          </Animated.View>

          <Text style={styles.title}>You're All Set! 🎉</Text>
          <Text style={styles.subtitle}>
            Your personal health journey begins now. HealthGenie AI is ready to help you achieve your wellness goals.
          </Text>

          {renderStepIndicators(3)}

          <GlassButton variant="primary" onPress={handleFinish} style={{ width: '100%', marginTop: 20 }}>
            <Sparkles size={18} color="#020510" />
            <Text style={styles.btnText}> Start My Journey </Text>
            <ArrowRight size={18} color="#020510" />
          </GlassButton>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020510',
    padding: 24,
    paddingTop: 60,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: '#9CA3AF',
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500'
  },
  stepContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
  },
  orbContainer: {
    marginBottom: 40,
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F5FF',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  featuresList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#020510',
    marginHorizontal: 8,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  goalWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  goalCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  goalText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  }
});
