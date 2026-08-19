import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { GlassCard, GlassButton, Chip } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

const conditions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid', 'PCOS', 'Arthritis', 'Migraine', 'Anemia', 'Depression', 'Anxiety', 'None'];
const medications = ['Metformin', 'Amlodipine', 'Levothyroxine', 'Ibuprofen', 'Omeprazole', 'Vitamin D', 'Iron Supplement', 'Multivitamin', 'None'];

export default function SetupMedicalHistory() {
  const navigate = useNavigate();
  const updateProfile = useAuthStore(s => s.updateProfile);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const toggleC = (c) => setSelectedConditions(s => s.includes(c) ? s.filter(i => i !== c) : [...s, c]);
  const toggleM = (m) => setSelectedMeds(s => s.includes(m) ? s.filter(i => i !== m) : [...s, m]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 520 }}>
        <GlassCard className="p-8" hover={false}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>MEDICAL HISTORY</p>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Your Health Background</h1>
          
          <div style={{ marginBottom: 24 }}>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Chronic Conditions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {conditions.map(c => (<Chip key={c} label={c} active={selectedConditions.includes(c)} onClick={() => toggleC(c)} />))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Current Medications</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {medications.map(m => (<Chip key={m} label={m} active={selectedMeds.includes(m)} onClick={() => toggleM(m)} />))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <GlassButton onClick={() => navigate('/setup/profile')}><ArrowLeft size={18} /> Back</GlassButton>
            <GlassButton variant="primary" fullWidth onClick={() => { updateProfile({ conditions: selectedConditions, medications: selectedMeds }); navigate('/setup/allergies'); }}>
              Continue <ArrowRight size={18} />
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
