import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Star, Clock, Globe, Navigation, Heart, Share2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { GlassCard, GlassButton } from '../ui/Components';
import { getGoogleMapsDirectionsUrl } from '../../services/hospitalService';

export default function HospitalDetailModal({ hospital, userLocation, onClose }) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hospital) return;
    const savedList = JSON.parse(localStorage.getItem('saved_hospitals') || '[]');
    setIsSaved(savedList.some(item => item.id === hospital.id));
  }, [hospital]);

  if (!hospital) return null;

  const toggleFavorite = () => {
    const savedList = JSON.parse(localStorage.getItem('saved_hospitals') || '[]');
    let updated;
    if (isSaved) {
      updated = savedList.filter(item => item.id !== hospital.id);
    } else {
      updated = [...savedList, hospital];
    }
    localStorage.setItem('saved_hospitals', JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    const text = `${hospital.name} - ${hospital.address}. Directions: ${getGoogleMapsDirectionsUrl(hospital.lat, hospital.lng, userLocation?.lat, userLocation?.lng)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const navUrl = getGoogleMapsDirectionsUrl(hospital.lat, hospital.lng, userLocation?.lat, userLocation?.lng);

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: 'rgba(2, 6, 23, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}
        >
          <GlassCard className="p-0" style={{ overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'linear-gradient(145deg, rgba(13, 27, 62, 0.95), rgba(7, 15, 38, 0.98))' }}>
            
            {/* Header Image */}
            <div style={{ position: 'relative', height: 210, width: '100%', overflow: 'hidden', background: '#0a192f' }}>
              <img 
                src={hospital.photo} 
                alt={hospital.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(7, 15, 38, 0.95) 100%)' }} />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              {/* Emergency Badge */}
              {hospital.emergency && (
                <div style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)'
                }}>
                  <ShieldAlert size={14} /> 24x7 Emergency Services
                </div>
              )}

              {/* Title & Category inside Header */}
              <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--neon-warn)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {hospital.type}
                </span>
                <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>
                  {hospital.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px 24px' }}>

              {/* Key Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Distance</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 2 }}>
                    <MapPin size={14} /> {hospital.distanceFormatted || `${hospital.distanceKm} km`}
                  </strong>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Rating</span>
                  <strong style={{ fontSize: '1rem', color: '#FFB347', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 2 }}>
                    <Star size={14} fill="#FFB347" /> {hospital.rating} ({hospital.user_ratings_total || 150})
                  </strong>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Status</span>
                  <strong style={{ fontSize: '0.85rem', color: hospital.openNow ? '#39FF14' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 2 }}>
                    <Clock size={13} /> {hospital.is24hr ? 'Open 24/7' : (hospital.openNow ? 'Open Now' : 'Closed')}
                  </strong>
                </div>
              </div>

              {/* Hospital Contact Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={16} color="var(--neon-cyan)" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Address</span>
                    <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0 }}>{hospital.address}</p>
                  </div>
                </div>

                {hospital.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={16} color="#39FF14" />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Emergency Contact</span>
                      <a href={`tel:${hospital.phone}`} style={{ fontSize: '0.85rem', color: '#39FF14', fontWeight: 600, textDecoration: 'none' }}>
                        {hospital.phone}
                      </a>
                    </div>
                  </div>
                )}

                {hospital.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255, 179, 71, 0.1)', border: '1px solid rgba(255, 179, 71, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Globe size={16} color="#FFB347" />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Website</span>
                      <a href={hospital.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', textDecoration: 'underline' }}>
                        {hospital.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
                <a 
                  href={navUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <GlassButton variant="primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 16px' }}>
                    <Navigation size={16} /> Navigate
                  </GlassButton>
                </a>

                {hospital.phone ? (
                  <a href={`tel:${hospital.phone}`} style={{ textDecoration: 'none' }}>
                    <GlassButton style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', background: 'rgba(57, 255, 20, 0.12)', border: '1px solid rgba(57, 255, 20, 0.3)', color: '#39FF14' }}>
                      <Phone size={16} /> Call Hospital
                    </GlassButton>
                  </a>
                ) : (
                  <GlassButton onClick={handleShare} style={{ width: '100%', justifyContent: 'center' }}>
                    {copied ? <CheckCircle2 size={16} color="#39FF14" /> : <Share2 size={16} />} {copied ? 'Copied Link' : 'Share Location'}
                  </GlassButton>
                )}
              </div>

              {/* Secondary Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={toggleFavorite}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isSaved ? '#ef4444' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={15} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : 'var(--text-secondary)'} />
                  {isSaved ? 'Saved in Favorites' : 'Save to Favorites'}
                </button>

                <button
                  onClick={handleShare}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--neon-cyan)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={15} /> {copied ? 'Link Copied!' : 'Share Info'}
                </button>
              </div>

            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
