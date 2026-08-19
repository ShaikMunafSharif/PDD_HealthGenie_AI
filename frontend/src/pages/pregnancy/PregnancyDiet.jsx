import React from 'react';
import { Apple, AlertTriangle } from 'lucide-react';
import { GlassCard, PageTransition, SectionHeader } from '../../components/ui/Components';

const foods = {
  eat: [{ name: 'Leafy Greens', benefit: 'Folate, iron, fiber', icon: '🥬' }, { name: 'Lean Protein', benefit: 'Baby growth, blood volume', icon: '🍗' }, { name: 'Whole Grains', benefit: 'Energy, fiber, B vitamins', icon: '🌾' }, { name: 'Dairy', benefit: 'Calcium for bone development', icon: '🥛' }, { name: 'Fruits', benefit: 'Vitamins, antioxidants', icon: '🍎' }, { name: 'Omega-3 Fish', benefit: 'Brain development', icon: '🐟' }],
  avoid: [{ name: 'Raw Fish/Sushi', reason: 'Risk of parasites', icon: '🍣' }, { name: 'Unpasteurized Dairy', reason: 'Listeria risk', icon: '🧀' }, { name: 'Raw Eggs', reason: 'Salmonella risk', icon: '🥚' }, { name: 'High-Mercury Fish', reason: 'Brain damage risk', icon: '⚠️' }, { name: 'Alcohol', reason: 'Fetal alcohol syndrome', icon: '🚫' }, { name: 'Excessive Caffeine', reason: 'Limit to 200mg/day', icon: '☕' }],
};

export default function PregnancyDiet() {
  return (
    <PageTransition>
      <div className="theme-pregnancy" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="NUTRITION" title="Pregnancy Diet" subtitle="Trimester-specific nutrition for you and baby" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <GlassCard className="p-6" style={{ borderColor: 'rgba(57,255,20,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Apple size={18} color="var(--neon-health)" /><h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--neon-health)' }}>Foods to Eat</h3></div>
            {foods.eat.map(f => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '1.3rem' }}>{f.icon}</span>
                <div><h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{f.name}</h4><p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{f.benefit}</p></div>
              </div>
            ))}
          </GlassCard>
          <GlassCard className="p-6" style={{ borderColor: 'rgba(255,107,53,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><AlertTriangle size={18} color="var(--neon-warn)" /><h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--neon-warn)' }}>Foods to Avoid</h3></div>
            {foods.avoid.map(f => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '1.3rem' }}>{f.icon}</span>
                <div><h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{f.name}</h4><p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{f.reason}</p></div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
