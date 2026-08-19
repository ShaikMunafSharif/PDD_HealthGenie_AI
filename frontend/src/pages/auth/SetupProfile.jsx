import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, Ruler, Weight, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

export default function SetupProfile() {
  const navigate = useNavigate();
  const updateProfile = useAuthStore(s => s.updateProfile);
  const user = useAuthStore(s => s.user);
  const [form, setForm] = useState({ name: user?.name || '', age: user?.age || '', gender: user?.gender || '', height: user?.height || '', weight: user?.weight || '' });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const bmi = form.height && form.weight ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 480 }}>
        <GlassCard className="p-8" hover={false}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>PROFILE SETUP</p>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Tell Us About Yourself</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GlassInput label="FULL NAME" icon={User} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <GlassInput label="AGE" icon={Calendar} type="number" value={form.age} onChange={e => update('age', e.target.value)} placeholder="25" />
              <div>
                <label className="text-eyebrow" style={{ display: 'block', marginBottom: 8 }}>GENDER</label>
                <select className="glass-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <GlassInput label="HEIGHT (CM)" icon={Ruler} type="number" value={form.height} onChange={e => update('height', e.target.value)} placeholder="170" />
              <GlassInput label="WEIGHT (KG)" icon={Weight} type="number" value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="70" />
            </div>
            {bmi && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 16, borderRadius: 12, background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.1)' }}>
                <span className="text-eyebrow">BMI</span>
                <span className="font-data" style={{ fontSize: '1.5rem', marginLeft: 12, color: bmi < 25 ? 'var(--neon-health)' : 'var(--neon-warn)' }}>{bmi}</span>
              </motion.div>
            )}
            <GlassButton variant="primary" fullWidth onClick={() => { updateProfile(form); navigate('/setup/medical-history'); }}>
              Continue <ArrowRight size={18} />
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
