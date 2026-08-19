import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Search, ChevronRight, Phone, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../components/ui/Components';

const procedures = [
  { id: 'cpr', title: 'CPR', icon: '❤️', severity: 'critical', steps: ['Check for responsiveness', 'Call emergency services', 'Place heel of hand on center of chest', '30 chest compressions at 2 inches deep', '2 rescue breaths', 'Repeat until help arrives'] },
  { id: 'choking', title: 'Choking', icon: '🫁', severity: 'critical', steps: ['Ask "Are you choking?"', 'Stand behind the person', 'Make a fist above navel', '5 abdominal thrusts', 'Repeat until object dislodged', 'Call 108 if unresponsive'] },
  { id: 'burns', title: 'Burns', icon: '🔥', severity: 'high', steps: ['Cool burn under running water (10-20 min)', 'Remove jewelry near burn', 'Cover with sterile bandage', 'Do NOT apply ice or butter', 'Seek medical help for severe burns'] },
  { id: 'bleeding', title: 'Severe Bleeding', icon: '🩸', severity: 'critical', steps: ['Apply firm pressure with clean cloth', 'Elevate the wound above heart level', 'Do NOT remove embedded objects', 'Add more cloth if blood soaks through', 'Call emergency services'] },
  { id: 'fracture', title: 'Fracture', icon: '🦴', severity: 'high', steps: ['Immobilize the injured area', 'Apply ice wrapped in cloth', 'Do NOT try to straighten the bone', 'Support with splint if available', 'Seek immediate medical attention'] },
  { id: 'allergic', title: 'Allergic Reaction', icon: '⚠️', severity: 'critical', steps: ['Use EpiPen if available', 'Call emergency services', 'Lay person flat with legs elevated', 'Loosen tight clothing', 'Monitor breathing', 'Be ready to perform CPR'] },
  { id: 'heatstroke', title: 'Heat Stroke', icon: '🌡️', severity: 'high', steps: ['Move to cool area immediately', 'Remove excess clothing', 'Cool with water or ice packs', 'Fan the person', 'Give cool water if conscious'] },
  { id: 'poisoning', title: 'Poisoning', icon: '☠️', severity: 'critical', steps: ['Call Poison Control immediately', 'Do NOT induce vomiting unless told', 'Save the substance container', 'Note the time of ingestion', 'Monitor vital signs'] },
];

export default function FirstAid() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const filtered = procedures.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>EMERGENCY</Text>
          <Text style={styles.title} numberOfLines={1}>First Aid Guide</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.warningCard}>
          <Phone size={20} color="#F97316" />
          <Text style={styles.warningText}>
            In a medical emergency, always call <Text style={{ fontWeight: '800', color: '#EA580C' }}>108</Text> first
          </Text>
        </GlassCard>

        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search first aid procedures..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.list}>
          {filtered.map((proc, i) => (
            <Animated.View key={proc.id} entering={FadeInUp.delay(200 + i * 40)}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(expanded === proc.id ? null : proc.id)}>
                <GlassCard hover={false} style={[styles.card, proc.severity === 'critical' && styles.cardCritical]}>
                  <View style={styles.cardHeader}>
                    <Text style={{ fontSize: 24 }}>{proc.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.procTitle}>{proc.title}</Text>
                      <View style={[styles.severityTag, proc.severity === 'critical' ? styles.severityCritical : styles.severityHigh]}>
                        <Text style={[styles.severityText, proc.severity === 'critical' ? styles.severityTextCritical : styles.severityTextHigh]}>
                          {proc.severity.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Animated.View style={{ transform: [{ rotate: expanded === proc.id ? '90deg' : '0deg' }] }}>
                      <ChevronRight size={20} color="#9CA3AF" />
                    </Animated.View>
                  </View>
                  
                  {expanded === proc.id && (
                    <View style={styles.stepsContainer}>
                      {proc.steps.map((step, j) => (
                        <View key={j} style={styles.stepRow}>
                          <View style={styles.stepNumBox}>
                            <Text style={styles.stepNum}>{j + 1}</Text>
                          </View>
                          <Text style={styles.stepText}>{step}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  warningCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#C2410C',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  list: {
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 0,
    overflow: 'hidden',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  cardCritical: {
    borderColor: '#FECDD3',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  procTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  severityTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  severityCritical: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  severityHigh: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  severityTextCritical: {
    color: '#E11D48',
  },
  severityTextHigh: {
    color: '#EA580C',
  },
  stepsContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
  },
  stepNumBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 2,
  }
});
