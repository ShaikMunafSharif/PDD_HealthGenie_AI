import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Siren, Phone, MapPin, Users, Activity, Shield } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useEmergencyStore } from '../../store/healthStore';

export default function EmergencyDashboard() {
  const navigate = useNavigate();
  const { contacts } = useEmergencyStore();

  return (
    <PageTransition>
      <div className="theme-emergency" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="SOS" title="Emergency Dashboard" subtitle="Quick emergency actions at your fingertips" />

        <motion.div whileTap={{ scale: 0.95 }} onClick={() => navigate('/emergency/sos-confirm')}
          style={{ marginBottom: 24, cursor: 'pointer' }}>
          <GlassCard className="p-10" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,0,64,0.08))', borderColor: 'rgba(255,107,53,0.4)' }}>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #FF0040)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(255,107,53,0.4)' }}>
              <Siren size={44} color="#fff" />
            </motion.div>
            <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FF6B35' }}>PRESS FOR SOS</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>This will alert your emergency contacts</p>
          </GlassCard>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <GlassCard className="p-5">
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color="var(--neon-warn)" /> Quick Contacts
            </h3>
            {contacts.slice(0, 3).map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={16} color="var(--neon-warn)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{c.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.phone}</p>
                </div>
                <GlassButton><Phone size={14} /></GlassButton>
              </div>
            ))}
            <GlassButton style={{ marginTop: 12 }} onClick={() => navigate('/emergency/contacts')}>View All</GlassButton>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="var(--neon-pulse)" /> Emergency Status
            </h3>
            {[
              { label: 'Location Sharing', status: 'Active', color: '#39FF14' },
              { label: 'Emergency Contacts', status: `${contacts.length} configured`, color: '#00F5FF' },
              { label: 'Medical ID', status: 'Set up', color: '#39FF14' },
              { label: 'Nearest Hospital', status: '0.8 km', color: '#FFB347' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                <span className="font-data" style={{ fontSize: '0.8rem', color: item.color }}>{item.status}</span>
              </div>
            ))}
            <GlassButton variant="primary" style={{ marginTop: 12 }} onClick={() => navigate('/emergency/hospitals')}>
              <MapPin size={14} /> Find Hospitals
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
