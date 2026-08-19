import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, useAnimatedProps } from 'react-native-reanimated';

// ━━━ GLASS CARD ━━━
export function GlassCard({ children, className = '', hover = true, onPress, neon = false, style = {} }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const handlePressIn = () => { if (hover) scale.value = withSpring(0.98); };
  const handlePressOut = () => { if (hover) scale.value = withSpring(1); };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[
      styles.glassCard,
      neon ? styles.neonBorder : {},
      style,
      animatedStyle
    ]}>
      <CardComponent
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={{ padding: 16 }}
      >
        {children}
      </CardComponent>
    </Animated.View>
  );
}

// ━━━ GLASS BUTTON ━━━
export function GlassButton({ children, variant = 'default', onPress, disabled, className = '', fullWidth = false, style = {} }: any) {
  const getBackgroundColor = () => {
    switch(variant) {
      case 'primary': return '#2563EB';
      case 'danger': return '#EF4444';
      case 'fem': return '#EC4899';
      case 'preg': return '#F59E0B';
      default: return '#F1F5F9';
    }
  };

  const getTextColor = () => {
    return variant === 'default' ? '#111827' : '#FFFFFF';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), width: fullWidth ? '100%' : 'auto', opacity: disabled ? 0.5 : 1 },
        style
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: getTextColor() }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ━━━ GLASS INPUT ━━━
export function GlassInput({ label, error, icon: Icon, style, ...props }: any) {
  return (
    <View style={[{ width: '100%', marginBottom: 12 }, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon size={18} color="#9CA3AF" />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            Icon ? { paddingLeft: 42 } : {},
            error ? styles.inputError : {}
          ]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

// ━━━ SKELETON LOADER ━━━
export function SkeletonLoader({ width = '100%', height = 20, borderRadius = 12, count = 1 }: any) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{ width, height, borderRadius, backgroundColor: '#E2E8F0', opacity: 0.7 }}
        />
      ))}
    </View>
  );
}

// ━━━ PROGRESS RING ━━━
import Svg, { Circle } from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({ value = 0, max = 100, size = 130, strokeWidth = 8, color = '#2563EB', bgColor = '#F1F5F9', children }: any) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (value / max) * circumference;
  
  const animatedOffset = useSharedValue(circumference);
  
  React.useEffect(() => {
    animatedOffset.value = withSpring(targetOffset, { damping: 14, stiffness: 45 });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={bgColor} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle 
          cx={size / 2} cy={size / 2} r={radius} 
          stroke={color} strokeWidth={strokeWidth} 
          fill="none" strokeLinecap="round" 
          strokeDasharray={circumference}
          animatedProps={animatedProps as any}
        />
      </Svg>
      <View style={{ position: 'absolute' }}>
        {children}
      </View>
    </View>
  );
}

// ━━━ ANIMATED COUNTER ━━━
export function AnimatedCounter({ value, suffix = '', prefix = '', style = {} }: any) {
  return (
    <Text style={style}>
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
    </Text>
  );
}

// ━━━ CHIP COMPONENT ━━━
export function Chip({ label, active, onPress, style = {} }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: active ? '#EC4899' : '#F1F5F9',
        borderWidth: 1,
        borderColor: active ? '#EC4899' : '#E2E8F0',
      }, style]}
    >
      <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#FFFFFF' : '#475569' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ━━━ STREAK BADGE ━━━
export function StreakBadge({ count }: { count: number }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20,
      backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A'
    }}>
      <Text style={{ fontSize: 16 }}>🔥</Text>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#D97706' }}>{count}</Text>
      <Text style={{ fontSize: 12, fontWeight: '500', color: '#B45309' }}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden'
  },
  neonBorder: {
    borderColor: '#00F5FF',
    shadowColor: '#00F5FF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center'
  },
  iconContainer: {
    position: 'absolute',
    left: 14,
    zIndex: 2,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500'
  }
});
