import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Apple, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';

const foods = {
  eat: [
    { name: 'Leafy Greens', benefit: 'Folate, iron, fiber', icon: '🥬' }, 
    { name: 'Lean Protein', benefit: 'Baby growth, blood volume', icon: '🍗' }, 
    { name: 'Whole Grains', benefit: 'Energy, fiber, B vitamins', icon: '🌾' }, 
    { name: 'Dairy', benefit: 'Calcium for bone development', icon: '🥛' }, 
    { name: 'Fruits', benefit: 'Vitamins, antioxidants', icon: '🍎' }, 
    { name: 'Omega-3 Fish', benefit: 'Brain development', icon: '🐟' }
  ],
  avoid: [
    { name: 'Raw Fish/Sushi', reason: 'Risk of parasites', icon: '🍣' }, 
    { name: 'Unpasteurized Dairy', reason: 'Listeria risk', icon: '🧀' }, 
    { name: 'Raw Eggs', reason: 'Salmonella risk', icon: '🥚' }, 
    { name: 'High-Mercury Fish', reason: 'Brain damage risk', icon: '⚠️' }, 
    { name: 'Alcohol', reason: 'Fetal alcohol syndrome', icon: '🚫' }, 
    { name: 'Excessive Caffeine', reason: 'Limit to 200mg/day', icon: '☕' }
  ],
};

export default function PregnancyDiet() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>NUTRITION</Text>
          <Text style={styles.title} numberOfLines={1}>Pregnancy Diet</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={[styles.card, styles.eatCard]}>
          <View style={styles.cardHeader}>
            <Apple size={20} color="#10B981" />
            <Text style={[styles.cardTitle, { color: '#10B981' }]}>Foods to Eat</Text>
          </View>
          
          <View style={styles.list}>
            {foods.eat.map((f, index) => (
              <View key={f.name} style={[styles.listItem, index === foods.eat.length - 1 && styles.lastListItem]}>
                <Text style={{ fontSize: 24 }}>{f.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{f.name}</Text>
                  <Text style={styles.itemDesc}>{f.benefit}</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200)}>
        <GlassCard hover={false} style={[styles.card, styles.avoidCard]}>
          <View style={styles.cardHeader}>
            <AlertTriangle size={20} color="#F59E0B" />
            <Text style={[styles.cardTitle, { color: '#F59E0B' }]}>Foods to Avoid</Text>
          </View>
          
          <View style={styles.list}>
            {foods.avoid.map((f, index) => (
              <View key={f.name} style={[styles.listItem, index === foods.avoid.length - 1 && styles.lastListItem]}>
                <Text style={{ fontSize: 24 }}>{f.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{f.name}</Text>
                  <Text style={styles.itemDesc}>{f.reason}</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  eatCard: {
    borderColor: '#6EE7B7',
    borderWidth: 1,
  },
  avoidCard: {
    borderColor: '#FCD34D',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    gap: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    color: '#6B7280',
  }
});
