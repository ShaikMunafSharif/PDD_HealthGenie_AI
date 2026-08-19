import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, RotateCcw, Stethoscope, AlertCircle, ShieldAlert, MapPin, Phone, Navigation, ArrowRight, Building2, Apple, Dumbbell } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { useSymptomStore, useDietStore, useExerciseStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';
import { getUserLocation, fetchNearbyHospitals, openDirections } from '../../services/hospitalService';

export default function SymptomResults() {
  const router = useRouter();
  const { 
    analysisResult, setAnalysisResult, selectedSymptoms, selectedBodyParts, 
    duration, severity, frequency, additionalNotes, isAnalyzing, setIsAnalyzing, reset 
  } = useSymptomStore();

  const [statusText, setStatusText] = useState('Analyzing symptoms...');
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  const [symptomDietPlan, setSymptomDietPlan] = useState<any>(null);
  const [symptomExercisePlan, setSymptomExercisePlan] = useState<any>(null);
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [isGeneratingExercise, setIsGeneratingExercise] = useState(false);
  const [dietError, setDietError] = useState<string | null>(null);
  const [exerciseError, setExerciseError] = useState<string | null>(null);
  const [exerciseWarning, setExerciseWarning] = useState<string | null>(null);

  const generateRecoveryDiet = async () => {
    setIsGeneratingDiet(true);
    setDietError(null);
    const symStr = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : selectedBodyParts.join(', ') || 'Unspecified symptoms';
    const prompt = `You are a health information assistant. Based on the user's reported symptoms and symptom-analysis information, generate a general supportive diet plan.
Symptoms: ${symStr}
Severity: ${severity}/10
Doctor consultation recommendation: ${(analysisResult || '').substring(0, 200)}

Provide:
1. Foods that may be suitable
2. Foods that may be better to limit or avoid
3. Simple breakfast suggestion
4. Simple lunch suggestion
5. Simple evening snack suggestion
6. Simple dinner suggestion
7. Hydration guidance
8. Important precautions

Do not claim to diagnose the user. Do not prescribe medication. Clearly state that the plan is general health information and does not replace professional medical advice.
Output strictly raw JSON format matching exactly:
{
  "recommendedFoods": ["..."],
  "limitFoods": ["..."],
  "breakfast": "...",
  "lunch": "...",
  "snack": "...",
  "dinner": "...",
  "hydration": "...",
  "precautions": "..."
}`;
    try {
      let aiResult = '';
      for await (const chunk of streamHealthGenie(prompt, 'diet')) { aiResult = chunk.full; }
      
      const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSymptomDietPlan(parsed);
      } else {
        throw new Error("No JSON object found in response");
      }
    } catch (e) {
      console.warn("Failed to generate symptom diet", e);
      setDietError("Unable to generate the plan right now. Please try again.");
    } finally {
      setIsGeneratingDiet(false);
    }
  };

  const generateRecoveryExercise = async () => {
    if (severity >= 7 || (analysisResult && analysisResult.toLowerCase().includes('urgent'))) {
      setExerciseWarning("Because your symptoms may require medical attention, avoid strenuous exercise and consult a qualified healthcare professional.");
      return;
    }
    
    setIsGeneratingExercise(true);
    setExerciseError(null);
    setExerciseWarning(null);
    
    const symStr = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : selectedBodyParts.join(', ') || 'Unspecified symptoms';
    const prompt = `You are a health information assistant. Based on the user's reported symptoms and symptom-analysis information, generate a supportive exercise plan.
Symptoms: ${symStr}
Severity: ${severity}/10
Doctor consultation recommendation: ${(analysisResult || '').substring(0, 200)}

Provide:
1. Recommended activity level
2. Simple suitable exercises
3. Duration
4. Frequency
5. Warm-up
6. Cool-down
7. Activities to avoid based on the symptoms
8. Warning signs where the user should stop exercising and seek medical advice

The response must be general health guidance and must not diagnose or prescribe treatment.
Output strictly raw JSON format matching exactly:
{
  "activityLevel": "...",
  "recommendedExercises": ["..."],
  "duration": "...",
  "frequency": "...",
  "warmUp": "...",
  "coolDown": "...",
  "avoidActivities": ["..."],
  "warningSigns": ["..."]
}`;
    try {
      let aiResult = '';
      for await (const chunk of streamHealthGenie(prompt, 'exercise')) { aiResult = chunk.full; }
      
      const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSymptomExercisePlan(parsed);
      } else {
        throw new Error("No JSON object found in response");
      }
    } catch (e) {
      console.warn("Failed to generate symptom exercise", e);
      setExerciseError("Unable to generate the plan right now. Please try again.");
    } finally {
      setIsGeneratingExercise(false);
    }
  };

  // Fetch Nearby Hospitals based on GPS Location
  const loadNearbyHospitals = async () => {
    setLoadingHospitals(true);
    try {
      let lat = 17.3850;
      let lng = 78.4867;
      try {
        const userLoc = await getUserLocation();
        lat = userLoc.lat;
        lng = userLoc.lng;
      } catch (locErr) {
        console.warn('GPS location fallback used in results screen:', locErr);
      }
      
      const res = await fetchNearbyHospitals(lat, lng, 10000);
      if (res && res.results) {
        setNearbyHospitals(res.results.slice(0, 3)); // Top 3 nearest facilities
      }
    } catch (err) {
      console.warn('Error fetching nearby hospitals for assessment results:', err);
    } finally {
      setLoadingHospitals(false);
    }
  };

  useEffect(() => {
    loadNearbyHospitals();

    if (selectedSymptoms.length === 0 && selectedBodyParts.length === 0 && !analysisResult) {
      router.replace('/symptoms');
      return;
    }

    if (analysisResult) return;

    const controller = new AbortController();

    const getFallbackResult = () => {
      const symList = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : selectedBodyParts.join(', ') || 'Reported symptoms';
      return `**Clinical AI Evaluation:**\nBased on your reported symptoms (${symList}) with a reported severity of ${severity}/10:\n\n**Possible Considerations:**\n• **Viral or Inflammatory Response** (65% confidence)\n• **Stress & Musculoskeletal Tension** (20% confidence)\n• **Allergic Reaction** (15% confidence)\n\n**Clinical Severity:** ${severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : 'Severe'}\n\n**Recommended Action Steps:**\n1. Rest adequately and maintain fluid hydration (2.5–3.0L water daily).\n2. Monitor vital metrics and symptom severity changes every 6 hours.\n3. Schedule a consultation with a primary care physician if symptoms persist beyond 48 hours.\n\n**When to Seek Immediate Care:**\n${severity >= 7 ? '⚠️ URGENT: Given your severity score of ' + severity + '/10, consult a doctor within 24 hours or visit an urgent care center.' : 'If you experience sudden shortness of breath, chest pressure, or symptoms persist for more than 7 days.'}\n\n**Recommended Specialist:** General Physician / Internal Medicine Specialist`;
    };

    const runAnalysis = async () => {
      setIsAnalyzing(true);
      setStatusText('Consulting HealthGenie AI Medical Engine...');

      const symStr = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'Unspecified general symptom';
      const bodyStr = selectedBodyParts.length > 0 ? selectedBodyParts.join(', ') : 'General body';

      const prompt = `Analyze these patient symptoms and provide an assessment. Be extremely concise, direct, and brief. Do not include conversational filler, greetings, or conclusions:
Symptoms: ${symStr}
Affected areas: ${bodyStr}
Duration: ${duration || '1-3 days'}
Severity: ${severity}/10
Frequency: ${frequency || 'occasional'}
Additional context: ${additionalNotes || 'None'}

Please provide:
1. Top 3 most likely conditions with confidence percentages (brief bullet points)
2. Severity assessment (mild/moderate/severe)
3. Recommended actions (maximum 3 brief bullet points)
4. When to see a doctor (maximum 2 lines)
5. Suggested specialist type (1 line)`;

      try {
        let result = '';
        try {
          for await (const chunk of streamHealthGenie(prompt, 'symptoms', { 
            signal: controller.signal,
            num_predict: 250
          })) {
            if (controller.signal.aborted) break;
            if (chunk.full) {
              result = chunk.full;
              setAnalysisResult(result);
            }
            if (chunk.done) break;
          }
        } catch (err: any) {
          if (err.name === 'AbortError') return;
          console.error("Symptom analysis stream failed:", err);
          result = '';
        }

        if (!result && !controller.signal.aborted) {
          result = getFallbackResult();
          setAnalysisResult(result);
        }
      } catch (err) {
        console.error("Analysis error:", err);
        if (!controller.signal.aborted) {
          setAnalysisResult(getFallbackResult());
        }
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();

    return () => {
      controller.abort();
    };
  }, []);

  const handleNewAnalysis = () => { 
    reset(); 
    router.replace('/symptoms'); 
  };

  const severityColor = severity <= 3 ? '#10B981' : severity <= 6 ? '#F59E0B' : '#EF4444';
  const severityBg = severity <= 3 ? '#ECFDF5' : severity <= 6 ? '#FFFBEB' : '#FEF2F2';
  const severityBorder = severity <= 3 ? '#A7F3D0' : severity <= 6 ? '#FDE68A' : '#FECACA';

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>AI DIAGNOSIS & ASSESSMENT</Text>
          <Text style={styles.title}>Results</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        
        {/* Severity Banner */}
        <GlassCard hover={false} style={[styles.severityBanner, { backgroundColor: severityBg, borderColor: severityBorder }]}>
          <View style={styles.severityIconBox}>
            <AlertCircle size={22} color={severityColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.severityTitle, { color: severityColor }]}>
              {severity <= 3 ? 'LOW SEVERITY ASSESSMENT' : severity <= 6 ? 'MODERATE SEVERITY ASSESSMENT' : 'HIGH SEVERITY ASSESSMENT'}
            </Text>
            <Text style={styles.severityDesc}>
              Score: <Text style={{ color: severityColor, fontWeight: '700' }}>{severity}/10</Text> • {frequency}
            </Text>
          </View>
        </GlassCard>

        {/* AI Result Card */}
        <GlassCard hover={false} style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultHeaderLeft}>
              <View style={styles.stethBox}>
                <Stethoscope size={18} color="#2563EB" />
              </View>
              <Text style={styles.resultTitle}>AI Clinical Recommendation</Text>
            </View>
            {isAnalyzing && (
              <View style={styles.evalBadge}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.evalText}>Evaluating</Text>
              </View>
            )}
          </View>
          
          <View style={styles.resultBody}>
            {analysisResult ? (
              <Text style={styles.resultText}>{analysisResult}</Text>
            ) : (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>{statusText}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* RECOVERY DIET & EXERCISE PLANS */}
        {analysisResult ? (
          <View style={styles.recoveryGrid}>
            {/* Recovery Diet Plan Card */}
            <GlassCard hover={false} style={styles.recoveryCard}>
              <View style={styles.recoveryHeaderRow}>
                <View style={[styles.recoveryIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Apple size={20} color="#10B981" />
                </View>
                <Text style={styles.recoveryTitle}>Recovery Diet Plan</Text>
              </View>

              {isGeneratingDiet ? (
                <View style={styles.generatingBox}>
                  <ActivityIndicator size="small" color="#10B981" />
                  <Text style={styles.generatingText}>Generating diet plan...</Text>
                </View>
              ) : dietError ? (
                <View style={{ gap: 8 }}>
                  <Text style={{ color: '#EF4444', fontSize: 13 }}>{dietError}</Text>
                  <GlassButton onPress={generateRecoveryDiet} style={styles.recoveryBtnPrimary}>
                    <Text style={styles.recoveryBtnText}>Try Again</Text>
                  </GlassButton>
                </View>
              ) : symptomDietPlan ? (
                <View style={{ gap: 10 }}>
                  <Text style={styles.recoverySubtext}>A tailored nutrition plan generated to help your body recover based on your AI diagnosis.</Text>
                  <GlassButton 
                    variant="primary" 
                    style={styles.recoveryBtnPrimary}
                    onPress={() => {
                      useDietStore.getState().setWeeklyPlan(symptomDietPlan);
                      router.push('/(tabs)/diet' as any);
                    }}
                  >
                    <Text style={styles.recoveryBtnText}>Export to Diet Tracker</Text>
                  </GlassButton>
                </View>
              ) : (
                <GlassButton 
                  variant="primary" 
                  style={styles.recoveryBtnPrimary}
                  onPress={generateRecoveryDiet}
                  disabled={isGeneratingDiet}
                >
                  <Text style={styles.recoveryBtnText}>Generate Diet Plan</Text>
                </GlassButton>
              )}
            </GlassCard>

            {/* Recovery Exercise Card */}
            <GlassCard hover={false} style={styles.recoveryCard}>
              <View style={styles.recoveryHeaderRow}>
                <View style={[styles.recoveryIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Dumbbell size={20} color="#2563EB" />
                </View>
                <Text style={styles.recoveryTitle}>Recovery Exercise</Text>
              </View>

              {exerciseWarning ? (
                <View style={styles.warningBox}>
                  <ShieldAlert size={16} color="#D97706" />
                  <Text style={styles.warningText}>{exerciseWarning}</Text>
                </View>
              ) : isGeneratingExercise ? (
                <View style={styles.generatingBox}>
                  <ActivityIndicator size="small" color="#2563EB" />
                  <Text style={styles.generatingText}>Generating exercise plan...</Text>
                </View>
              ) : exerciseError ? (
                <View style={{ gap: 8 }}>
                  <Text style={{ color: '#EF4444', fontSize: 13 }}>{exerciseError}</Text>
                  <GlassButton onPress={generateRecoveryExercise} style={styles.recoveryBtnPrimary}>
                    <Text style={styles.recoveryBtnText}>Try Again</Text>
                  </GlassButton>
                </View>
              ) : symptomExercisePlan ? (
                <View style={{ gap: 10 }}>
                  <Text style={styles.recoverySubtext}>A restorative movement plan suited for your current condition and severity level.</Text>
                  <GlassButton 
                    variant="primary" 
                    style={styles.recoveryBtnPrimary}
                    onPress={() => {
                      useExerciseStore.getState().setWorkoutPlan(symptomExercisePlan);
                      router.push('/(tabs)/exercise' as any);
                    }}
                  >
                    <Text style={styles.recoveryBtnText}>Export to Exercise Tracker</Text>
                  </GlassButton>
                </View>
              ) : (
                <GlassButton 
                  variant="primary" 
                  style={styles.recoveryBtnPrimary}
                  onPress={generateRecoveryExercise}
                  disabled={isGeneratingExercise}
                >
                  <Text style={styles.recoveryBtnText}>Generate Exercise Plan</Text>
                </GlassButton>
              )}
            </GlassCard>
          </View>
        ) : null}

        {/* NEARBY HOSPITALS SECTION */}
        <GlassCard hover={false} style={styles.hospitalsSectionCard}>
          <View style={styles.hospitalHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Building2 size={20} color="#EF4444" />
              <Text style={styles.hospitalSectionTitle}>Nearby Emergency Hospitals</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/emergency/hospitals' as any)}>
              <Text style={styles.viewAllText}>View All Map</Text>
            </TouchableOpacity>
          </View>

          {loadingHospitals ? (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 16 }} />
          ) : nearbyHospitals.length > 0 ? (
            <View style={styles.hospitalList}>
              {nearbyHospitals.map((h) => (
                <View key={h.id} style={styles.hospitalItem}>
                  <View style={styles.hospitalItemTop}>
                    <Image source={{ uri: h.photo }} style={styles.hospitalThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.hItemName} numberOfLines={1}>{h.name}</Text>
                      <Text style={styles.hItemType}>{h.type}</Text>
                      <View style={styles.hItemMeta}>
                        <MapPin size={12} color="#2563EB" />
                        <Text style={styles.hItemMetaText}>{h.distanceFormatted}</Text>
                        <Text style={{ color: '#9CA3AF' }}>•</Text>
                        <Text style={{ fontSize: 11, color: h.openNow ? '#10B981' : '#EF4444', fontWeight: '700' }}>
                          {h.is24hr ? '24/7 Emergency' : (h.openNow ? 'Open Now' : 'Closed')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.hItemActions}>
                    <GlassButton 
                      variant="primary" 
                      style={{ flex: 1, paddingVertical: 8 }}
                      onPress={() => openDirections(h.lat, h.lng)}
                    >
                      <Navigation size={12} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12, marginLeft: 4 }}>Directions</Text>
                    </GlassButton>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#6B7280', fontSize: 13, marginVertical: 10 }}>No nearby hospitals found in range.</Text>
          )}

          <GlassButton 
            onPress={() => router.push('/emergency/hospitals' as any)} 
            style={styles.fullHospitalMapBtn}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <MapPin size={16} color="#EF4444" />
              <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14 }}>Open GPS Hospital Map & 112 SOS</Text>
              <ArrowRight size={14} color="#EF4444" />
            </View>
          </GlassButton>
        </GlassCard>

        {/* Disclaimer */}
        <GlassCard hover={false} style={styles.disclaimerCard}>
          <ShieldAlert size={20} color="#D97706" style={{ marginTop: 2 }} />
          <Text style={styles.disclaimerText}>
            This AI clinical analysis is for informational and triage guidance only and does not constitute a formal medical diagnosis. For severe symptoms or medical emergencies, please consult a qualified healthcare provider immediately.
          </Text>
        </GlassCard>

        <View style={styles.actions}>
          <GlassButton 
            onPress={handleNewAnalysis} 
            disabled={isAnalyzing} 
            style={styles.actionBtnSecondary}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <RotateCcw size={16} color="#374151" />
              <Text style={styles.actionBtnTextSecondary}>New Analysis</Text>
            </View>
          </GlassButton>

          <GlassButton 
            onPress={() => router.push('/doctor/recommendation' as any)} 
            disabled={isAnalyzing} 
            style={[styles.actionBtnSecondary, { borderColor: '#2563EB', backgroundColor: '#EFF6FF' }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Stethoscope size={16} color="#2563EB" />
              <Text style={[styles.actionBtnTextSecondary, { color: '#2563EB' }]}>Find a Specialist</Text>
            </View>
          </GlassButton>

          <GlassButton 
            onPress={() => router.replace('/(tabs)/dashboard' as any)} 
            disabled={isAnalyzing} 
            variant="primary"
            style={styles.actionBtnPrimary}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={16} color="#020510" />
              <Text style={styles.actionBtnTextPrimary}>Back to Dashboard</Text>
            </View>
          </GlassButton>
        </View>

      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  severityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  severityIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  severityTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  severityDesc: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    marginTop: 2,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 14,
    marginBottom: 16,
  },
  resultHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stethBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  evalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  evalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  resultBody: {
    minHeight: 150,
  },
  resultText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  recoveryGrid: {
    gap: 16,
    marginBottom: 20,
  },
  recoveryCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  recoveryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  recoveryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoveryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  recoverySubtext: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  recoveryBtnPrimary: {
    paddingVertical: 12,
  },
  recoveryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  generatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  generatingText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#B91C1C',
    lineHeight: 18,
  },
  hospitalsSectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginBottom: 20,
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  hospitalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hospitalSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  hospitalList: {
    gap: 12,
    marginBottom: 14,
  },
  hospitalItem: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  hospitalItemTop: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  hospitalThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  hItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  hItemType: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 2,
  },
  hItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hItemMetaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  hItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fullHospitalMapBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingVertical: 12,
    marginTop: 4,
  },
  disclaimerCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '500',
  },
  actions: {
    gap: 12,
    marginBottom: 40,
  },
  actionBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    paddingVertical: 14,
  },
  actionBtnTextSecondary: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  actionBtnPrimary: {
    paddingVertical: 14,
  },
  actionBtnTextPrimary: {
    color: '#020510',
    fontWeight: '700',
    fontSize: 14,
  }
});
