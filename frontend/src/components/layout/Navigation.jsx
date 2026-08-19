import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Activity, Droplets, Apple, Dumbbell,
  Heart, Baby, AlertTriangle, BarChart3, Settings,
  ChevronLeft, ChevronRight, Stethoscope, HeartPulse,
  Bell, User, Search, Menu, X, Sparkles, Shield, UserRound
} from 'lucide-react';
import { useAuthStore } from '../../store/healthStore';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/health-score', icon: Activity, label: 'Health Score' },
  { path: '/symptoms/select', icon: Stethoscope, label: 'Symptoms' },
  { path: '/water', icon: Droplets, label: 'Water' },
  { path: '/diet/plan', icon: Apple, label: 'Diet' },
  { path: '/exercise/recommendations', icon: Dumbbell, label: 'Exercise' },
  { path: '/first-aid', icon: HeartPulse, label: 'First Aid' },
  { path: '/doctor/recommendation', icon: UserRound, label: 'Doctor' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency', danger: true },
  { path: '/women/dashboard', icon: Heart, label: "Women's Health", fem: true },
  { path: '/pregnancy/dashboard', icon: Baby, label: 'Pregnancy', preg: true },
  { path: '/analytics/progress', icon: BarChart3, label: 'Analytics' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/settings/profile', icon: Settings, label: 'Settings' },
];

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/health-score', icon: Activity, label: 'Health' },
  { path: '/symptoms/select', icon: Stethoscope, label: 'Symptoms' },
  { path: '/women/dashboard', icon: Heart, label: 'Women' },
  { path: '/settings/profile', icon: Settings, label: 'More' },
];

// ━━━ SIDEBAR (Linear/Notion Light Style) ━━━
export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      if (item.fem || item.preg) {
        return user?.gender === 'female';
      }
      return true;
    });
  }, [user]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflowX: 'hidden',
        overflowY: 'auto',
        boxShadow: '2px 0 12px rgba(0,0,0,0.02)',
      }}
      className="hidden md:flex"
    >
      {/* Logo Container */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid #F1F5F9',
        minHeight: 64,
      }}>
        <motion.div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles size={20} color="#FFFFFF" />
        </motion.div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              style={{
                fontFamily: 'Inter',
                fontSize: '1.05rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              HealthGenie
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items List */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/'));
          const Icon = item.icon;
          
          let activeBg = '#EFF6FF';
          let activeColor = '#2563EB';
          if (item.danger) {
            activeBg = '#FEF2F2';
            activeColor = '#EF4444';
          } else if (item.fem) {
            activeBg = '#F3E8FF';
            activeColor = '#8B5CF6';
          } else if (item.preg) {
            activeBg = '#FEF3C7';
            activeColor = '#D97706';
          }

          return (
            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 12px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: isActive ? activeBg : 'transparent',
                  border: isActive ? `1px solid ${activeColor}30` : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  minHeight: 42,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isActive ? `${activeColor}18` : '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}>
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? activeColor : '#6B7280',
                      transition: 'color 0.2s',
                    }}
                  />
                </div>
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '0.88rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? activeColor : '#374151',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
}

