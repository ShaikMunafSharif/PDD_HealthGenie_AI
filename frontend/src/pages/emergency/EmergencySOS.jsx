import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Siren, Phone } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition } from '../../components/ui/Components';
import { useEmergencyStore } from '../../store/healthStore';

export default function EmergencySOS() {
  const navigate = useNavigate();
  const { activateSOS, deactivateSOS, sosActive, contacts } = useEmergencyStore();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => { activateSOS(); setConfirmed(true); };
  const handleCancel = () => { deactivateSOS(); setConfirmed(false); navigate('/emergency'); };

  return (
    <PageTransition>
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {!confirmed ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: 440, width: '100%' }}>
            <GlassCard className="p-8" hover={false} style={{ textAlign: 'center', borderColor: 'rgba(255,107,53,0.4)', background: 'rgba(255,107,53,0.05)' }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}
                style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #FF0040)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(255,107,53,0.4)' }}>
                <AlertTriangle size={36} color="#fff" />
              </motion.div>
              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF6B35', marginBottom: 8 }}>Confirm SOS Alert</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This will notify all your emergency contacts with your current location. Are you sure?</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <GlassButton fullWidth onClick={handleCancel}><X size={16} /> Cancel</GlassButton>
                <GlassButton variant="danger" fullWidth onClick={handleConfirm}><Siren size={16} /> SEND SOS</GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: 440, width: '100%' }}>
            <GlassCard className="p-8" hover={false} style={{ textAlign: 'center', borderColor: 'rgba(255,107,53,0.5)' }}>
              <motion.div animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 20px rgba(255,0,64,0.4)', '0 0 60px rgba(255,0,64,0.8)', '0 0 20px rgba(255,0,64,0.4)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 80, height: 80, borderRadius: '50%', background: '#FF0040', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Siren size={36} color="#fff" />
              </motion.div>
              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF0040', marginBottom: 8 }}>SOS ACTIVE</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Emergency alert sent to {contacts.length} contacts</p>
              <div style={{ marginBottom: 20 }}>
                {contacts.slice(0, 3).map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 6 }}>
                    <Phone size={14} color="var(--neon-warn)" />
                    <span style={{ fontSize: '0.85rem' }}>{c.name} — Notified ✓</span>
                  </div>
                ))}
              </div>
              <GlassButton onClick={handleCancel} fullWidth><X size={16} /> Cancel SOS</GlassButton>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
