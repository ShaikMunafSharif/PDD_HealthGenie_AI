import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowRight, ArrowLeft, Clock, BarChart2, Repeat, FileText } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';

const durations = ['< 1 day', '1-3 days', '3-7 days', '1-2 weeks', '2-4 weeks', '> 1 month'];
const frequencies = [
  { id: 'constant', label: 'Constant' },
  { id: 'frequent', label: 'Frequent' },
  { id: 'occasional', label: 'Occasional' },
  { id: 'rare', label: 'Rare' },
];

export default function SymptomDetails() {
  const router = useRouter();
  const { 
    severity, duration, frequency, additionalNotes, 
    setSeverity, setDuration, setFrequency, setAdditionalNotes, 
    selectedSymptoms, selectedBodyParts 
  } = useSymptomStore();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>TRIAGE ASSESSMENT</Text>
          <Text style={styles.title}>Symptom Details</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        
        {/* Selected Summary */}
        <GlassCard hover={false} style={styles.summaryCard}>
          <View style={styles.chipGrid}>
            {selectedSymptoms.map((s: any) => (
              <View key={s} style={styles.chipSelected}>
                <Text style={styles.chipSelectedText}>{s}</Text>
              </View>
            ))}
            {selectedBodyParts.map((s: any) => (
              <View key={s} style={styles.chipDanger}>
                <Text style={styles.chipDangerText}>{s}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Duration */}
        <GlassCard hover={false} style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Onset & Duration</Text>
          </View>
          <View style={styles.durationGrid}>
            {durations.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => setDuration(d)}
                style={[styles.optionBtn, duration === d && styles.optionBtnActive]}
              >
                <Text style={[styles.optionBtnText, duration === d && styles.optionBtnTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Severity */}
        <GlassCard hover={false} style={styles.card}>
          <View style={styles.cardHeader}>
            <BarChart2 size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Discomfort Severity</Text>
            <Text style={[styles.severityScore, { color: severity <= 3 ? '#10B981' : severity <= 6 ? '#F59E0B' : '#EF4444' }]}>
              {severity}/10
            </Text>
          </View>
          
          <View style={styles.severityControls}>
            {[1,2,3,4,5,6,7,8,9,10].map(val => (
              <TouchableOpacity
                key={val}
                onPress={() => setSeverity(val)}
                style={[
                  styles.severityTick, 
                  severity >= val && { backgroundColor: val <= 3 ? '#10B981' : val <= 6 ? '#F59E0B' : '#EF4444' }
                ]}
              />
            ))}
          </View>
          
          <View style={styles.severityLabels}>
            <Text style={styles.severityLabelText}>1 - Mild</Text>
            <Text style={styles.severityLabelText}>5 - Moderate</Text>
            <Text style={styles.severityLabelText}>10 - Unbearable</Text>
          </View>
        </GlassCard>

        {/* Frequency */}
        <GlassCard hover={false} style={styles.card}>
          <View style={styles.cardHeader}>
            <Repeat size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Occurrence Frequency</Text>
          </View>
          <View style={styles.freqGrid}>
            {frequencies.map(f => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFrequency(f.id)}
                style={[styles.optionBtn, frequency === f.id && styles.optionBtnActive]}
              >
                <Text style={[styles.optionBtnText, frequency === f.id && styles.optionBtnTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Additional Notes */}
        <GlassCard hover={false} style={styles.card}>
          <View style={styles.cardHeader}>
            <FileText size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Medical Context</Text>
          </View>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Describe triggers, relieving factors..."
            placeholderTextColor="#9CA3AF"
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            textAlignVertical="top"
          />
        </GlassCard>

        <GlassButton
          variant="primary"
          fullWidth
          onPress={() => router.push('/symptoms/processing')}
          style={styles.continueBtn}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.btnText}>Run AI Assessment</Text>
            <ArrowRight size={18} color="#020510" />
          </View>
        </GlassButton>
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
  summaryCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipSelected: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  chipSelectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  chipDanger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  chipDangerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  freqGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '31%',
    alignItems: 'center',
  },
  optionBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  optionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  optionBtnTextActive: {
    color: '#1E40AF',
  },
  severityScore: {
    marginLeft: 'auto',
    fontSize: 18,
    fontWeight: '800',
  },
  severityControls: {
    flexDirection: 'row',
    gap: 4,
    height: 12,
    marginBottom: 8,
  },
  severityTick: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  severityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    color: '#111827',
    minHeight: 100,
  },
  continueBtn: {
    marginTop: 10,
    marginBottom: 40,
    paddingVertical: 16,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#020510',
  }
});
