import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Sparkles, ArrowRight, MapPin, Phone, Star, RefreshCw, Search, Building2, CheckCircle, Navigation, Info, AlertCircle } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';
import { fetchNearbyHospitals, getGoogleMapsDirectionsUrl } from '../../services/hospitalService';

const specialists = [
  { type: 'General Practitioner', desc: 'Primary care, routine checkups, general health & initial evaluation', icon: '🩺', color: '#00F5FF', symptoms: ['Fever', 'Fatigue', 'Body ache', 'General malaise'] },
  { type: 'Cardiologist', desc: 'Heart conditions, blood pressure, chest pain & circulation issues', icon: '❤️', color: '#FF6B35', symptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'High BP'] },
  { type: 'Dermatologist', desc: 'Skin conditions, rashes, acne, moles & allergic skin responses', icon: '🧴', color: '#BF5FFF', symptoms: ['Rashes', 'Itching', 'Acne', 'Skin lesions'] },
  { type: 'Orthopedist', desc: 'Bone & joint issues, fractures, arthritis & sports injuries', icon: '🦴', color: '#FFB347', symptoms: ['Joint pain', 'Back pain', 'Fractures', 'Mobility issues'] },
  { type: 'Gynecologist', desc: "Women's reproductive health, period irregularities & pregnancy care", icon: '👩‍⚕️', color: '#BF5FFF', symptoms: ['Pelvic pain', 'Irregular cycles', 'PCOS', 'Pregnancy'] },
  { type: 'Neurologist', desc: 'Headaches, migraines, nerve pain, seizures & brain disorders', icon: '🧠', color: '#00F5FF', symptoms: ['Severe headache', 'Dizziness', 'Numbness', 'Memory loss'] },
  { type: 'Gastroenterologist', desc: 'Digestive issues, stomach pain, acid reflux & gut health', icon: '🫃', color: '#39FF14', symptoms: ['Stomach pain', 'Acid reflux', 'Nausea', 'Bloating'] },
  { type: 'Endocrinologist', desc: 'Diabetes, thyroid issues, hormone imbalances & metabolic care', icon: '⚗️', color: '#FFB347', symptoms: ['Thyroid issues', 'Diabetes', 'Unexplained weight changes'] },
  { type: 'Psychiatrist', desc: 'Mental wellness, anxiety, depression, sleep & stress disorders', icon: '🧘', color: '#BF5FFF', symptoms: ['Anxiety', 'Depression', 'Insomnia', 'Chronic stress'] },
  { type: 'Pulmonologist', desc: 'Lung & breathing disorders, asthma, chronic cough & respiratory care', icon: '🫁', color: '#00F5FF', symptoms: ['Persistent cough', 'Asthma', 'Wheezing', 'Shortness of breath'] },
];

