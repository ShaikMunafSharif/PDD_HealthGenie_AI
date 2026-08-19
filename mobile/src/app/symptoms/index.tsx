import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Svg, { Circle, Line, Ellipse } from 'react-native-svg';
import { Search, ArrowRight, ArrowLeft, X } from 'lucide-react-native';
import { GlassCard, GlassInput, GlassButton } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';

const { width } = Dimensions.get('window');

const bodyParts = [
  { id: 'head', label: 'Head', x: 50, y: 10 },
  { id: 'throat', label: 'Throat', x: 50, y: 18 },
  { id: 'chest', label: 'Chest', x: 50, y: 28 },
  { id: 'stomach', label: 'Stomach', x: 50, y: 42 },
  { id: 'leftArm', label: 'Left Arm', x: 25, y: 35 },
  { id: 'rightArm', label: 'Right Arm', x: 75, y: 35 },
  { id: 'back', label: 'Back', x: 50, y: 48 },
  { id: 'hip', label: 'Hip', x: 50, y: 55 },
  { id: 'leftLeg', label: 'Left Leg', x: 38, y: 75 },
  { id: 'rightLeg', label: 'Right Leg', x: 62, y: 75 },
  { id: 'leftKnee', label: 'Left Knee', x: 39, y: 68 },
  { id: 'rightKnee', label: 'Right Knee', x: 61, y: 68 },
];

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
  'Body Ache', 'Sore Throat', 'Chest Pain', 'Shortness of Breath',
  'Stomach Pain', 'Diarrhea', 'Back Pain', 'Joint Pain', 'Rash',
  'Insomnia', 'Anxiety', 'Loss of Appetite', 'Swelling', 'Numbness',
];

export default function SymptomSelect() {
  const router = useRouter();
  const { selectedBodyParts, selectedSymptoms, addBodyPart, addSymptom } = useSymptomStore();
  const [search, setSearch] = useState('');

  const filtered = commonSymptoms.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>SYMPTOM ANALYSIS</Text>
          <Text style={styles.title}>Select Your Symptoms</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        
        {/* INTERACTIVE SVG BODY MAP */}
        <GlassCard hover={false} style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Interactive Body Map</Text>
            <Text style={styles.cardSubTitle}>Tap body parts on diagram</Text>
          </View>

          <View style={styles.bodyMapWrapper}>
            <View style={styles.svgContainer}>
              <Svg viewBox="0 0 100 200" width="100%" height="100%">
                {/* Head */}
                <Circle cx="50" cy="18" r="12" fill="none" stroke="rgba(37, 99, 235, 0.35)" strokeWidth="1.8" />
                {/* Spine / Body Line */}
                <Line x1="50" y1="30" x2="50" y2="90" stroke="rgba(37, 99, 235, 0.35)" strokeWidth="1.8" />
                {/* Arms */}
                <Line x1="50" y1="42" x2="25" y2="70" stroke="rgba(37, 99, 235, 0.35)" strokeWidth="1.8" />
                <Line x1="50" y1="42" x2="75" y2="70" stroke="rgba(37, 99, 235, 0.35)" strokeWidth="1.8" />
                {/* Legs */}
                <Line x1="50" y1="90" x2="35" y2="155" stroke="rgba(37, 99, 235, 0.35)" strokeWidth="1.8" />
                <Line x1="50" y1="90" x2="65" y2="155" stroke="rgba(37, 99, 235, 0.35)" strokeWidth="1.8" />
                {/* Torso Outline */}
                <Ellipse cx="50" cy="62" rx="18" ry="28" fill="none" stroke="rgba(37, 99, 235, 0.2)" strokeWidth="1" />
              </Svg>

              {/* Clickable Hotspots */}
              {bodyParts.map((part) => {
                const isSelected = selectedBodyParts.includes(part.id);
                return (
                  <TouchableOpacity
                    key={part.id}
                    onPress={() => addBodyPart(part.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.hotspot,
                      { left: `${part.x}%`, top: `${part.y}%` },
                      isSelected && styles.hotspotSelected,
                    ]}
                  >
                    <View style={[styles.hotspotInner, isSelected && styles.hotspotInnerSelected]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Body Parts Tags */}
          {selectedBodyParts.length > 0 && (
            <View style={styles.selectedPartsContainer}>
              <Text style={styles.selectedLabel}>SELECTED BODY PARTS:</Text>
              <View style={styles.chipGrid}>
                {selectedBodyParts.map(bpId => {
                  const part = bodyParts.find(p => p.id === bpId);
                  return (
                    <TouchableOpacity
                      key={bpId}
                      onPress={() => addBodyPart(bpId)}
                      style={[styles.chip, styles.chipActive]}
                    >
                      <Text style={[styles.chipText, styles.chipTextActive]}>{part?.label || bpId}</Text>
                      <X size={12} color="#2563EB" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quick List Toggle */}
          <View style={{ marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
            <Text style={styles.quickListLabel}>ALL BODY PARTS</Text>
            <View style={styles.chipGrid}>
              {bodyParts.map(part => {
                const isActive = selectedBodyParts.includes(part.id);
                return (
                  <TouchableOpacity
                    key={part.id}
                    onPress={() => addBodyPart(part.id)}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{part.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </GlassCard>

        {/* COMMON SYMPTOMS SEARCH */}
        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.cardTitle}>Common Symptoms</Text>
          <View style={styles.searchBox}>
            <GlassInput
              icon={Search}
              placeholder="Search symptoms..."
              value={search}
              onChangeText={setSearch}
              style={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.chipGrid}>
            {filtered.map(s => {
              const isActive = selectedSymptoms.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => addSymptom(s)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {(selectedSymptoms.length > 0 || selectedBodyParts.length > 0) && (
          <GlassButton
            variant="primary"
            fullWidth
            onPress={() => router.push('/symptoms/details')}
            style={styles.continueBtn}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.btnText}>Continue to Details</Text>
              <ArrowRight size={18} color="#020510" />
            </View>
          </GlassButton>
        )}
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
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  bodyMapWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  svgContainer: {
    width: 200,
    height: 280,
    position: 'relative',
  },
  hotspot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  hotspotSelected: {
    backgroundColor: 'rgba(6, 182, 212, 0.25)',
    borderColor: '#06B6D4',
    borderWidth: 2,
    shadowColor: '#06B6D4',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  hotspotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  hotspotInnerSelected: {
    backgroundColor: '#06B6D4',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectedPartsContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  selectedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#06B6D4',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quickListLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  searchBox: {
    marginBottom: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#2563EB',
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
