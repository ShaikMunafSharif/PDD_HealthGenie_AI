import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock, BarChart2, Repeat, FileText } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader, Chip } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';

const durations = ['Less than a day', '1-3 days', '3-7 days', '1-2 weeks', '2-4 weeks', 'More than a month'];
const frequencies = [
  { id: 'constant', label: 'Constant' },
  { id: 'frequent', label: 'Frequent' },
  { id: 'occasional', label: 'Occasional' },
  { id: 'rare', label: 'Rare' },
];

export default function SymptomDetails() {
  const navigate = useNavigate();
  const { severity, duration, frequency, additionalNotes, setSeverity, setDuration, setFrequency, setAdditionalNotes, selectedSymptoms, selectedBodyParts } = useSymptomStore();

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 740, margin: '0 auto' }}>
        <SectionHeader eyebrow="TRIAGE ASSESSMENT" title="Symptom Details" subtitle="Refine symptom timeline and clinical severity" />

        {/* Selected summary */}
        {(selectedSymptoms.length > 0 || selectedBodyParts.length > 0) && (
          <GlassCard className="p-4" style={{ marginBottom: 20, background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedSymptoms.map(s => <Chip key={s} label={s} active />)}
              {selectedBodyParts.map(s => <Chip key={s} label={s} active variant="danger" />)}
            </div>
          </GlassCard>
        )}

        {/* Duration */}
        <GlassCard className="p-6" style={{ marginBottom: 20, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Clock size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Onset & Duration</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {durations.map(d => (
              <motion.div key={d} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setDuration(d)}
                style={{
                  padding: '12px 10px', borderRadius: 14, textAlign: 'center', cursor: 'pointer', fontSize: '0.85rem', fontWeight: duration === d ? 700 : 500,
                  background: duration === d ? '#EFF6FF' : '#F8FAFC',
                  border: `1px solid ${duration === d ? '#2563EB' : '#E2E8F0'}`,
                  color: duration === d ? '#1E40AF' : '#4B5563',
                }}>
                {d}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Severity Slider */}
        <GlassCard className="p-6" style={{ marginBottom: 20, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <BarChart2 size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Discomfort & Pain Severity</h3>
            <span style={{ marginLeft: 'auto', fontSize: '1.25rem', color: severity <= 3 ? '#10B981' : severity <= 6 ? '#F59E0B' : '#EF4444', fontWeight: 800, fontFamily: 'Inter' }}>
              {severity}/10
            </span>
          </div>
          <input
            type="range" min="1" max="10" value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            style={{
              width: '100%', height: 8, borderRadius: 4, appearance: 'none',
              background: `linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #EF4444 100%)`,
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>1 - Mild / Annoying</span>
            <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>5 - Moderate</span>
            <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>10 - Unbearable</span>
          </div>
        </GlassCard>

        {/* Frequency */}
        <GlassCard className="p-6" style={{ marginBottom: 20, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Repeat size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Occurrence Frequency</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {frequencies.map(f => (
              <motion.div key={f.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setFrequency(f.id)}
                style={{
                  padding: 14, borderRadius: 14, textAlign: 'center', cursor: 'pointer', fontSize: '0.85rem', fontWeight: frequency === f.id ? 700 : 500,
                  background: frequency === f.id ? '#EFF6FF' : '#F8FAFC',
                  border: `1px solid ${frequency === f.id ? '#2563EB' : '#E2E8F0'}`,
                  color: frequency === f.id ? '#1E40AF' : '#4B5563',
                }}>
                {f.label}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Additional Notes */}
        <GlassCard className="p-6" style={{ marginBottom: 24, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <FileText size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Additional Medical Context</h3>
          </div>
          <textarea
            className="glass-input"
            rows={4}
            placeholder="Describe triggers, relieving factors, or pre-existing medical conditions..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            style={{ resize: 'vertical', background: '#F8FAFC', color: '#111827', border: '1px solid #E2E8F0', borderRadius: 14 }}
          />
        </GlassCard>

        <div style={{ display: 'flex', gap: 14 }}>
          <GlassButton onClick={() => navigate('/symptoms/select')} style={{ gap: 6 }}><ArrowLeft size={18} /> Back</GlassButton>
          <GlassButton variant="primary" fullWidth onClick={() => navigate('/symptoms/processing')} style={{ height: 48, fontWeight: 700 }}>
            Run Clinical AI Assessment <ArrowRight size={18} />
          </GlassButton>
        </div>
      </div>
    </PageTransition>
  );
}