export default function DoctorRecommendation() {
  const navigate = useNavigate();
  const { selectedSymptoms, analysisResult } = useSymptomStore();

  const [aiRec, setAiRec] = useState('');
  const [loading, setLoading] = useState(true);

  // Hospital state
  const [userLocation, setUserLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [hospitalsList, setHospitalsList] = useState([]);
  const [hospLoading, setHospLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse AI suggested specialist from diagnosis text or symptoms
  const getSuggestedSpecialistFromAI = () => {
    if (!analysisResult) return null;
    const lowerResult = analysisResult.toLowerCase();
    
    for (const spec of specialists) {
      if (lowerResult.includes(spec.type.toLowerCase())) {
        return spec.type;
      }
    }

    if (lowerResult.includes('family medicine') || lowerResult.includes('internal medicine') || lowerResult.includes('gp') || lowerResult.includes('primary care')) {
      return 'General Practitioner';
    }
    if (lowerResult.includes('cardiologist') || lowerResult.includes('cardiology')) return 'Cardiologist';
    if (lowerResult.includes('dermatologist') || lowerResult.includes('dermatology')) return 'Dermatologist';
    if (lowerResult.includes('orthopedist') || lowerResult.includes('orthopedic')) return 'Orthopedist';
    if (lowerResult.includes('gynecologist') || lowerResult.includes('gynecology')) return 'Gynecologist';
    if (lowerResult.includes('neurologist') || lowerResult.includes('neurology')) return 'Neurologist';
    if (lowerResult.includes('gastroenterologist') || lowerResult.includes('gastroenterology')) return 'Gastroenterologist';
    if (lowerResult.includes('endocrinologist') || lowerResult.includes('endocrinology')) return 'Endocrinologist';
    if (lowerResult.includes('psychiatrist') || lowerResult.includes('therapist')) return 'Psychiatrist';
    if (lowerResult.includes('pulmonologist') || lowerResult.includes('pulmonology')) return 'Pulmonologist';

    return null;
  };

  const getSuggestedSpecialistsFromSymptoms = () => {
    const matched = new Set();
    selectedSymptoms.forEach(s => {
      const lowerS = s.toLowerCase();
      if (lowerS.includes('chest') || lowerS.includes('palpitations')) matched.add('Cardiologist');
      if (lowerS.includes('rash') || lowerS.includes('skin') || lowerS.includes('acne')) matched.add('Dermatologist');
      if (lowerS.includes('joint') || lowerS.includes('back pain') || lowerS.includes('bone')) matched.add('Orthopedist');
      if (lowerS.includes('cramps') || lowerS.includes('period') || lowerS.includes('pregnancy')) matched.add('Gynecologist');
      if (lowerS.includes('headache') || lowerS.includes('dizziness') || lowerS.includes('numbness')) matched.add('Neurologist');
      if (lowerS.includes('stomach') || lowerS.includes('nausea') || lowerS.includes('bloating')) matched.add('Gastroenterologist');
      if (lowerS.includes('fatigue') || lowerS.includes('diabetes') || lowerS.includes('thyroid')) matched.add('Endocrinologist');
      if (lowerS.includes('anxiety') || lowerS.includes('insomnia') || lowerS.includes('depression')) matched.add('Psychiatrist');
      if (lowerS.includes('cough') || lowerS.includes('breath') || lowerS.includes('asthma')) matched.add('Pulmonologist');
      if (lowerS.includes('fever') || lowerS.includes('body ache')) matched.add('General Practitioner');
    });
    return Array.from(matched);
  };

  const recommendedSpecialistName = useMemo(() => {
    const aiSuggested = getSuggestedSpecialistFromAI();
    if (aiSuggested) return aiSuggested;
    const symptomSuggested = getSuggestedSpecialistsFromSymptoms();
    if (symptomSuggested.length > 0) return symptomSuggested[0];
    return 'General Practitioner';
  }, [analysisResult, selectedSymptoms]);

  const recommendedSpecialist = useMemo(() => {
    return specialists.find(s => s.type === recommendedSpecialistName) || specialists[0];
  }, [recommendedSpecialistName]);

  // Fetch AI recommendation
  const fetchDoctorRecommendations = async () => {
    setLoading(true);
    setAiRec('');
    const prompt = `Based on the user's reported symptoms (${selectedSymptoms.join(', ') || 'general wellness checkup'}), specify WHICH TYPE OF MEDICAL SPECIALIST (e.g. Cardiologist, Neurologist, General Practitioner, etc.) they should consult. Give a concise 2-sentence explanation of why to consult this specialist and what questions to ask them. Do not recommend individual doctor names.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'doctor')) {
        setAiRec(chunk.full);
        setLoading(false);
      }
    } catch {
      setAiRec(`We strongly recommend consulting a ${recommendedSpecialist.type}. Based on your reported symptoms, a consultation with a ${recommendedSpecialist.type} will provide targeted diagnostic evaluation and personalized treatment.`);
    } finally {
      setLoading(false);
    }
  };

  // Location & Hospitals logic
  const detectLocation = () => {
    setLocLoading(true);
    setLocError('');
    if (!navigator.geolocation) {
      fallbackToIPLocation('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let cityName = 'Current Location';
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            if (data.city) cityName = `${data.city}, ${data.country_name || ''}`;
          }
        } catch (e) {
          console.warn('IP city lookup quiet fail');
        }
        setUserLocation({ lat, lng, name: cityName });
        setLocLoading(false);
        loadHospitals(lat, lng);
      },
      (error) => {
        fallbackToIPLocation('GPS permission denied or timed out.');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
    );
  };

  const fallbackToIPLocation = async (msg) => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        const loc = { lat, lng, name: `${data.city || 'Detected City'}, ${data.country_name || ''}` };
        setUserLocation(loc);
        loadHospitals(lat, lng);
      } else {
        throw new Error('IP lookup failed');
      }
    } catch (err) {
      const defaultLoc = { lat: 13.0827, lng: 80.2707, name: 'Chennai, India (Default)' };
      setUserLocation(defaultLoc);
      loadHospitals(defaultLoc.lat, defaultLoc.lng);
    } finally {
      setLocLoading(false);
    }
  };

  const loadHospitals = async (lat, lng, queryOverride) => {
    setHospLoading(true);
    try {
      const q = queryOverride !== undefined ? queryOverride : (searchQuery || recommendedSpecialist.type);
      const res = await fetchNearbyHospitals(lat, lng, 6000, q);
      if (res && res.results) {
        setHospitalsList(res.results);
      }
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setHospLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorRecommendations();
    detectLocation();
  }, [selectedSymptoms]);

  useEffect(() => {
    if (userLocation) {
      loadHospitals(userLocation.lat, userLocation.lng);
    }
  }, [searchQuery]);

  const handleApplyManualLocation = () => {
    if (!manualLocation.trim()) return;
    const loc = { lat: 13.0827, lng: 80.2707, name: manualLocation };
    setUserLocation(loc);
    loadHospitals(13.0827, 80.2707);
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader 
          eyebrow="MEDICAL SPECIALIST RECOMMENDATION" 
          title="Which Specialist to Consult" 
          subtitle="AI-driven specialist guidance & nearby hospitals for your healthcare needs" 
        />

        {/* AI Specialist Advisory Banner */}
        <GlassCard className="p-6" style={{ marginBottom: 24, border: '1px solid var(--neon-pulse)', boxShadow: '0 0 20px rgba(0,245,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={24} color="var(--neon-pulse)" />
              <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Specialist Consultation Advisory</h3>
            </div>
            <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 12, background: 'rgba(0,245,255,0.15)', color: 'var(--neon-pulse)', border: '1px solid rgba(0,245,255,0.3)', fontWeight: 600 }}>
              RECOMMENDED CARE PATHWAY
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
              <div className="skeleton" style={{ width: '100%', height: 14 }} />
              <div className="skeleton" style={{ width: '80%', height: 14 }} />
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                {aiRec}
              </p>

              {/* Recommended Specialist Highlight Card */}
              <div style={{ 
                background: 'rgba(0,245,255,0.06)', 
                border: '1px solid rgba(0,245,255,0.3)', 
                borderRadius: 12, 
                padding: '16px 20px', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'space-between',
                flexWrap: 'wrap',
                gap: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 12 }}>
                    {recommendedSpecialist.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.7rem', color: '#39FF14', fontWeight: 700, letterSpacing: '0.5px' }}>PRIMARY SPECIALIST MATCH</span>
                    </div>
                    <h4 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--neon-pulse)', margin: '2px 0' }}>
                      {recommendedSpecialist.type}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {recommendedSpecialist.desc}
                    </p>
                  </div>
                </div>

                <GlassButton 
                  variant="primary" 
                  onClick={() => navigate('/doctor/specialist', { state: { specialty: recommendedSpecialist.type } })}
                  style={{ gap: 8 }}
                >
                  Consultation Guide & Nearby Hospitals <ArrowRight size={16} />
                </GlassButton>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Nearby Hospitals Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                🏥 Nearby Hospitals & Healthcare Centers
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Find verified hospitals where you can consult a {recommendedSpecialist.type}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GlassButton onClick={detectLocation} disabled={locLoading} style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
                {locLoading ? <RefreshCw size={12} className="spin" /> : <MapPin size={12} />}
                {userLocation ? userLocation.name : 'Detect Location'}
              </GlassButton>
            </div>
          </div>

          {/* Hospital Search Bar */}
          <GlassCard className="p-3" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '6px 12px' }}>
                <Search size={14} color="var(--text-secondary)" style={{ marginRight: 8 }} />
                <input 
                  type="text" 
                  placeholder={`Search hospitals for ${recommendedSpecialist.type}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '6px 12px' }}>
                <input 
                  type="text" 
                  placeholder="Enter city or postal area..." 
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                />
                <button onClick={handleApplyManualLocation} style={{ background: 'none', border: 'none', color: 'var(--neon-pulse)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                  Apply
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Hospitals List */}
          {hospLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: 10 }} />
              <p style={{ fontSize: '0.9rem' }}>Locating nearest hospitals and medical centers...</p>
            </div>
          ) : hospitalsList.length === 0 ? (
            <GlassCard className="p-6" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No hospitals found nearby. Try broadening your location or search terms.</p>
            </GlassCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {hospitalsList.slice(0, 5).map((h, i) => (
                <motion.div key={h.id || h.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <GlassCard className="p-4" style={{ display: 'flex', alignItems: 'center', gap: 16, border: '1px solid rgba(57,255,20,0.15)' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(57,255,20,0.2)', flexShrink: 0 }}>
                      <img src={h.photo} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{h.name}</h4>
                        {h.is24hr && (
                          <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(57,255,20,0.1)', color: '#39FF14', border: '1px solid rgba(57,255,20,0.2)' }}>
                            24/7 OPEN
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>{h.type} • {h.address}</p>
                      <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <MapPin size={12} color="var(--neon-health)" /> {h.distanceFormatted}
                        </span>
                        <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Star size={12} color="#FFB347" fill="#FFB347" /> {h.rating} ({h.user_ratings_total || 95} reviews)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <GlassButton onClick={() => window.open(`tel:${h.phone}`)} title="Call Hospital">
                        <Phone size={14} />
                      </GlassButton>
                      <GlassButton 
                        variant="primary" 
                        onClick={() => window.open(getGoogleMapsDirectionsUrl(h.lat, h.lng), '_blank')}
                        style={{ gap: 6, fontSize: '0.8rem' }}
                      >
                        <Navigation size={14} /> Get Directions
                      </GlassButton>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Directory of All Medical Specialists */}
        <div>
          <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16 }}>
            📋 Browse All Medical Specialist Categories
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {specialists.map((s, i) => {
              const isRecommended = s.type === recommendedSpecialist.type;
              return (
                <motion.div key={s.type} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <GlassCard 
                    className="p-5" 
                    onClick={() => navigate('/doctor/specialist', { state: { specialty: s.type } })} 
                    style={{ 
                      cursor: 'pointer', 
                      border: isRecommended ? '1px solid var(--neon-pulse)' : '1px solid var(--glass-border)',
                      boxShadow: isRecommended ? '0 0 12px rgba(0,245,255,0.15)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {isRecommended && (
                      <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.65rem', background: 'var(--neon-pulse)', color: '#000', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                        RECOMMENDED
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                      <h3 className="font-display" style={{ fontSize: '0.98rem', fontWeight: 600, color: isRecommended ? 'var(--neon-pulse)' : 'var(--text-primary)' }}>
                        {s.type}
                      </h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: 10 }}>
                      {s.desc}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {s.symptoms.map(sym => (
                        <span key={sym} style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                          • {sym}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
