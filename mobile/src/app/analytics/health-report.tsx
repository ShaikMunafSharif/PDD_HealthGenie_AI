import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Download, Share2, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import { GlassCard, NeonButton } from '../../components/ui/Components';
import { useAuthStore, useHealthStore } from '../../store/healthStore';

export default function AnalyticsHealthReportScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { healthScore, categories, dailyStats } = useHealthStore();
  const [downloaded, setDownloaded] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `HealthGenie AI Medical Summary Report for ${user?.name || 'User'}:\nOverall Health Score: ${healthScore}/100\nDaily Steps: ${dailyStats.steps}\nWater Intake: ${dailyStats.water} ml\nGenerated on ${new Date().toLocaleDateString()}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Medical Summary Report</Text>
      </View>

      {/* Report Summary Card */}
      <GlassCard style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <FileText size={32} color="#00F5FF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || 'User Profile'}</Text>
            <Text style={styles.reportDate}>Generated on {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{healthScore}/100</Text>
            <Text style={styles.metricLabel}>Health Score</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{dailyStats.steps}</Text>
            <Text style={styles.metricLabel}>Avg Steps</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{dailyStats.water}ml</Text>
            <Text style={styles.metricLabel}>Daily Water</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{dailyStats.sleep}h</Text>
            <Text style={styles.metricLabel}>Avg Sleep</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.summaryTitle}>Executive AI Assessment</Text>
        <Text style={styles.summaryBody}>
          Patient demonstrates good baseline health parameters with a score of {healthScore}/100. Hydration and daily activity metrics remain compliant with baseline recommended targets. Continued monitoring of sleep hygiene is advised.
        </Text>
      </GlassCard>

      {/* Download / Share Actions */}
      <NeonButton
        text={downloaded ? "PDF Downloaded to Device ✓" : "Download PDF Report"}
        onClick={handleDownload}
        variant="primary"
        fullWidth
        icon={<Download size={18} color="#020510" />}
        style={{ marginBottom: 12 }}
      />

      <NeonButton
        text="Share Report with Doctor"
        onClick={handleShare}
        variant="secondary"
        fullWidth
        icon={<Share2 size={18} color="#00F5FF" />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#020510',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reportCard: {
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reportDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00F5FF',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#39FF14',
    marginBottom: 8,
  },
  summaryBody: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
});