// ━━━ SEARCHABLE FEATURES INDEX ━━━
const searchableFeatures = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & health stats', category: 'Main', color: '#2563EB' },
  { path: '/health-score', icon: Activity, label: 'Health Score', desc: 'AI health score analysis', category: 'Health', color: '#10B981' },
  { path: '/symptoms/select', icon: Stethoscope, label: 'Symptom Analysis', desc: 'AI-powered symptom checker', category: 'Health', color: '#2563EB', keywords: ['symptoms', 'diagnosis', 'check', 'sick', 'illness', 'disease'] },
  { path: '/water', icon: Droplets, label: 'Water Tracker', desc: 'Daily hydration tracking', category: 'Wellness', color: '#06B6D4', keywords: ['hydration', 'drink', 'fluid'] },
  { path: '/diet/plan', icon: Apple, label: 'Diet & Nutrition', desc: 'Personalized meal plans', category: 'Wellness', color: '#10B981', keywords: ['food', 'meal', 'nutrition', 'calories', 'recipe'] },
  { path: '/exercise/recommendations', icon: Dumbbell, label: 'Exercise & Workout', desc: 'Custom fitness routines', category: 'Fitness', color: '#3B82F6', keywords: ['workout', 'gym', 'fitness', 'training', 'yoga'] },
  { path: '/exercise/pain-relief', icon: HeartPulse, label: 'Pain Relief Exercises', desc: 'Targeted pain management', category: 'Fitness', color: '#F97316', keywords: ['pain', 'back', 'neck', 'stretch'] },
  { path: '/first-aid', icon: HeartPulse, label: 'First Aid Guide', desc: 'Emergency care procedures', category: 'Emergency', color: '#F97316', keywords: ['burn', 'cut', 'cpr', 'choking', 'injury'] },
  { path: '/doctor/recommendation', icon: UserRound, label: 'Find Doctors', desc: 'Nearby doctor discovery', category: 'Medical', color: '#8B5CF6', keywords: ['physician', 'clinic', 'hospital', 'specialist'] },
  { path: '/doctor/specialist', icon: Stethoscope, label: 'Specialist Triage', desc: 'AI specialist recommendation', category: 'Medical', color: '#8B5CF6', keywords: ['specialist', 'referral', 'consult'] },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency Hub', desc: 'SOS & emergency contacts', category: 'Emergency', color: '#EF4444', keywords: ['sos', 'ambulance', '911', 'urgent'] },
  { path: '/emergency/hospitals', icon: AlertTriangle, label: 'Nearby Hospitals', desc: 'GPS-based hospital finder', category: 'Emergency', color: '#EF4444', keywords: ['hospital', 'er', 'urgent care'] },
  { path: '/emergency/contacts', icon: AlertTriangle, label: 'Emergency Contacts', desc: 'Manage emergency contacts', category: 'Emergency', color: '#EF4444' },
  { path: '/women/dashboard', icon: Heart, label: "Women's Health", desc: 'Period & PCOS care hub', category: "Women's Care", color: '#8B5CF6', keywords: ['female', 'woman', 'women', 'menstrual'] },
  { path: '/women/period-tracker', icon: Heart, label: 'Period Tracker', desc: 'Menstrual cycle tracking', category: "Women's Care", color: '#8B5CF6', keywords: ['period', 'menstruation', 'cycle', 'menstrual'] },
  { path: '/women/period-insights', icon: Heart, label: 'Period Insights', desc: 'Cycle analytics & patterns', category: "Women's Care", color: '#8B5CF6' },
  { path: '/women/pcos-care', icon: Heart, label: 'PCOS Care', desc: 'PCOS symptom management', category: "Women's Care", color: '#8B5CF6', keywords: ['pcos', 'polycystic', 'ovary'] },
  { path: '/women/skin-care', icon: Heart, label: 'Skin Care', desc: 'AI skincare routines', category: "Women's Care", color: '#8B5CF6', keywords: ['skin', 'acne', 'glow', 'beauty'] },
  { path: '/women/diet', icon: Heart, label: "Women's Diet", desc: 'Hormone-balanced nutrition', category: "Women's Care", color: '#8B5CF6' },
  { path: '/pregnancy/dashboard', icon: Baby, label: 'Pregnancy Care', desc: 'Maternal health dashboard', category: 'Pregnancy', color: '#F59E0B', keywords: ['pregnant', 'baby', 'prenatal', 'maternal'] },
  { path: '/pregnancy/trimester', icon: Baby, label: 'Trimester Tracker', desc: 'Week-by-week development', category: 'Pregnancy', color: '#F59E0B', keywords: ['trimester', 'weeks'] },
  { path: '/pregnancy/weekly-tips', icon: Baby, label: 'Weekly Pregnancy Tips', desc: 'Health & wellness advice', category: 'Pregnancy', color: '#F59E0B' },
  { path: '/pregnancy/diet', icon: Baby, label: 'Pregnancy Diet', desc: 'Trimester nutrition plans', category: 'Pregnancy', color: '#F59E0B' },
  { path: '/pregnancy/exercise', icon: Baby, label: 'Pregnancy Exercise', desc: 'Safe prenatal workouts', category: 'Pregnancy', color: '#F59E0B' },
  { path: '/pregnancy/doctor-visits', icon: Baby, label: 'Doctor Visits', desc: 'Checkup schedule & reminders', category: 'Pregnancy', color: '#F59E0B' },
  { path: '/analytics/progress', icon: BarChart3, label: 'Analytics', desc: 'Health progress & charts', category: 'Reports', color: '#2563EB', keywords: ['report', 'chart', 'graph', 'stats', 'progress'] },
  { path: '/analytics/streaks', icon: BarChart3, label: 'Streaks', desc: 'Health habit achievements', category: 'Reports', color: '#2563EB' },
  { path: '/analytics/health-report', icon: BarChart3, label: 'Health Report', desc: 'Downloadable health report', category: 'Reports', color: '#2563EB' },
  { path: '/notifications', icon: Bell, label: 'Notifications', desc: 'Alerts & reminder settings', category: 'Settings', color: '#6B7280', keywords: ['reminder', 'alert', 'push'] },
  { path: '/settings/profile', icon: Settings, label: 'Profile Settings', desc: 'Update personal info', category: 'Settings', color: '#6B7280', keywords: ['account', 'profile', 'name', 'email'] },
  { path: '/settings/about', icon: Settings, label: 'About', desc: 'App info & version', category: 'Settings', color: '#6B7280' },
];

