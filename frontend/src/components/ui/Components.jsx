import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// ━━━ GLASS CARD (Light Theme) ━━━
export function GlassCard({ children, className = '', hover = true, onClick, neon = false, style = {} }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !hover) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
    cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
  }, [hover]);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card ${neon ? 'neon-border' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={hover ? { y: -3, transition: { duration: 0.2, ease: 'easeOut' } } : {}}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(500px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(37, 99, 235, 0.04), transparent 65%)',
            pointerEvents: 'none',
            borderRadius: '20px',
            zIndex: 1,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}

// ━━━ METAL CARD (Light Surface) ━━━
export function MetalCard({ children, className = '', style = {} }) {
  return (
    <div className={`metal-card ${className}`} style={style}>
      {children}
    </div>
  );
}

// ━━━ GLASS BUTTON (Light Theme) ━━━
export function GlassButton({ children, variant = 'default', onClick, disabled, className = '', type = 'button', fullWidth = false, style = {} }) {
  const variantClass = {
    default: 'glass-btn',
    primary: 'glass-btn glass-btn-primary',
    danger: 'glass-btn glass-btn-danger',
    fem: 'glass-btn glass-btn-fem',
    preg: 'glass-btn glass-btn-preg',
  }[variant] || 'glass-btn';

  return (
    <motion.button
      type={type}
      className={`${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      style={{
        ...style,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}

// ━━━ GLASS INPUT (Light Theme) ━━━
export function GlassInput({ label, error, icon: Icon, ...props }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label className="text-eyebrow" style={{ display: 'block', marginBottom: 6, color: '#374151', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.85rem', fontWeight: 600 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
              zIndex: 2,
            }}
          />
        )}
        <input
          className={`glass-input ${error ? 'glass-input-error' : ''}`}
          style={Icon ? { paddingLeft: 42 } : {}}
          {...props}
        />
      </div>
      {error && (
        <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4, fontFamily: 'Inter', fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ━━━ ANIMATED TOGGLE ━━━
export function AnimatedToggle({ active, onToggle, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      {label && <span style={{ color: '#111827', fontSize: '0.95rem', fontWeight: 500 }}>{label}</span>}
      <motion.div
        className={`toggle-switch ${active ? 'active' : ''}`}
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
}

// ━━━ PROGRESS RING (Light Mode) ━━━
export function ProgressRing({ value = 0, max = 100, size = 130, strokeWidth = 8, color = '#2563EB', bgColor = '#F1F5F9', children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        {children}
      </div>
    </div>
  );
}

// ━━━ ANIMATED COUNTER ━━━
export function AnimatedCounter({ value, suffix = '', prefix = '', className = '' }) {
  return (
    <motion.span
      className={`font-body ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
      style={{ fontWeight: 700 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

// ━━━ SKELETON LOADER ━━━
export function SkeletonLoader({ width = '100%', height = 20, borderRadius = 12, count = 1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width, height, borderRadius }}
        />
      ))}
    </div>
  );
}

// ━━━ PAGE TRANSITION WRAPPER ━━━
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ━━━ SECTION HEADER ━━━
export function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ textAlign: align, marginBottom: 28 }}
    >
      {eyebrow && <p className="text-eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</p>}
      <h2 className="text-section" style={{ color: '#111827' }}>{title}</h2>
      {subtitle && (
        <p style={{ color: '#6B7280', marginTop: 6, maxWidth: 600, margin: align === 'center' ? '6px auto 0' : '6px 0 0', fontSize: '0.95rem' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ━━━ CHIP ━━━
export function Chip({ label, active, onClick, variant = 'default', removable, onRemove }) {
  const variantClass = {
    default: 'chip',
    danger: 'chip chip-danger',
    fem: 'chip chip-fem',
    preg: 'chip chip-preg',
  }[variant];

  return (
    <motion.span
      className={`${variantClass} ${active ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
      {removable && (
        <span
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          style={{ marginLeft: 4, cursor: 'pointer', opacity: 0.7 }}
        >
          ×
        </span>
      )}
    </motion.span>
  );
}

// ━━━ EMPTY STATE ━━━
export function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        textAlign: 'center',
        padding: '50px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {Icon && <Icon size={56} style={{ color: '#2563EB', opacity: 0.7 }} />}
      <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111827' }}>{title}</h3>
      <p style={{ color: '#6B7280', maxWidth: 400, fontSize: '0.9rem' }}>{description}</p>
      {action && (
        <GlassButton variant="primary" onClick={onAction}>
          {action}
        </GlassButton>
      )}
    </motion.div>
  );
}

// ━━━ NEURAL PROCESSING ANIMATION (Light Theme) ━━━
export function NeuralProcessing({ text = 'HealthGenie is analyzing...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 20px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: '2px solid',
              borderColor: '#2563EB',
              borderRadius: '50%',
              opacity: 0.2,
            }}
            animate={{ 
              rotate: 360, 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.4, 0.15] 
            }}
            transition={{
              rotate: { duration: 3 + i, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 },
            }}
          />
        ))}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 6,
        }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#2563EB',
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
      <motion.p
        style={{ color: '#2563EB', fontSize: '0.95rem', fontWeight: 600, fontFamily: 'Inter' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}

// ━━━ AI MESSAGE BUBBLE (Light Theme) ━━━
export function AIMessageBubble({ content, isUser = false, isStreaming = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          padding: '12px 18px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isUser ? '#2563EB' : '#F8FAFC',
          border: isUser ? 'none' : '1px solid #E5E7EB',
          color: isUser ? '#FFFFFF' : '#111827',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          boxShadow: isUser ? '0 2px 8px rgba(37,99,235,0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        {content}
        {isStreaming && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ color: isUser ? '#FFFFFF' : '#2563EB' }}
          >
            ▊
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

// ━━━ STREAK BADGE (Light Mode) ━━━
export function StreakBadge({ count }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 20,
      background: '#FEF3C7',
      border: '1px solid #FDE68A',
    }}>
      <motion.span
        className="streak-flame"
        style={{ fontSize: '1.1rem' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        🔥
      </motion.span>
      <span className="font-body" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#D97706' }}>
        {count}
      </span>
      <span style={{ color: '#B45309', fontSize: '0.75rem', fontWeight: 500 }}>day streak</span>
    </div>
  );
}
