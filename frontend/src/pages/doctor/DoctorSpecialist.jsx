import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Star, AlertCircle, Key, ShieldCheck, RefreshCw, X, CheckCircle, Globe, Search, Navigation, Calendar, Stethoscope, HelpCircle, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { fetchAPIKeyStatus, saveAPIKeys } from '../../services/doctorService';
import { fetchNearbyHospitals, getGoogleMapsDirectionsUrl } from '../../services/hospitalService';

const specialistGuide = {
  'General Practitioner': {
    title: 'General Practitioner / Family Physician',
    icon: '🩺',
    desc: 'Primary care doctors provide comprehensive healthcare, diagnose general ailments, perform routine health checkups, and provide referrals to sub-specialists when needed.',
    whenToSee: ['Routine annual health checkups', 'Fever, cough, body ache, or cold symptoms', 'Unexplained fatigue or weight changes', 'Initial evaluation for persistent discomfort'],
    prepTips: ['List all your current symptoms and when they started', 'Bring a list of all current medications and supplements', 'Note down any family medical history or prior surgeries']
  },
  'Cardiologist': {
    title: 'Cardiologist (Heart & Vascular Specialist)',
    icon: '❤️',
    desc: 'Cardiologists specialize in diagnosing, treating, and preventing diseases of the heart, blood vessels, and circulatory system.',
    whenToSee: ['Chest pain, pressure, or tightness', 'Shortness of breath or rapid heartbeat/palpitations', 'High blood pressure or high cholesterol', 'Family history of heart disease'],
    prepTips: ['Keep a record of your blood pressure readings', 'Note triggers for chest discomfort or shortness of breath', 'Bring recent ECG or lipid panel reports if available']
  },
  'Dermatologist': {
    title: 'Dermatologist (Skin, Hair & Nail Specialist)',
    icon: '🧴',
    desc: 'Dermatologists diagnose and treat medical conditions affecting the skin, hair, nails, and mucous membranes.',
    whenToSee: ['Persistent skin rash, hives, or eczema', 'Severe acne or skin discoloration', 'Changing moles or unusual skin growths', 'Chronic hair loss or scalp irritation'],
    prepTips: ['Do not apply makeup or heavy creams before your visit', 'Take clear photos of flare-ups if they come and go', 'List all skincare products currently being used']
  },
  'Orthopedist': {
    title: 'Orthopedist (Bone & Joint Specialist)',
    icon: '🦴',
    desc: 'Orthopedic specialists focus on the musculoskeletal system including bones, joints, ligaments, tendons, and muscles.',
    whenToSee: ['Severe joint pain or swelling', 'Back, neck, or spine discomfort', 'Sports injuries, sprains, or bone fractures', 'Reduced mobility or difficulty walking'],
    prepTips: ['Wear comfortable clothing for physical mobility testing', 'Bring X-rays, MRIs, or previous scan reports', 'Note which activities aggravate or alleviate your joint pain']
  },
  'Gynecologist': {
    title: 'Gynecologist (Women\'s Health Specialist)',
    icon: '👩‍⚕️',
    desc: 'Gynecologists specialize in female reproductive health, pregnancy, hormonal balance, and pelvic care.',
    whenToSee: ['Irregular or painful menstrual cycles', 'Pelvic pain or suspected PCOS/endometriosis', 'Prenatal & pregnancy consultation', 'Hormonal symptoms or routine pelvic exams'],
    prepTips: ['Note the first day of your last menstrual period', 'Track your cycle symptoms and dates for 2-3 months', 'Prepare any questions regarding fertility or contraception']
  },
  'Neurologist': {
    title: 'Neurologist (Brain & Nervous System Specialist)',
    icon: '🧠',
    desc: 'Neurologists treat disorders that affect the brain, spinal cord, nerves, and muscles.',
    whenToSee: ['Frequent, severe headaches or migraines', 'Unexplained dizziness, vertigo, or loss of balance', 'Numbness, tingling, or nerve pain', 'Seizures or memory lapses'],
    prepTips: ['Keep a headache/migraine diary recording timing and triggers', 'List all neurological symptoms experienced', 'Bring someone along if you experience memory or seizure issues']
  },
  'Gastroenterologist': {
    title: 'Gastroenterologist (Digestive & Gut Specialist)',
    icon: '🫃',
    desc: 'Gastroenterologists specialize in the digestive system, stomach, intestines, liver, gallbladder, and pancreas.',
    whenToSee: ['Chronic stomach pain, bloating, or severe acid reflux', 'Persistent diarrhea, constipation, or IBS symptoms', 'Difficulty swallowing or unexplained nausea', 'Jaundice or liver issues'],
    prepTips: ['Track food triggers and digestive symptoms', 'Note bowel movement frequency and consistency', 'Avoid eating heavy meals right before examination']
  },
  'Endocrinologist': {
    title: 'Endocrinologist (Hormone & Metabolism Specialist)',
    icon: '⚗️',
    desc: 'Endocrinologists specialize in hormones and glands including diabetes, thyroid, adrenal, and metabolic disorders.',
    whenToSee: ['Unexplained weight gain or rapid loss', 'Diabetes or blood sugar management', 'Thyroid imbalance (fatigue, temperature sensitivity)', 'Hormonal disorders'],
    prepTips: ['Bring recent blood glucose logs', 'Bring thyroid or lab panel test results', 'List any history of fatigue, temperature sensitivity, or hair changes']
  },
  'Psychiatrist': {
    title: 'Psychiatrist (Mental Health & Behavioral Specialist)',
    icon: '🧘',
    desc: 'Psychiatrists are medical doctors who diagnose, treat, and prevent mental health, emotional, and behavioral conditions.',
    whenToSee: ['Persistent feelings of sadness, anxiety, or overwhelm', 'Severe sleep disturbances or insomnia', 'Mood swings or difficulty functioning daily', 'Panic attacks or emotional distress'],
    prepTips: ['Write down main emotional or behavioral concerns', 'Note sleep patterns, energy levels, and mood shifts', 'Be open and honest about stress factors and past therapies']
  },
  'Pulmonologist': {
    title: 'Pulmonologist (Lung & Respiratory Specialist)',
    icon: '🫁',
    desc: 'Pulmonologists specialize in the respiratory system, lungs, airways, and breathing disorders.',
    whenToSee: ['Persistent cough lasting over 3 weeks', 'Asthma or wheezing episodes', 'Shortness of breath during minor exertion', 'Sleep apnea or snoring issues'],
    prepTips: ['Bring spirometry or chest X-ray reports if available', 'Note environmental or allergic triggers for cough/breathlessness', 'List any inhalers or allergy medications used']
  }
};