// ━━━ TOP BAR (Light Sticky Navbar with Command Palette Search) ━━━
export function TopBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const unreadCount = 3;

  const { user } = useAuthStore();

  // Fuzzy search
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return searchableFeatures
      .filter(f => {
        // Filter out women/pregnancy if not female
        if ((f.category === "Women's Care" || f.category === 'Pregnancy') && user?.gender !== 'female') {
          return false;
        }
        
        const haystack = [f.label, f.desc, f.category, ...(f.keywords || [])].join(' ').toLowerCase();
        // Match if all words in query appear somewhere in haystack
        return q.split(/\s+/).every(word => haystack.includes(word));
      })
      .slice(0, 8);
  }, [query, user]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups = {};
    results.forEach(r => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [results]);

  const flatResults = results;

  // Navigate to result
  const handleSelect = useCallback((path) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(0);
    inputRef.current?.blur();
  }, [navigate]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && flatResults[activeIndex]) {
      e.preventDefault();
      handleSelect(flatResults[activeIndex].path);
    } else if (e.key === 'Escape') {
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, [flatResults, activeIndex, handleSelect]);

  // Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0); }, [results]);

  // Scroll active item into view
  useEffect(() => {
    const el = document.getElementById(`search-result-${activeIndex}`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 72,
        height: 64,
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
      className="hidden md:flex"
    >
      {/* LEFT — App Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160, flexShrink: 0 }}>
        <span style={{ fontFamily: 'Inter', fontSize: '1rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
          HealthGenie
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: '#EFF6FF', color: '#2563EB' }}>
          PRO
        </span>
      </div>

      {/* CENTER — Working Search Bar */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 24px' }} ref={dropdownRef}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
          <div style={{
            padding: '8px 16px',
            background: isOpen ? '#FFFFFF' : '#F1F5F9',
            borderRadius: isOpen && query ? '16px 16px 0 0' : 24,
            border: isOpen ? '1px solid #2563EB' : '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'all 0.2s ease',
            boxShadow: isOpen ? '0 4px 20px rgba(37, 99, 235, 0.1)' : 'none',
          }}>
            <Search size={16} style={{ color: isOpen ? '#2563EB' : '#9CA3AF', flexShrink: 0, transition: 'color 0.2s' }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search features, modules, pages..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#111827',
                fontSize: '0.88rem',
                fontFamily: 'Inter',
                width: '100%',
              }}
            />
            {query ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <X size={14} color="#9CA3AF" />
              </motion.button>
            ) : (
              <span style={{ fontSize: '0.7rem', color: '#9CA3AF', background: '#FFFFFF', padding: '2px 6px', borderRadius: 4, border: '1px solid #E2E8F0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Ctrl+K
              </span>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isOpen && query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderTop: 'none',
                  borderRadius: '0 0 16px 16px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  maxHeight: 400,
                  overflowY: 'auto',
                  zIndex: 200,
                }}
              >
                {flatResults.length > 0 ? (
                  <div style={{ padding: '6px 0' }}>
                    {Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category}>
                        <div style={{ padding: '8px 16px 4px', fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {category}
                        </div>
                        {items.map((item) => {
                          const idx = flatResults.indexOf(item);
                          const isActive = idx === activeIndex;
                          const Icon = item.icon;
                          return (
                            <div
                              id={`search-result-${idx}`}
                              key={item.path}
                              onClick={() => handleSelect(item.path)}
                              onMouseEnter={() => setActiveIndex(idx)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 16px',
                                cursor: 'pointer',
                                background: isActive ? '#F1F5F9' : 'transparent',
                                transition: 'background 0.1s',
                                margin: '0 6px',
                                borderRadius: 10,
                              }}
                            >
                              <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: `${item.color}14`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}>
                                <Icon size={18} style={{ color: item.color }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{item.label}</div>
                                <div style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.3 }}>{item.desc}</div>
                              </div>
                              {isActive && (
                                <span style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>Enter ↵</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <Search size={24} style={{ color: '#D1D5DB', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#6B7280' }}>No results found</p>
                    <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 2 }}>Try "exercise", "pregnancy", "diet", or "women"</p>
                  </div>
                )}

                {/* Footer hint */}
                <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 16, justifyContent: 'center' }}>
                  {[
                    { key: '↑↓', label: 'Navigate' },
                    { key: '↵', label: 'Open' },
                    { key: 'Esc', label: 'Close' },
                  ].map(h => (
                    <span key={h.key} style={{ fontSize: '0.68rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: 4, fontWeight: 600, fontSize: '0.65rem', border: '1px solid #E2E8F0' }}>{h.key}</span>
                      {h.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT — Notifications & Profile Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <NavLink to="/notifications" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 38, height: 38, borderRadius: 12, background: '#F8FAFC',
              border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative', cursor: 'pointer',
            }}
          >
            <Bell size={18} style={{ color: '#4B5563' }} />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 0 2px #FFFFFF' }}
              />
            )}
          </motion.div>
        </NavLink>
        <NavLink to="/settings/profile" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              border: '2px solid #FFFFFF',
            }}
          >
            <User size={18} color="#FFFFFF" />
          </motion.div>
        </NavLink>
      </div>
    </div>
  );
}

// ━━━ BOTTOM NAV (Mobile Light Theme) ━━━
export function BottomNav() {
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredMobileNavItems = useMemo(() => {
    return mobileNavItems.filter(item => {
      if (item.path.startsWith('/women') || item.path.startsWith('/pregnancy')) {
        return user?.gender === 'female';
      }
      return true;
    });
  }, [user]);

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 68,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
      }}
      className="md:hidden"
    >
      {filteredMobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/'));
        return (
          <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                borderRadius: 12,
                position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  style={{
                    position: 'absolute',
                    top: -2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    background: '#2563EB',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                style={{
                  color: isActive ? '#2563EB' : '#6B7280',
                }}
              />
              <span style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563EB' : '#6B7280',
              }}>
                {item.label}
              </span>
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default { Sidebar, TopBar, BottomNav };
