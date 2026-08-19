import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Phone, Clock, Star, Navigation, 
  Search, SlidersHorizontal, RefreshCw, Compass, Layers, 
  AlertCircle, ShieldAlert, CheckCircle, Info, Sparkles, Filter 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import HospitalDetailModal from '../../components/emergency/HospitalDetailModal';
import { 
  getUserLocation, 
  fetchNearbyHospitals, 
  fetchHospitalAutocomplete, 
  filterAndSortHospitals, 
  getGoogleMapsDirectionsUrl 
} from '../../services/hospitalService';

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

const createUserIcon = () => L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      position: relative;
      width: 24px;
      height: 24px;
      background: #2563EB;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 16px rgba(37, 99, 235, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(37, 99, 235, 0.2);
        animation: pulse-ring 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform: scale(0.6); opacity: 0.9; }
        100% { transform: scale(1.6); opacity: 0; }
      }
    </style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createHospitalIcon = (isEmergency) => L.divIcon({
  className: 'custom-hospital-marker',
  html: `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: ${isEmergency ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)'};
      border: 2px solid #ffffff;
      box-shadow: ${isEmergency ? '0 4px 12px rgba(239, 68, 68, 0.4)' : '0 4px 12px rgba(16, 185, 129, 0.3)'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    ">
      ${isEmergency ? '🚑' : '🏥'}
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

export default function EmergencyHospitals() {
  const navigate = useNavigate();

  const [location, setLocation] = useState({ lat: 17.3850, lng: 78.4867 });
  const [hasLocation, setHasLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [hospitals, setHospitals] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [radius, setRadius] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [is24hrOnly, setIs24hrOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState('nearest');

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapMode, setMapMode] = useState('light');
  const [mapZoom, setMapZoom] = useState(13);

  const [aiSymptoms, setAiSymptoms] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    requestLiveLocation();
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [location, radius, searchQuery]);

  const requestLiveLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const pos = await getUserLocation();
      setLocation({ lat: pos.lat, lng: pos.lng });
      setHasLocation(true);
      setMapZoom(14);
    } catch (err) {
      console.warn('GPS Error:', err.message);
      setLocationError(err.message);
      setHasLocation(false);
    } finally {
      setLocationLoading(false);
    }
  };

  const loadHospitals = async () => {
    setDataLoading(true);
    setFetchError(null);
    try {
      const res = await fetchNearbyHospitals(location.lat, location.lng, radius, searchQuery);
      setHospitals(res.results || []);
    } catch (err) {
      setFetchError('Failed to load nearby hospitals. Please check connection and retry.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length >= 2) {
      const autoList = await fetchHospitalAutocomplete(val);
      setSuggestions(autoList);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (text) => {
    setSearchQuery(text);
    setShowSuggestions(false);
  };

  const filteredHospitals = filterAndSortHospitals(hospitals, {
    minRating,
    is24hrOnly,
    emergencyOnly,
    openNowOnly,
    sortBy
  });

  const getGeminiRecommendation = async () => {
    if (!aiSymptoms.trim()) return;
    setAiRecommendation(null);
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/recommend-hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: aiSymptoms, userLocation: location, radiusMeters: radius })
      });
      const data = await res.json();
      let text = data.recommendation || '';
      text = text.replace(/###\s*(🚨|🤖|🩺|🥗|🏋️|🌟)?\s*(Gemini AI Hospital Triage Recommendation|HealthGenie AI Medical Symptom Assessment)/gi, '').trim();
      setAiRecommendation(text || 'Recommendation generated.');
    } catch (err) {
      setAiRecommendation('**Symptom Assessment:** Based on your symptoms, we recommend filtering for 24x7 Emergency Hospitals nearby and seeking medical assistance promptly.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 1160, margin: '0 auto' }}>
        
        {/* Navigation & Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <SectionHeader 
            eyebrow="EMERGENCY GPS LOCATOR" 
            title="Nearby Hospitals & Emergency Care" 
            subtitle="Real-time locator map and verified hospital emergency availability" 
          />
          <GlassButton onClick={() => navigate('/emergency')} style={{ gap: 6 }}>
            <ArrowLeft size={16} /> Back to Hub
          </GlassButton>
        </div>

        {/* AI Hospital Recommender Banner */}
        <GlassCard style={{ marginBottom: 20, padding: 20, border: '1px solid #DBEAFE', background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)', borderRadius: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Sparkles size={20} color="#2563EB" />
            <h3 style={{ color: '#111827', fontSize: '1rem', fontWeight: 700, margin: 0 }}>HealthGenie AI Triage Recommender</h3>
            <span style={{ background: '#DBEAFE', color: '#2563EB', fontSize: '0.72rem', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
              CLINICAL TRIAGE
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Describe symptoms (e.g. Severe chest pain, High fever 103°F, Fracture...)"
              value={aiSymptoms}
              onChange={(e) => setAiSymptoms(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && getGeminiRecommendation()}
              style={{
                flex: 1,
                minWidth: 280,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 14,
                padding: '10px 16px',
                color: '#111827',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'Inter',
              }}
            />
            <GlassButton
              onClick={getGeminiRecommendation}
              variant="primary"
              style={{ fontWeight: 700 }}
            >
              {aiLoading ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />} Get AI Recommendation
            </GlassButton>
          </div>

          {/* AI Output Box */}
          <AnimatePresence>
            {aiRecommendation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  marginTop: 14,
                  padding: 16,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  color: '#1F2937',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                  fontWeight: 500,
                }}
              >
                {aiRecommendation}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* GPS Warning Banner */}
        {locationError && (
          <GlassCard style={{ marginBottom: 20, border: '1px solid #FEE2E2', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertCircle size={24} color="#EF4444" />
              <div>
                <strong style={{ color: '#991B1B', fontSize: '0.9rem', display: 'block' }}>GPS Location Access Required</strong>
                <span style={{ color: '#B91C1C', fontSize: '0.82rem' }}>{locationError} Showing fallback city map.</span>
              </div>
            </div>
            <GlassButton onClick={requestLiveLocation} style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', flexShrink: 0 }}>
              <RefreshCw size={14} className={locationLoading ? 'spin' : ''} /> Retry GPS
            </GlassButton>
          </GlassCard>
        )}

        {/* Search & Radius Control Bar */}
        <GlassCard className="p-4" style={{ marginBottom: 20, background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'center' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '0 14px' }}>
                <Search size={18} color="#2563EB" />
                <input
                  type="text"
                  placeholder="Search hospital name, area, locality..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#111827',
                    padding: '12px 10px',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter',
                  }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                    ✕
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      marginTop: 6,
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 14,
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                  >
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => selectSuggestion(item.text)}
                        style={{
                          padding: '10px 16px',
                          color: '#374151',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          borderBottom: index < suggestions.length - 1 ? '1px solid #F1F5F9' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#EFF6FF'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <MapPin size={14} color="#2563EB" /> {item.text}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Radius selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: 4, borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', paddingLeft: 8, fontWeight: 700 }}>RADIUS:</span>
              {[2000, 5000, 10000, 20000].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: radius === r ? '#2563EB' : 'transparent',
                    color: radius === r ? '#FFFFFF' : '#6B7280',
                    border: 'none'
                  }}
                >
                  {r / 1000} km
                </button>
              ))}
            </div>

            {/* Recenter Button */}
            <GlassButton onClick={requestLiveLocation} style={{ gap: 6 }}>
              <Compass size={16} className={locationLoading ? 'spin' : ''} color="#2563EB" />
              {hasLocation ? 'My GPS' : 'Locate Me'}
            </GlassButton>
          </div>
        </GlassCard>

        {/* Map Card */}
        <GlassCard className="p-0" style={{ marginBottom: 24, borderRadius: 24, overflow: 'hidden', height: 380, position: 'relative', border: '1px solid #E5E7EB', background: '#FFFFFF' }}>
          
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 500, display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMapMode(mapMode === 'light' ? 'satellite' : 'light')}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #E5E7EB',
                color: '#111827',
                padding: '8px 14px',
                borderRadius: 12,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Layers size={14} color="#2563EB" /> {mapMode === 'light' ? 'Satellite View' : 'Map View'}
            </button>
          </div>

          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={mapZoom} 
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <MapController center={[location.lat, location.lng]} zoom={mapZoom} />

            {mapMode === 'light' ? (
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a> Voyager'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
            ) : (
              <TileLayer
                attribution='&copy; ESRI World Imagery'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            )}

            <Marker position={[location.lat, location.lng]} icon={createUserIcon()}>
              <Popup>
                <div style={{ color: '#111827', textAlign: 'center' }}>
                  <strong>Your Current Location</strong><br/>
                  <span>GPS Active</span>
                </div>
              </Popup>
            </Marker>

            {filteredHospitals.map((h) => (
              <Marker
                key={h.id}
                position={[h.lat, h.lng]}
                icon={createHospitalIcon(h.emergency)}
                eventHandlers={{
                  click: () => setSelectedHospital(h)
                }}
              >
                <Popup>
                  <div style={{ color: '#111827', fontSize: '0.85rem' }}>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>{h.name}</strong>
                    <span>{h.type} • {h.distanceFormatted}</span><br/>
                    <span style={{ color: '#D97706', fontWeight: 'bold' }}>⭐ {h.rating}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </GlassCard>

        {/* Filters & Sorting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
              <Filter size={14} /> FILTERS:
            </span>

            <button
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: emergencyOnly ? '1px solid #EF4444' : '1px solid #E5E7EB',
                background: emergencyOnly ? '#FEF2F2' : '#FFFFFF',
                color: emergencyOnly ? '#EF4444' : '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ShieldAlert size={14} /> Emergency Only
            </button>

            <button
              onClick={() => setIs24hrOnly(!is24hrOnly)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: is24hrOnly ? '1px solid #10B981' : '1px solid #E5E7EB',
                background: is24hrOnly ? '#ECFDF5' : '#FFFFFF',
                color: is24hrOnly ? '#10B981' : '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Clock size={14} /> 24x7 Open
            </button>

            <button
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: minRating === 4.5 ? '1px solid #F59E0B' : '1px solid #E5E7EB',
                background: minRating === 4.5 ? '#FEF3C7' : '#FFFFFF',
                color: minRating === 4.5 ? '#D97706' : '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Star size={14} fill={minRating === 4.5 ? '#F59E0B' : 'none'} color={minRating === 4.5 ? '#F59E0B' : '#6B7280'} /> Rating 4.5+
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 700 }}>SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                color: '#111827',
                padding: '6px 12px',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontWeight: 500,
              }}
            >
              <option value="nearest">Nearest Distance</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="open">Open Now First</option>
            </select>
          </div>
        </div>

        {/* Results Info Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: '0.88rem', color: '#6B7280' }}>
            Showing <strong style={{ color: '#111827' }}>{filteredHospitals.length}</strong> hospitals within <strong>{radius / 1000} km</strong> radius
          </span>
        </div>

        {/* Hospital List */}
        {!dataLoading && filteredHospitals.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredHospitals.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard
                  className="p-5"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    cursor: 'pointer',
                    background: '#FFFFFF',
                    borderRadius: 20,
                    border: h.emergency ? '1px solid #FCA5A5' : '1px solid #E5E7EB',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                  onClick={() => setSelectedHospital(h)}
                >
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                    background: '#F1F5F9'
                  }}>
                    <img src={h.photo} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>
                        {h.name}
                      </h3>
                      {h.emergency && (
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 10, background: '#FEF2F2', color: '#EF4444', border: '1px solid #FCA5A5', fontWeight: 700 }}>
                          EMERGENCY
                        </span>
                      )}
                    </div>

                    <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: '3px 0 6px' }}>
                      {h.type} • {h.address}
                    </p>

                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: '#2563EB', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <MapPin size={14} /> {h.distanceFormatted || `${h.distanceKm} km`}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" /> {h.rating} ({h.user_ratings_total || 100})
                      </span>
                      <span style={{ fontSize: '0.8rem', color: h.openNow ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <Clock size={14} /> {h.is24hr ? '24 Hours Open' : (h.openNow ? 'Open Now' : 'Closed')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    {h.phone && (
                      <a href={`tel:${h.phone}`} style={{ textDecoration: 'none' }}>
                        <GlassButton style={{ padding: '10px 14px', background: '#ECFDF5', color: '#10B981', borderColor: '#A7F3D0' }}>
                          <Phone size={16} />
                        </GlassButton>
                      </a>
                    )}
                    <a 
                      href={getGoogleMapsDirectionsUrl(h.lat, h.lng, location.lat, location.lng)} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <GlassButton variant="primary" style={{ padding: '10px 16px', gap: 6 }}>
                        <Navigation size={16} /> Route
                      </GlassButton>
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        <HospitalDetailModal 
          hospital={selectedHospital} 
          userLocation={location}
          onClose={() => setSelectedHospital(null)} 
        />

      </div>
    </PageTransition>
  );
}
