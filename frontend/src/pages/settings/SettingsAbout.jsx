import { Info, Heart, Shield, ExternalLink, Sparkles } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';
import { useNavigate } from 'react-router-dom';
export default function SettingsAbout() {
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 600, margin: '0 auto' }}>
        <SectionHeader eyebrow="ABOUT" title="HealthGenie AI" subtitle="Your Personal Health Partner" />
        <GlassCard className="p-6" style={{ marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #00F5FF, #39FF14)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Sparkles size={32} color="#020510" />
          </div>
          <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700 }}>HealthGenie AI</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Version 1.0.0</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 12, lineHeight: 1.6 }}>
            An AI-powered personal healthcare companion combining cutting-edge artificial intelligence with comprehensive health tracking.
          </p>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {[
            { icon: Shield, label: 'Privacy Policy', color: '#00F5FF' },
            { icon: Info, label: 'Terms of Service', color: '#00F5FF' },
            { icon: Heart, label: 'Rate the App', color: '#FF6B35' },
          ].map(item => (
            <GlassCard key={item.label} className="p-4" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <item.icon size={18} style={{ color: item.color }} />
              <span style={{ flex: 1, fontSize: '0.9rem' }}>{item.label}</span>
              <ExternalLink size={14} style={{ color: 'var(--text-secondary)' }} />
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-4" style={{ marginBottom: 16 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Powered by HealthGenie AI Engine • Built with React + Vite
          </p>
        </GlassCard>

        <GlassButton variant="danger" fullWidth onClick={handleLogout}>Log Out</GlassButton>
      </div>
    </PageTransition>
  );
}
