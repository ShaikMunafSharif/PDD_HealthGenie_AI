import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Droplet } from 'lucide-react';
import { GlassCard, GlassButton, Chip, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const commonAllergies = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Penicillin', 'Aspirin', 'Latex', 'Pollen', 'Dust', 'None'];

export default function SetupAllergies() {
  const navigate = useNavigate();
  const { updateProfile, setSetupComplete } = useAuthStore();
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [customAllergy, setCustomAllergy] = useState('');
  const toggleA = (a) => setAllergies(s => s.includes(a) ? s.filter(i => i !== a) : [...s, a]);

  const addCustom = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies(s => [...s, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleFinish = () => {
    updateProfile({ bloodGroup, allergies });
    setSetupComplete();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#F8FAFC' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 540 }}>
        <GlassCard className="p-8" hover={false} style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>FINAL STEP 3 OF 3</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 24, fontFamily: 'Inter' }}>Blood Group & Medical Allergies</h1>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter' }}>
              <Droplet size={18} color="#EF4444" /> Blood Type
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {bloodGroups.map(bg => (
                <motion.div key={bg} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setBloodGroup(bg)}
                  style={{
                    padding: '14px 8px', borderRadius: 14, textAlign: 'center', cursor: 'pointer',
                    background: bloodGroup === bg ? '#FEF2F2' : '#F8FAFC',
                    border: `1px solid ${bloodGroup === bg ? '#EF4444' : '#E2E8F0'}`,
                    transition: 'all 0.2s',
                  }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: bloodGroup === bg ? '#DC2626' : '#4B5563', fontFamily: 'Inter' }}>{bg}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12, fontFamily: 'Inter' }}>Clinical Allergies & Sensitivities</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {commonAllergies.map(a => (<Chip key={a} label={a} active={allergies.includes(a)} onClick={() => toggleA(a)} variant="danger" />))}
              {allergies.filter(a => !commonAllergies.includes(a)).map(a => (
                <Chip key={a} label={a} active removable onRemove={() => toggleA(a)} variant="danger" />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <GlassInput placeholder="Add custom allergy (e.g. Latex)..." value={customAllergy} onChange={e => setCustomAllergy(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()} />
              <GlassButton onClick={addCustom} style={{ padding: '0 18px' }}>Add</GlassButton>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <GlassButton onClick={() => navigate('/setup/medical-history')} style={{ gap: 6 }}><ArrowLeft size={18} /> Back</GlassButton>
            <GlassButton variant="primary" fullWidth onClick={handleFinish} style={{ height: 48, fontWeight: 700, gap: 6 }}>
              <CheckCircle size={18} /> Complete Onboarding
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
