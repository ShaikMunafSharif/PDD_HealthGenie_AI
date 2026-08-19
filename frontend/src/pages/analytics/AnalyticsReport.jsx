import React from 'react';
import { FileText, Download } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useHealthStore } from '../../store/healthStore';

export default function AnalyticsReport() {
  const { healthScore, categories, dailyStats } = useHealthStore();

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 840, margin: '0 auto' }}>
        <SectionHeader eyebrow="REPORT GENERATOR" title="Executive Health Summary" subtitle="Export your clinical health summary and performance report" />
        
        <GlassCard className="p-6" style={{ marginBottom: 24, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color="#2563EB" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Monthly Clinical Health Report</h3>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: '2px 0 0' }}>Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 16, fontFamily: 'Inter' }}>Key Performance Metrics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
              <div><span style={{ color: '#6B7280', fontSize: '0.82rem', fontWeight: 600 }}>Health Score Index</span><p style={{ fontSize: '1.6rem', color: '#2563EB', fontWeight: 800, margin: '4px 0 0', fontFamily: 'Inter' }}>{healthScore}/100</p></div>
              <div><span style={{ color: '#6B7280', fontSize: '0.82rem', fontWeight: 600 }}>Avg Daily Steps</span><p style={{ fontSize: '1.6rem', color: '#10B981', fontWeight: 800, margin: '4px 0 0', fontFamily: 'Inter' }}>{dailyStats.steps.toLocaleString()}</p></div>
              <div><span style={{ color: '#6B7280', fontSize: '0.82rem', fontWeight: 600 }}>Water Intake (Today)</span><p style={{ fontSize: '1.6rem', color: '#06B6D4', fontWeight: 800, margin: '4px 0 0', fontFamily: 'Inter' }}>{dailyStats.water} ml</p></div>
              <div><span style={{ color: '#6B7280', fontSize: '0.82rem', fontWeight: 600 }}>Avg Sleep Duration</span><p style={{ fontSize: '1.6rem', color: '#8B5CF6', fontWeight: 800, margin: '4px 0 0', fontFamily: 'Inter' }}>{dailyStats.sleep} hrs</p></div>
            </div>
            
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '24px 0 12px', fontFamily: 'Inter' }}>Category Breakdown Scores</h4>
            {Object.entries(categories).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                <span style={{ textTransform: 'capitalize', color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>{k}</span>
                <span style={{ color: v >= 70 ? '#10B981' : '#F59E0B', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Inter' }}>{v}/100</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassButton variant="primary" style={{ height: 44, padding: '0 20px', fontWeight: 700 }}>
          <Download size={16} /> Export Detailed Report as PDF
        </GlassButton>
      </div>
    </PageTransition>
  );
}
