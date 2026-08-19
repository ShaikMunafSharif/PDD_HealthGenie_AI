import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Apple, Dumbbell, Stethoscope, Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader, ProgressRing } from '../../components/ui/Components';

const babySizes = ['Poppy seed', 'Sesame seed', 'Blueberry', 'Raspberry', 'Olive', 'Lime', 'Lemon', 'Peach', 'Apple', 'Avocado', 'Banana', 'Papaya', 'Mango', 'Eggplant', 'Coconut', 'Cauliflower', 'Butternut Squash', 'Cabbage', 'Pineapple', 'Honeydew', 'Cantaloupe', 'Lettuce', 'Napa Cabbage', 'Corn', 'Cucumber', 'Cauliflower', 'Romaine', 'Squash', 'Coconut', 'Honeydew', 'Cantaloupe', 'Pumpkin', 'Pineapple', 'Butternut', 'Honeydew', 'Jackfruit', 'Pumpkin', 'Watermelon', 'Winter Melon', 'Watermelon'];
const weekEmoji = ['🫘', '🫘', '🫐', '🫐', '🍓', '🍋', '🍋', '🍑', '🍎', '🥑', '🍌', '🥭', '🥭', '🍆', '🥥', '🥦', '🎃', '🥬', '🍍', '🍈', '🍈', '🥬', '🥬', '🌽', '🥒', '🥦', '🥬', '🎃', '🥥', '🍈', '🍈', '🎃', '🍍', '🎃', '🍈', '🍈', '🎃', '🍉', '🍉', '🍉'];

const modules = [
  { path: '/pregnancy/trimester', icon: Calendar, label: 'Trimester Overview', desc: 'Your pregnancy journey', icon2: '📅' },
  { path: '/pregnancy/weekly-tips', icon: Sparkles, label: 'Weekly Tips', desc: 'AI personalized guidance', icon2: '💡' },
  { path: '/pregnancy/diet', icon: Apple, label: 'Pregnancy Diet', desc: 'Trimester nutrition', icon2: '🥗' },
  { path: '/pregnancy/exercise', icon: Dumbbell, label: 'Safe Exercises', desc: 'Pregnancy workouts', icon2: '🧘' },
  { path: '/pregnancy/doctor-visits', icon: Stethoscope, label: 'Doctor Visits', desc: 'Appointment scheduler', icon2: '👩‍⚕️' },
];

export default function PregnancyDashboard() {
  const navigate = useNavigate();
  const week = 16;
  const trimester = week <= 12 ? 1 : week <= 26 ? 2 : 3;
  const progress = (week / 40) * 100;

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 1040, margin: '0 auto' }}>
        <SectionHeader eyebrow="PREGNANCY CARE" title="Your Pregnancy Journey" subtitle="Week by week development milestones and clinical guidance" />

        {/* Hero Card */}
        <GlassCard className="p-6" style={{ marginBottom: 24, borderRadius: 24, border: '1px solid #FDE68A', background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <ProgressRing value={week} max={40} size={130} strokeWidth={10} color="#F59E0B" bgColor="#FEF3C7">
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.9rem', color: '#D97706', fontWeight: 800, lineHeight: 1, fontFamily: 'Inter' }}>{week}</span>
                <p style={{ fontSize: '0.65rem', color: '#B45309', fontWeight: 700, letterSpacing: '0.05em', marginTop: 2 }}>WEEKS</p>
              </div>
            </ProgressRing>
            
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: 4, fontFamily: 'Inter' }}>Week {week} Progress</h3>
              <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: 12 }}>Trimester {trimester} • {40 - week} weeks until estimated due date</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>{weekEmoji[week - 1] || '🍈'}</span>
                <div>
                  <p style={{ color: '#D97706', fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>Baby is currently the size of a</p>
                  <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: '2px 0 0', fontFamily: 'Inter' }}>{babySizes[week - 1] || 'Avocado'}</p>
                </div>
              </div>
              
              <GlassButton variant="primary" onClick={() => navigate('/pregnancy/weekly-tips')} style={{ background: '#F59E0B', borderColor: '#F59E0B' }}>
                View This Week's Tips <ArrowRight size={16} />
              </GlassButton>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>Trimester 1 (W1-12)</span>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>Trimester 2 (W13-26)</span>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>Trimester 3 (W27-40)</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#FEF3C7' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5 }}
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #F59E0B, #D97706)' }} />
            </div>
          </div>
        </GlassCard>

        {/* Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {modules.map((mod, i) => (
            <motion.div key={mod.path} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard className="p-6" onClick={() => navigate(mod.path)} style={{ cursor: 'pointer', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.6rem' }}>{mod.icon2}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>{mod.label}</h3>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{mod.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
