import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Ruler, Weight, Save, LogOut } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';


export default function SettingsProfile() {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', age: user?.age || '', gender: user?.gender || '', height: user?.height || '', weight: user?.weight || '' });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [saved, setSaved] = useState(false);
  const handleSave = () => { updateProfile(form); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 600, margin: '0 auto' }}>
        <SectionHeader eyebrow="SETTINGS" title="Edit Profile" subtitle="Update your personal information" />
        <GlassCard className="p-8" hover={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GlassInput label="FULL NAME" icon={User} value={form.name} onChange={e => update('name', e.target.value)} />
            <GlassInput label="EMAIL" icon={Mail} type="email" value={form.email} onChange={e => update('email', e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <GlassInput label="AGE" icon={Calendar} type="number" value={form.age} onChange={e => update('age', e.target.value)} />
              <div><label className="text-eyebrow" style={{ display: 'block', marginBottom: 8 }}>GENDER</label>
                <select className="glass-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <GlassInput label="HEIGHT (CM)" icon={Ruler} type="number" value={form.height} onChange={e => update('height', e.target.value)} />
              <GlassInput label="WEIGHT (KG)" icon={Weight} type="number" value={form.weight} onChange={e => update('weight', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <GlassButton variant="primary" fullWidth onClick={handleSave}>
                <Save size={16} style={{ marginRight: 8 }} /> {saved ? 'Saved ✓' : 'Save Changes'}
              </GlassButton>
              <GlassButton variant="danger" fullWidth onClick={handleLogout}>
                <LogOut size={16} style={{ marginRight: 8 }} /> Log Out
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
