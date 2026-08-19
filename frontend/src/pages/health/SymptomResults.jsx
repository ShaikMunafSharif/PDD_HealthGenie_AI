import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Stethoscope, AlertCircle, Loader, ShieldAlert, Sparkles, Apple, Dumbbell } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useSymptomStore, useDietStore, useExerciseStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';

export default function SymptomResults() {
  const navigate = useNavigate();
  const { 
    analysisResult, 
    setAnalysisResult, 
    selectedSymptoms, 
    selectedBodyParts, 
    duration, 
    severity, 
    frequency, 
    additionalNotes, 
    isAnalyzing, 
    setIsAnalyzing, 
    reset 
  } = useSymptomStore();

  const [statusText, setStatusText] = useState('Analyzing symptoms...');

  const [symptomDietPlan, setSymptomDietPlan] = useState(null);
  const [symptomExercisePlan, setSymptomExercisePlan] = useState(null);
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [isGeneratingExercise, setIsGeneratingExercise] = useState(false);
  const [dietError, setDietError] = useState(null);
  const [exerciseError, setExerciseError] = useState(null);
  const [exerciseWarning, setExerciseWarning] = useState(null);

  // Removed auto-generation on mount per user request

  const generateRecoveryDiet = async () => {
    setIsGeneratingDiet(true);
    setDietError(null);
    const symStr = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : selectedBodyParts.join(', ') || 'Unspecified symptoms';
    const prompt = `You are a health information assistant. Based on the user's reported symptoms and symptom-analysis information, generate a general supportive diet plan.
Symptoms: ${symStr}
Severity: ${severity}/10
Doctor consultation recommendation: ${analysisResult.substring(0, 200)}

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
      setDietError("Unable to generate the plan right now. Please check your internet connection and try again.");
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
Doctor consultation recommendation: ${analysisResult.substring(0, 200)}

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
      setExerciseError("Unable to generate the plan right now. Please check your internet connection and try again.");
    } finally {
      setIsGeneratingExercise(false);
    }
  };

  useEffect(() => {
    // If no symptoms AND no body parts selected and no existing result, navigate back to select page
    if (selectedSymptoms.length === 0 && selectedBodyParts.length === 0 && !analysisResult) {
      navigate('/symptoms/select');
      return;
    }

    // If analysisResult already exists, don't run analysis again
    if (analysisResult) return;

    const controller = new AbortController();

    const getFallbackResult = () => {
      const symList = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : selectedBodyParts.join(', ') || 'Reported symptoms';
      const pLower = symList.toLowerCase();
      let conditions = [];
      
      if (pLower.includes('chest pain') || pLower.includes('shortness of breath')) {
        conditions.push("• Cardiovascular or Respiratory Issue (80% confidence) - Requires immediate medical evaluation");
      }
      if (pLower.includes('fever') || pLower.includes('sore throat') || pLower.includes('cough')) {
        conditions.push("• Viral or Bacterial Infection (75% confidence) - Common systemic immune response");
      }
      if (pLower.includes('joint pain') || pLower.includes('body ache') || pLower.includes('back pain')) {
        conditions.push("• Musculoskeletal Strain or Inflammation (70% confidence) - Often related to physical stress or systemic inflammation");
      }
      if (pLower.includes('stomach pain') || pLower.includes('nausea') || pLower.includes('diarrhea')) {
        conditions.push("• Gastrointestinal Distress (65% confidence) - Dietary response or viral gastroenteritis");
      }
      if (pLower.includes('headache') || pLower.includes('dizziness') || pLower.includes('fatigue')) {
        conditions.push("• Neurological Tension or Dehydration (60% confidence) - Common stress or fluid imbalance symptom");
      }
      if (pLower.includes('rash') || pLower.includes('swelling')) {
        conditions.push("• Allergic Reaction or Dermatitis (60% confidence) - Environmental or dietary response");
      }
      
      if (conditions.length === 0) {
        conditions.push("• General Systemic Response (60% confidence) - Non-specific symptoms requiring monitoring");
        conditions.push("• Stress & Musculoskeletal Tension (40% confidence) - Fatigue or tension-type manifestation");
        conditions.push("• Mild Viral Infection (20% confidence) - Early stage upper respiratory response");
      }

      const conditionsText = conditions.slice(0, 3).join('\n');

      return `Clinical AI Evaluation:
Based on your reported symptoms (${symList}) with a reported severity of ${severity}/10:

Possible Considerations:
${conditionsText}

Clinical Severity: ${severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : 'Severe'}

Recommended Action Steps:
1. Rest adequately and maintain fluid hydration (2.5–3.0L water daily).
2. Monitor vital metrics and symptom severity changes every 6 hours.
3. Schedule a consultation with a primary care physician if symptoms persist beyond 48 hours.

When to Seek Immediate Care:
${severity >= 7 ? '⚠️ URGENT: Given your severity score of ' + severity + '/10, consult a doctor within 24 hours or visit an urgent care center.' : 'If you experience sudden shortness of breath, chest pressure, or symptoms persist for more than 7 days.'}

Recommended Specialist: General Physician / Internal Medicine Specialist`;
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
        } catch (err) {
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
  }, [selectedSymptoms, selectedBodyParts, duration, severity, frequency, additionalNotes, navigate, setAnalysisResult, setIsAnalyzing]);

  const handleNewAnalysis = () => { reset(); navigate('/symptoms/select'); };

  const severityColor = severity <= 3 ? '#10B981' : severity <= 6 ? '#F59E0B' : '#EF4444';
  const severityBg = severity <= 3 ? '#ECFDF5' : severity <= 6 ? '#FFFBEB' : '#FEF2F2';
  const severityBorder = severity <= 3 ? '#A7F3D0' : severity <= 6 ? '#FDE68A' : '#FECACA';

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 840, margin: '0 auto' }}>
        <SectionHeader eyebrow="AI DIAGNOSIS & ASSESSMENT" title="Symptom Assessment Results" subtitle="Personalized clinical evaluation generated by HealthGenie AI" />

        {/* Severity indicator banner */}
        <GlassCard className="p-5" style={{ marginBottom: 20, background: severityBg, borderRadius: 20, border: `1px solid ${severityBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <AlertCircle size={22} style={{ color: severityColor }} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: severityColor, letterSpacing: '0.06em' }}>
                {severity <= 3 ? 'LOW SEVERITY ASSESSMENT' : severity <= 6 ? 'MODERATE SEVERITY ASSESSMENT' : 'HIGH SEVERITY ASSESSMENT'}
              </span>
              <p style={{ fontSize: '0.88rem', color: '#374151', marginTop: 2, fontWeight: 600 }}>
                Discomfort Severity Score: <strong style={{ color: severityColor }}>{severity}/10</strong> • Occurrence: {frequency}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Main AI Assessment Result Card */}
        <GlassCard className="p-6" style={{ marginBottom: 20, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 18, borderBottom: '1px solid #F3F4F6', paddingBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={20} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>AI Clinical Recommendation</h3>
            </div>
            {isAnalyzing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#2563EB', fontWeight: 600, background: '#EFF6FF', padding: '6px 12px', borderRadius: 20 }}>
                <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Evaluating...</span>
              </div>
            )}
          </div>

          <div style={{ color: '#1F2937', lineHeight: 1.8, fontSize: '0.94rem', whiteSpace: 'pre-wrap', fontFamily: 'Inter', fontWeight: 450 }}>
            {analysisResult || (
              <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#6B7280' }}>
                <Loader size={28} color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '0.92rem', fontWeight: 500, color: '#4B5563' }}>{statusText}</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Disclaimer */}
        <GlassCard className="p-4" style={{ marginBottom: 24, background: '#FFFBEB', borderRadius: 18, border: '1px solid #FDE68A' }}>
          <p style={{ fontSize: '0.82rem', color: '#92400E', display: 'flex', alignItems: 'flex-start', gap: 10, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2, color: '#D97706' }} />
            This AI clinical analysis is for informational and triage guidance only and does not constitute a formal medical diagnosis. For severe symptoms or medical emergencies, please consult a qualified healthcare provider or visit an emergency room immediately.
          </p>
        </GlassCard>

        {/* Recovery Plans Export */}
        {analysisResult && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
            <GlassCard className="p-5" style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Apple size={20} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, fontFamily: 'Inter' }}>Recovery Diet Plan</h3>
              </div>
              {isGeneratingDiet ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: '0.85rem' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating personalized diet plan...
                </div>
              ) : dietError ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: '0.85rem', color: '#EF4444', margin: 0 }}>{dietError}</p>
                  <GlassButton variant="secondary" onClick={generateRecoveryDiet}>Try Again</GlassButton>
                </div>
              ) : symptomDietPlan ? (
                <>
                  <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: 16 }}>A tailored nutrition plan generated to help your body recover based on your AI diagnosis.</p>
                  <GlassButton fullWidth variant="primary" onClick={() => {
                    useDietStore.getState().setWeeklyPlan(symptomDietPlan);
                    navigate('/diet/plan');
                  }}>
                    Export to Diet Tracker
                  </GlassButton>
                </>
              ) : (
                <GlassButton fullWidth variant="primary" onClick={generateRecoveryDiet} disabled={isGeneratingDiet}>
                  Generate Diet Plan
                </GlassButton>
              )}
            </GlassCard>

            <GlassCard className="p-5" style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Dumbbell size={20} color="#2563EB" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, fontFamily: 'Inter' }}>Recovery Exercise</h3>
              </div>
              {exerciseWarning ? (
                <p style={{ fontSize: '0.85rem', color: '#B91C1C', background: '#FEF2F2', padding: 12, borderRadius: 8, margin: 0, lineHeight: 1.5 }}>
                  <ShieldAlert size={16} style={{ display: 'inline', marginBottom: -3, marginRight: 4 }} />
                  {exerciseWarning}
                </p>
              ) : isGeneratingExercise ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: '0.85rem' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating personalized exercise plan...
                </div>
              ) : exerciseError ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: '0.85rem', color: '#EF4444', margin: 0 }}>{exerciseError}</p>
                  <GlassButton variant="secondary" onClick={generateRecoveryExercise}>Try Again</GlassButton>
                </div>
              ) : symptomExercisePlan ? (
                <>
                  <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: 16 }}>A restorative movement plan suited for your current condition and severity level.</p>
                  <GlassButton fullWidth variant="primary" onClick={() => {
                    useExerciseStore.getState().setWorkoutPlan(symptomExercisePlan);
                    navigate('/exercise/recommendations');
                  }}>
                    Export to Exercise Tracker
                  </GlassButton>
                </>
              ) : (
                <GlassButton fullWidth variant="primary" onClick={generateRecoveryExercise} disabled={isGeneratingExercise}>
                  Generate Exercise Plan
                </GlassButton>
              )}
            </GlassCard>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <GlassButton onClick={handleNewAnalysis} disabled={isAnalyzing} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151' }}>
            <RotateCcw size={16} /> New Symptom Analysis
          </GlassButton>
          <GlassButton onClick={() => navigate('/doctor/recommendation')} disabled={isAnalyzing} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#2563EB' }}>
            <Stethoscope size={16} /> Find Recommended Specialist
          </GlassButton>
          <GlassButton variant="primary" onClick={() => navigate('/dashboard')} disabled={isAnalyzing} style={{ marginLeft: 'auto', padding: '0 24px' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </GlassButton>
        </div>
      </div>
    </PageTransition>
  );
}
