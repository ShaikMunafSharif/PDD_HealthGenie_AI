import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Plus, Phone, Trash2 } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { useEmergencyStore } from '../../store/healthStore';

export default function EmergencyContacts() {
  const router = useRouter();
  
  const contacts = useEmergencyStore((s: any) => s.contacts);
  const removeContact = useEmergencyStore((s: any) => s.removeContact);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <View>
            <Text style={styles.eyebrow}>EMERGENCY</Text>
            <Text style={styles.title}>Contacts</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/emergency/add-contact')}
          style={styles.addBtn}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        {contacts.length === 0 ? (
          <GlassCard hover={false} style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Phone size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No contacts yet</Text>
            <Text style={styles.emptyDesc}>Add emergency contacts for quick access during emergencies.</Text>
            <GlassButton variant="primary" onPress={() => router.push('/emergency/add-contact')} style={{ marginTop: 16 }}>
              Add Contact
            </GlassButton>
          </GlassCard>
        ) : (
          <View style={styles.list}>
            {contacts.map((c, i) => (
              <GlassCard key={c.id} hover={false} style={styles.contactCard}>
                <View style={[styles.avatarBox, c.isPrimary && styles.avatarBoxPrimary]}>
                  <Phone size={18} color={c.isPrimary ? '#EF4444' : '#2563EB'} />
                </View>
                
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactMeta}>{c.phone} • {c.type}</Text>
                </View>

                {!c.isPrimary && (
                  <TouchableOpacity onPress={() => removeContact(c.id)} style={styles.deleteBtn}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </GlassCard>
            ))}
          </View>
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
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarBoxPrimary: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  contactMeta: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