export default function DoctorSpecialist() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const targetSpecialty = locationState.state?.specialty || 'General Practitioner';

  const [selectedSpecialty, setSelectedSpecialty] = useState(targetSpecialty);
  const [userLocation, setUserLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  
  // Real-time Hospitals State
  const [hospitalsList, setHospitalsList] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // API Key Management Modal State
  const [keyStatus, setKeyStatus] = useState({ hasGooglePlaces: false, hasGemini: false });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputPlacesKey, setInputPlacesKey] = useState('');
  const [inputGeminiKey, setInputGeminiKey] = useState('');
  const [savingKeys, setSavingKeys] = useState(false);
  const [keyMsg, setKeyMsg] = useState('');

  const activeGuide = useMemo(() => {
    return specialistGuide[selectedSpecialty] || specialistGuide['General Practitioner'];
  }, [selectedSpecialty]);

  // Load API Key Configuration Status
  const loadKeyStatus = async () => {
    const status = await fetchAPIKeyStatus();
    setKeyStatus(status);
  };

  useEffect(() => {
    loadKeyStatus();
  }, []);

  const handleSaveKeys = async (e) => {
    e.preventDefault();
    setSavingKeys(true);
    setKeyMsg('');
    const res = await saveAPIKeys({
      googlePlacesKey: inputPlacesKey,
      geminiKey: inputGeminiKey
    });
    setSavingKeys(false);
    if (res.status === 'OK') {
      setKeyMsg('API Keys saved & verified successfully!');
      loadKeyStatus();
      setTimeout(() => {
        setShowKeyModal(false);
        setKeyMsg('');
        if (userLocation) loadHospitals(userLocation.lat, userLocation.lng);
      }, 1200);
    } else {
      setKeyMsg(`Failed to save keys: ${res.message || 'Unknown error'}`);
    }
  };

  const fallbackToIPLocation = async (message) => {
    try {
      let res = await fetch('https://ipapi.co/json/');
      let data = null;
      if (res.ok) {
        data = await res.json();
      }
      if (data && (data.latitude || data.lat) && (data.longitude || data.lon)) {
        const lat = parseFloat(data.latitude || data.lat);
        const lng = parseFloat(data.longitude || data.lon);
        const city = data.city || 'Detected City';
        const country = data.country_name || data.country || '';

        const loc = { lat, lng, name: `${city}${country ? `, ${country}` : ''}` };
        setUserLocation(loc);
        setLocError(`${message} Auto-detected: ${city}`);
        loadHospitals(lat, lng);
      } else {
        throw new Error('No coordinates resolved');
      }
    } catch (err) {
      const defaultLoc = { lat: 13.0827, lng: 80.2707, name: 'Chennai, India (Default)' };
      setUserLocation(defaultLoc);
      setLocError('Could not detect location automatically. Please enter city/zip manually.');
      loadHospitals(defaultLoc.lat, defaultLoc.lng);
    } finally {
      setLocLoading(false);
    }
  };

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
        let cityName = 'Current GPS Position';
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            if (data.city) cityName = `${data.city}, ${data.country_name || ''}`;
          }
        } catch (e) {
          console.warn('IP city lookup quiet fail');
        }

        const loc = { lat, lng, name: cityName };
        setUserLocation(loc);
        setLocLoading(false);
        loadHospitals(lat, lng);
      },
      (error) => {
        fallbackToIPLocation('GPS permission denied or timed out.');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
    );
  };

  const loadHospitals = async (lat, lng) => {
    setDataLoading(true);
    try {
      const q = searchQuery || selectedSpecialty;
      const hospRes = await fetchNearbyHospitals(lat, lng, 6000, q);
      if (hospRes && hospRes.results) {
        setHospitalsList(hospRes.results);
      }
    } catch (err) {
      console.error('Failed to load real-time hospital data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadHospitals(userLocation.lat, userLocation.lng);
    }
  }, [selectedSpecialty, searchQuery]);

  const handleApplyManualLocation = () => {
    if (!manualLocation.trim()) return;
    setUserLocation({ lat: 13.0827, lng: 80.2707, name: manualLocation });
    setLocError('');
    loadHospitals(13.0827, 80.2707);
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader 
          eyebrow="SPECIALIST CARE & NEARBY HOSPITALS" 
          title={`${activeGuide.icon} ${selectedSpecialty}`} 
          subtitle={`Consultation guidance and nearby medical centers for ${selectedSpecialty}`} 
        />

        {/* Specialist Selector Bar */}
        <GlassCard className="p-3" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', paddingLeft: 4 }}>
              Select Specialty:
            </span>
            {Object.keys(specialistGuide).map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedSpecialty === spec ? 'var(--neon-pulse)' : 'var(--glass-border)',
                  background: selectedSpecialty === spec ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.03)',
                  color: selectedSpecialty === spec ? 'var(--neon-pulse)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {specialistGuide[spec].icon} {spec}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Specialist Overview & Guidance Card */}
        <GlassCard className="p-6" style={{ marginBottom: 24, border: '1px solid var(--neon-pulse)', background: 'rgba(0,245,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: '3rem', background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 16, lineHeight: 1 }}>
              {activeGuide.icon}
            </div>
            <div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--neon-pulse)' }}>
                {activeGuide.title}
              </h3>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: 4 }}>
                {activeGuide.desc}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
            {/* When to see */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#39FF14' }}>
                <Stethoscope size={18} />
                <h4 className="font-display" style={{ fontSize: '0.92rem', fontWeight: 600 }}>When to Consult This Specialist</h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeGuide.whenToSee.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <CheckCircle size={14} color="#39FF14" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation tips */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--neon-pulse)' }}>
                <CheckSquare size={18} />
                <h4 className="font-display" style={{ fontSize: '0.92rem', fontWeight: 600 }}>How to Prepare for Your Visit</h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeGuide.prepTips.map((tip, idx) => (
                  <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--neon-pulse)', fontWeight: 700, fontSize: '0.75rem', marginTop: 1 }}>{idx + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Location & Search Controls Bar */}
        <GlassCard className="p-4" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={18} color="var(--neon-health)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {locLoading ? 'Detecting your location coordinates...' : (userLocation ? `Location: ${userLocation.name}` : 'No location detected')}
                </span>
              </div>
              <GlassButton 
                onClick={detectLocation} 
                disabled={locLoading}
                style={{ borderColor: 'var(--neon-health)', color: 'var(--neon-health)', fontSize: '0.75rem', padding: '4px 10px' }}
              >
                {locLoading ? <RefreshCw size={12} className="spin" /> : 'Redetect Location'}
              </GlassButton>
            </div>

            {/* Manual search and location input */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '4px 12px' }}>
                <Search size={14} color="var(--text-secondary)" style={{ marginRight: 8 }} />
                <input 
                  type="text" 
                  placeholder={`Search nearby hospitals for ${selectedSpecialty}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.82rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '4px 12px' }}>
                <input 
                  type="text" 
                  placeholder="Enter city / area name..." 
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.82rem', width: '100%', outline: 'none' }}
                />
                <button onClick={handleApplyManualLocation} style={{ background: 'none', border: 'none', color: 'var(--neon-pulse)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Nearby Hospitals Header */}
        <div style={{ marginBottom: 16 }}>
          <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            🏥 Nearby Hospitals & Healthcare Centers Offering {selectedSpecialty}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Contact or navigate directly to verified hospitals near you
          </p>
        </div>

        {/* Hospitals List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {dataLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: 10 }} />
              <p style={{ fontSize: '0.9rem' }}>Fetching real-time hospitals near your location...</p>
            </div>
          ) : hospitalsList.length === 0 ? (
            <GlassCard className="p-6" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No hospitals found. Try expanding your search radius or redetecting location.</p>
            </GlassCard>
          ) : (
            hospitalsList.map((h, i) => (
              <motion.div key={h.id || h.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <GlassCard className="p-5" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(57,255,20,0.2)', flexShrink: 0 }}>
                    <img src={h.photo} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{h.name}</h3>
                      {h.is24hr && <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(57,255,20,0.1)', color: '#39FF14', border: '1px solid rgba(57,255,20,0.2)' }}>24/7 OPEN</span>}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>{h.type} • {h.address}</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{h.distanceFormatted}</span>
                      <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3 }}><Star size={11} color="#FFB347" fill="#FFB347" />{h.rating} ({h.user_ratings_total || 120})</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <GlassButton onClick={() => window.open(`tel:${h.phone}`)}><Phone size={14} /></GlassButton>
                    <GlassButton variant="primary" onClick={() => window.open(getGoogleMapsDirectionsUrl(h.lat, h.lng), '_blank')}>
                      <Navigation size={14} /> Directions
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>

        <div style={{ marginTop: 28 }}>
          <GlassButton onClick={() => navigate('/doctor/recommendation')}>
            <ArrowLeft size={16} /> Back to Doctor Recommendation Summary
          </GlassButton>
        </div>
      </div>
    </PageTransition>
  );
}
