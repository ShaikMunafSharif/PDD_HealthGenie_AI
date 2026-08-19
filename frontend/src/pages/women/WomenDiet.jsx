import React, { useMemo } from 'react';
import { Apple, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader, ProgressRing } from '../../components/ui/Components';
import { useWomenStore, useAuthStore } from '../../store/healthStore';

const nutrients = [
  { name: 'Iron', current: 12, target: 18, unit: 'mg', color: '#FF6B35', foods: ['Spinach', 'Red meat', 'Lentils', 'Chickpeas'] },
  { name: 'Calcium', current: 800, target: 1000, unit: 'mg', color: '#00F5FF', foods: ['Milk', 'Yogurt', 'Broccoli', 'Almonds'] },
  { name: 'Folate', current: 300, target: 400, unit: 'mcg', color: '#39FF14', foods: ['Leafy greens', 'Avocado', 'Oranges', 'Beans'] },
  { name: 'Vitamin D', current: 500, target: 600, unit: 'IU', color: '#FFB347', foods: ['Eggs', 'Fatty fish', 'Fortified milk', 'Sunlight'] },
];

export default function WomenDiet() {
  const { periodLog } = useWomenStore();
  const { user } = useAuthStore();

  // Calculate BMI from user profile
  const weightNum = parseFloat(user?.weight);
  const heightNum = parseFloat(user?.height);
  const bmi = (weightNum && heightNum) ? (weightNum / ((heightNum / 100) ** 2)) : null;

  // Calculate dynamic, personalized nutrition recommendations
  const dynamicNutritionTip = useMemo(() => {
    const allLoggedSymptoms = new Set();
    periodLog.forEach(log => {
      if (log.symptoms) {
        log.symptoms.forEach(s => allLoggedSymptoms.add(s.toLowerCase()));
      }
    });

    let tipText = "";
    
    if (allLoggedSymptoms.has('cramps')) {
      tipText += "Since you logged cramps, prioritize magnesium-rich foods (dark chocolate, almonds, spinach) and potassium (bananas) to help relax uterine muscles and reduce spasms. ";
    }
    if (allLoggedSymptoms.has('fatigue')) {
      tipText += "To combat fatigue, prioritize complex carbs and iron-rich meals paired with Vitamin C to optimize absorption and restore cellular energy levels. ";
    }
    if (allLoggedSymptoms.has('acne')) {
      tipText += "To help manage hormonal breakouts and acne, consider cutting down on dairy and refined sugars, replacing them with antioxidant-rich berries and omega-3 fatty acids. ";
    }
    if (allLoggedSymptoms.has('bloating')) {
      tipText += "To ease bloating, minimize high-sodium foods and include natural water-balancing foods like cucumber, celery, and fennel tea. ";
    }

    if (bmi && bmi >= 25) {
      tipText += `With a BMI of ${bmi.toFixed(1)}, focusing on high-fiber, low-GI foods is highly recommended to improve insulin sensitivity and support weight management. `;
    } else if (bmi && bmi < 25) {
      tipText += `For your lean profile (BMI: ${bmi.toFixed(1)}), ensure you get sufficient healthy fats (avocado, nuts, seeds) to support healthy hormone synthesis and regular ovulation. `;
    }

    if (user?.activityLevel === 'active') {
      tipText += "Given your active routine, make sure to refuel with premium protein and calcium-dense foods to protect bone density and speed muscle recovery. ";
    }

    if (!tipText) {
      tipText = "Your iron intake is below the recommended daily target. Make sure to include more spinach and legumes in your meals, especially during your menstrual cycle when iron loss is higher. Pairing iron sources with vitamin C enhances absorption.";
    }

    return tipText;
  }, [periodLog, user, bmi]);

  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="NUTRITION" title="Women's Nutrition Guide" subtitle="Essential nutrients for women's health" />

        {/* Profile Metrics Summary Panel */}
        {user?.age && (
          <GlassCard className="p-4" style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(191,95,255,0.15)' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Age: <strong style={{ color: 'var(--text-primary)' }}>{user.age} yrs</strong></span>
              <span>Height: <strong style={{ color: 'var(--text-primary)' }}>{user.height} cm</strong></span>
              <span>Weight: <strong style={{ color: 'var(--text-primary)' }}>{user.weight} kg</strong></span>
              {bmi && <span>BMI: <strong style={{ color: 'var(--neon-fem)' }}>{bmi.toFixed(1)} ({bmi >= 25 ? 'Overweight' : 'Normal/Lean'})</strong></span>}
              <span>Activity: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{user.activityLevel}</strong></span>
              <span>Goal: <strong style={{ color: 'var(--neon-fem)', textTransform: 'capitalize' }}>{user.goal} weight</strong></span>
            </div>
          </GlassCard>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
          {nutrients.map((n, i) => (
            <motion.div key={n.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-5" style={{ textAlign: 'center' }}>
                <ProgressRing value={n.current} max={n.target} size={80} strokeWidth={6} color={n.color}>
                  <span className="font-data" style={{ fontSize: '0.7rem', color: n.color }}>{Math.round(n.current / n.target * 100)}%</span>
                </ProgressRing>
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginTop: 12, marginBottom: 4 }}>{n.name}</h3>
                <p className="font-data" style={{ color: n.color, fontSize: '0.85rem' }}>{n.current}/{n.target} {n.unit}</p>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                  {n.foods.map(f => <span key={f} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: `${n.color}10`, color: n.color, border: `1px solid ${n.color}20` }}>{f}</span>)}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        
        <GlassCard className="p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} color="var(--neon-fem)" />
            <span className="text-eyebrow" style={{ color: 'var(--neon-fem)' }}>AI TIPS</span>
          </div>
          <p style={{ lineHeight: 1.7, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {dynamicNutritionTip}
          </p>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
