import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Phone, Users, Siren, ArrowRight, Shield } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';

const modules = [
  { path: '/emergency/dashboard', icon: Siren, label: 'SOS Dashboard', desc: 'Quick emergency actions', color: '#FF6B35' },
  { path: '/emergency/hospitals', icon: MapPin, label: 'Nearby Hospitals', desc: 'Find hospitals near you', color: '#FF0040' },
  { path: '/emergency/contacts', icon: Users, label: 'Emergency Contacts', desc: 'Manage your contacts', color: '#FFB347' },
];

export default function EmergencyHub() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="theme-emergency" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="EMERGENCY" title="Emergency Hub" subtitle="Quick access to emergency resources" />
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/emergency/sos-confirm')} style={{ marginBottom: 24, cursor: 'pointer' }}>
          <GlassCard className="p-8" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,0,64,0.1))', borderColor: 'rgba(255,107,53,0.4)' }}>
            <motion.div
              animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 30px rgba(255,107,53,0.3)', '0 0 60px rgba(255,107,53,0.6)', '0 0 30px rgba(255,107,53,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #FF0040)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Siren size={36} color="#fff" />
            </motion.div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--neon-warn)', marginBottom: 8 }}>SOS Emergency</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Tap to activate emergency alert</p>
          </GlassCard>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {modules.map((mod, i) => (
            <motion.div key={mod.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <GlassCard className="p-5" onClick={() => navigate(mod.path)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <mod.icon size={32} style={{ color: mod.color, margin: '0 auto 12px', display: 'block' }} />
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>{mod.label}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{mod.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="p-4" style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield size={20} color="var(--neon-pulse)" />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>Emergency services: Always dial <strong style={{ color: 'var(--neon-warn)' }}>108</strong> for life-threatening situations</p>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
