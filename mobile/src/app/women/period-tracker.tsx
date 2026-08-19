import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Droplets, ArrowLeft, Check } from 'lucide-react-native';
import { GlassCard, GlassButton, Chip } from '../../components/ui/Components';
import { useWomenStore } from '../../store/healthStore';

const symptomsList = ['Cramps', 'Headache', 'Bloating', 'Mood Swings', 'Fatigue', 'Acne', 'Back Pain', 'Cravings'];
const flowLevels = [
  { id: 'none', label: 'None', color: '#F1F5F9' },
  { id: 'light', label: 'Light', color: '#FBCFE8' },
  { id: 'medium', label: 'Medium', color: '#F472B6' },
  { id: 'heavy', label: 'Heavy', color: '#EC4899' }
];

export default function PeriodTracker() {
  const router = useRouter();
  const { cycleLength, lastPeriodStart, setLastPeriod, periodLog, logPeriodDay } = useWomenStore();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [flow, setFlow] = useState('none');
  const [saveStatus, setSaveStatus] = useState('');

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  useEffect(() => {
    if (selectedDate) {
      const existingLog = periodLog.find((log: any) => log.date === selectedDate);
      if (existingLog) {
        setFlow(existingLog.flow || 'none');
        setSelectedSymptoms(existingLog.symptoms || []);
      } else {
        setFlow('none');
        setSelectedSymptoms([]);
      }
    }
  }, [selectedDate, periodLog]);

  const periodDays = useMemo(() => {
    if (!lastPeriodStart) return new Set();
    const days = new Set();
    const start = new Date(lastPeriodStart);
    for (let cycle = -2; cycle < 12; cycle++) {
      const cycleStart = new Date(start);
      cycleStart.setDate(cycleStart.getDate() + (cycle * cycleLength));
      for (let i = 0; i < 5; i++) {
        const d = new Date(cycleStart);
        d.setDate(d.getDate() + i);
        days.add(d.toISOString().split('T')[0]);
      }
    }
    return days;
  }, [lastPeriodStart, cycleLength]);

  const ovulationDays = useMemo(() => {
    if (!lastPeriodStart) return new Set();
    const days = new Set();
    const start = new Date(lastPeriodStart);
    for (let cycle = -2; cycle < 12; cycle++) {
      const cycleStart = new Date(start);
      cycleStart.setDate(cycleStart.getDate() + (cycle * cycleLength) + Math.floor(cycleLength / 2));
      days.add(cycleStart.toISOString().split('T')[0]);
    }
    return days;
  }, [lastPeriodStart, cycleLength]);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const handleSaveLog = () => {
    logPeriodDay({
      date: selectedDate,
      flow: flow,
      symptoms: selectedSymptoms
    });
    setSaveStatus('Saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>CYCLE TRACKING</Text>
          <Text style={styles.title} numberOfLines={1}>Period Tracker</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.monthBtn}>
              <ChevronLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.monthBtn}>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.daysGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <View key={`day-${i}`} style={styles.dayCell}>
                <Text style={styles.dayLabel}>{d}</Text>
              </View>
            ))}
            
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}
            
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
              const isPeriod = periodDays.has(dateStr);
              const isOvulation = ovulationDays.has(dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isSelected = selectedDate === dateStr;

              return (
                <TouchableOpacity 
                  key={`date-${i}`} 
                  style={styles.dayCell}
                  onPress={() => setSelectedDate(dateStr)}
                >
                  <View style={[
                    styles.dateNumBox,
                    isPeriod && styles.dateNumBoxPeriod,
                    isOvulation && styles.dateNumBoxOvulation,
                    isSelected && styles.dateNumBoxSelected,
                    isToday && !isSelected && styles.dateNumBoxToday
                  ]}>
                    <Text style={[
                      styles.dateNumText,
                      isPeriod && styles.dateNumTextPeriod,
                      isOvulation && styles.dateNumTextOvulation,
                      (isSelected || isToday) && styles.dateNumTextBold,
                      isSelected && styles.dateNumTextSelected
                    ]}>
                      {i + 1}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FCE7F3', borderColor: '#EC4899' }]} />
              <Text style={styles.legendText}>Period</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E0F2FE', borderColor: '#0284C7' }]} />
              <Text style={styles.legendText}>Ovulation</Text>
            </View>
          </View>

          <GlassButton 
            variant="primary" 
            onPress={() => setLastPeriod(selectedDate || new Date().toISOString().split('T')[0])}
            style={styles.setPeriodBtn}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <CalendarIcon size={16} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                Set {selectedDate ? 'Selected Date' : 'Today'} as Period Start
              </Text>
            </View>
          </GlassButton>
          
          {lastPeriodStart && (
            <Text style={styles.lastPeriodText}>
              Last period start: <Text style={{ color: '#EC4899', fontWeight: '700' }}>{lastPeriodStart}</Text>
            </Text>
          )}
        </GlassCard>

        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.sectionHeading}>Log Daily Symptoms</Text>
          <View style={styles.chipContainer}>
            {symptomsList.map(s => (
              <Chip 
                key={s} 
                label={s} 
                active={selectedSymptoms.includes(s)} 
                onPress={() => toggleSymptom(s)} 
              />
            ))}
          </View>
        </GlassCard>

        <GlassCard hover={false} style={styles.card}>
          <View style={styles.flowHeader}>
            <Droplets size={16} color="#EC4899" />
            <Text style={styles.sectionHeading}>Flow Intensity</Text>
          </View>
          <View style={styles.flowGrid}>
            {flowLevels.map(f => {
              const isSelected = flow === f.id;
              return (
                <TouchableOpacity 
                  key={f.id} 
                  onPress={() => setFlow(f.id)}
                  style={[styles.flowItem, isSelected && styles.flowItemSelected]}
                >
                  <View style={[styles.flowDot, { backgroundColor: f.color }]} />
                  <Text style={[styles.flowText, isSelected && styles.flowTextSelected]}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        <View style={styles.bottomRow}>
          <GlassCard hover={false} style={styles.avgCard}>
            <Text style={styles.avgLabel}>CYCLE AVERAGE</Text>
            <Text style={styles.avgValue}>{cycleLength}</Text>
            <Text style={styles.avgUnit}>days</Text>
          </GlassCard>

          <View style={styles.saveContainer}>
            <GlassButton variant="primary" onPress={handleSaveLog} style={styles.saveBtn}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Save Daily Log</Text>
            </GlassButton>
            {saveStatus ? (
              <View style={styles.saveStatusBox}>
                <Check size={14} color="#10B981" />
                <Text style={styles.saveStatusText}>{saveStatus}</Text>
              </View>
            ) : <View style={{ height: 22 }} />}
          </View>
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
  calendarCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthBtn: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  dateNumBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateNumBoxPeriod: {
    backgroundColor: '#FCE7F3',
  },
  dateNumBoxOvulation: {
    backgroundColor: '#E0F2FE',
  },
  dateNumBoxSelected: {
    borderColor: '#EC4899',
    borderWidth: 2,
  },
  dateNumBoxToday: {
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  dateNumText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  dateNumTextPeriod: {
    color: '#EC4899',
  },
  dateNumTextOvulation: {
    color: '#0284C7',
  },
  dateNumTextBold: {
    fontWeight: '700',
  },
  dateNumTextSelected: {
    color: '#111827', // The web version keeps the original color based on period/ovulation but bold
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  setPeriodBtn: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
    marginTop: 20,
  },
  lastPeriodText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  flowItem: {
    flex: 1,
    minWidth: '20%',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    alignItems: 'center',
  },
  flowItemSelected: {
    backgroundColor: '#FCE7F3',
    borderColor: '#EC4899',
  },
  flowDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F472B6',
    marginBottom: 6,
  },
  flowText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  flowTextSelected: {
    color: '#BE185D',
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  avgCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 4,
  },
  avgValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#EC4899',
  },
  avgUnit: {
    fontSize: 12,
    color: '#6B7280',
  },
  saveContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  saveBtn: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
    paddingVertical: 16,
  },
  saveStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  saveStatusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  }
});
