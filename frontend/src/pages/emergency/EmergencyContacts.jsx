import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Phone, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, PageTransition, SectionHeader, EmptyState } from '../../components/ui/Components';
import { useEmergencyStore } from '../../store/healthStore';

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const { contacts, removeContact } = useEmergencyStore();

  return (
    <PageTransition>
      <div className="theme-emergency" style={{ padding: '24px 24px 40px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div><p className="text-eyebrow" style={{ marginBottom: 4 }}>EMERGENCY</p><h1 className="text-section">Emergency Contacts</h1></div>
          <GlassButton variant="primary" onClick={() => navigate('/emergency/add-contact')}><Plus size={16} /> Add Contact</GlassButton>
        </div>
        {contacts.length === 0 ? (
          <EmptyState icon={Phone} title="No contacts yet" description="Add emergency contacts for quick access during emergencies" action="Add Contact" onAction={() => navigate('/emergency/add-contact')} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {contacts.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-4" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: c.isPrimary ? 'rgba(255,107,53,0.15)' : 'rgba(0,245,255,0.08)', border: `1px solid ${c.isPrimary ? 'rgba(255,107,53,0.3)' : 'rgba(0,245,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} color={c.isPrimary ? 'var(--neon-warn)' : 'var(--neon-pulse)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{c.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.phone} • {c.type || 'Personal'}</p>
                  </div>
                  {!c.isPrimary && (
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeContact(c.id)}
                      style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 10, padding: 8, cursor: 'pointer' }}>
                      <Trash2 size={16} color="var(--neon-warn)" />
                    </motion.button>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 20 }}><GlassButton onClick={() => navigate('/emergency')}><ArrowLeft size={16} /> Back</GlassButton></div>
      </div>
    </PageTransition>
  );
}
