import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput, PageTransition } from '../../components/ui/Components';
import { useEmergencyStore } from '../../store/healthStore';

export default function EmergencyAddContact() {
  const navigate = useNavigate();
  const addContact = useEmergencyStore(s => s.addContact);
  const [form, setForm] = useState({ name: '', phone: '', type: 'family', relationship: '' });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    addContact(form);
    navigate('/emergency/contacts');
  };

  return (
    <PageTransition>
      <div className="theme-emergency" style={{ padding: '24px 24px 40px', maxWidth: 500, margin: '0 auto' }}>
        <GlassCard className="p-8" hover={false}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>EMERGENCY</p>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Add Contact</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GlassInput label="NAME" placeholder="Contact name" value={form.name} onChange={e => update('name', e.target.value)} />
            <GlassInput label="PHONE" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => update('phone', e.target.value)} />
            <GlassInput label="RELATIONSHIP" placeholder="e.g. Spouse, Parent, Friend" value={form.relationship} onChange={e => update('relationship', e.target.value)} />
            <div>
              <label className="text-eyebrow" style={{ display: 'block', marginBottom: 8 }}>TYPE</label>
              <select className="glass-select" value={form.type} onChange={e => update('type', e.target.value)}>
                <option value="family">Family</option><option value="friend">Friend</option><option value="doctor">Doctor</option><option value="emergency">Emergency Service</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <GlassButton onClick={() => navigate('/emergency/contacts')}><ArrowLeft size={16} /> Cancel</GlassButton>
              <GlassButton variant="primary" fullWidth onClick={handleSave}><UserPlus size={16} /> Save Contact</GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
