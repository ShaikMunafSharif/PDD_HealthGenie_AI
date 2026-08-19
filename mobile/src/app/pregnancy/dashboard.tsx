import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Calendar, Apple, Dumbbell, Stethoscope, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';

const babySizes = ['Poppy seed', 'Sesame seed', 'Blueberry', 'Raspberry', 'Olive', 'Lime', 'Lemon', 'Peach', 'Apple', 'Avocado', 'Banana', 'Papaya', 'Mango', 'Eggplant', 'Coconut', 'Cauliflower', 'Butternut Squash', 'Cabbage', 'Pineapple', 'Honeydew', 'Cantaloupe', 'Lettuce', 'Napa Cabbage', 'Corn', 'Cucumber', 'Cauliflower', 'Romaine', 'Squash', 'Coconut', 'Honeydew', 'Cantaloupe', 'Pumpkin', 'Pineapple', 'Butternut', 'Honeydew', 'Jackfruit', 'Pumpkin', 'Watermelon', 'Winter Melon', 'Watermelon'];
const weekEmoji = ['🫘', '🫘', '🫐', '🫐', '🍓', '🍋', '🍋', '🍑', '🍎', '🥑', '🍌', '🥭', '🥭', '🍆', '🥥', '🥦', '🎃', '🥬', '🍍', '🍈', '🍈', '🥬', '🥬', '🌽', '🥒', '🥦', '🥬', '🎃', '🥥', '🍈', '🍈', '🎃', '🍍', '🎃', '🍈', '🍈', '🎃', '🍉', '🍉', '🍉'];

const modules = [
  { path: '/pregnancy/trimester', icon: Calendar, label: 'Trimester Overview', desc: 'Your pregnancy journey', icon2: '📅' },
  { path: '/pregnancy/weekly-tips', icon: Sparkles, label: 'Weekly Tips', desc: 'AI personalized guidance', icon2: '💡' },
  { path: '/pregnancy/diet', icon: Apple, label: 'Pregnancy Diet', desc: 'Trimester nutrition', icon2: '🥗' },
  { path: '/pregnancy/exercise', icon: Dumbbell, label: 'Safe Exercises', desc: 'Pregnancy workouts', icon2: '🧘' },
  { path: '/pregnancy/doctor-visits', icon: Stethoscope, label: 'Doctor Visits', desc: 'Appointment scheduler', icon2: '👩‍⚕️' },
];

export default function PregnancyDashboard() {
  const router = useRouter();
  
  // For demo purposes, we fix the week at 16. In reality this would come from a store.
  const week = 16;
  const trimester = week <= 12 ? 1 : week <= 26 ? 2 : 3;
  const progress = (week / 40) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>PREGNANCY CARE</Text>
          <Text style={styles.title} numberOfLines={1}>Pregnancy Journey</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.circleBox}>
              <Text style={styles.circleNumber}>{week}</Text>
              <Text style={styles.circleLabel}>WEEKS</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroInfoTitle}>Week {week} Progress</Text>
              <Text style={styles.heroInfoDesc}>Trimester {trimester} • {40 - week} weeks until estimated due date</Text>
            </View>
          </View>

          <View style={styles.babySizeRow}>
            <Text style={{ fontSize: 40 }}>{weekEmoji[week - 1] || '🍈'}</Text>
            <View>
              <Text style={styles.babySizeLabel}>Baby is currently the size of a</Text>
              <Text style={styles.babySizeValue}>{babySizes[week - 1] || 'Avocado'}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>T1</Text>
              <Text style={styles.progressLabel}>T2</Text>
              <Text style={styles.progressLabel}>T3</Text>
            </View>
            <View style={styles.progressBarBg}>
              <Animated.View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <GlassButton 
            onPress={() => router.push('/pregnancy/weekly-tips')} 
            style={styles.heroBtn}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.heroBtnText}>View This Week's Tips</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </View>
          </GlassButton>
        </GlassCard>

        <View style={styles.grid}>
          {modules.map((mod, i) => (
            <Animated.View key={mod.path} entering={FadeInUp.delay(200 + i * 50)} style={styles.gridItemWrapper}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(mod.path as any)}>
                <GlassCard hover={false} style={styles.gridItem}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemIconBox}>
                      <Text style={{ fontSize: 24 }}>{mod.icon2}</Text>
                    </View>
                    <Text style={styles.itemTitle}>{mod.label}</Text>
                  </View>
                  <Text style={styles.itemDesc}>{mod.desc}</Text>
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
  heroCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  circleBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#D97706',
    lineHeight: 32,
  },
  circleLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 1,
  },
  heroInfo: {
    flex: 1,
  },
  heroInfoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  heroInfoDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  babySizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF80',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  babySizeLabel: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '700',
  },
  babySizeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#FDE68A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  heroBtn: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  grid: {
    gap: 16,
    paddingBottom: 20,
  },
  gridItemWrapper: {
    width: '100%',
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  }
});
