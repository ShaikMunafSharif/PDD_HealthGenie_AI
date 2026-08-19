import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Zap, Stethoscope, Apple, AlertTriangle } from 'lucide-react';
import { useChatStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';
import { AIMessageBubble } from '../ui/Components';

const quickActions = [
  { label: 'Analyze symptoms', icon: Stethoscope, prompt: 'I want to analyze my symptoms. Can you help me?' },
  { label: 'Plan my meals', icon: Apple, prompt: 'Help me plan healthy meals for today based on a balanced diet.' },
  { label: 'Emergency help', icon: AlertTriangle, prompt: 'I need emergency health guidance. What should I do?' },
  { label: 'Health tips', icon: Zap, prompt: 'Give me 5 personalized health tips for today.' },
];

export function FloatingChat() {
  const { messages, isStreaming, isOpen, addMessage, updateLastBotMessage, setStreaming, toggleChat } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isStreaming) return;
    
    const userMsg = text.trim();
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    addMessage({ role: 'assistant', content: '' });
    setStreaming(true);

    try {
      for await (const chunk of streamHealthGenie(userMsg, 'general')) {
        updateLastBotMessage(chunk.full);
        if (chunk.done) break;
      }
    } catch (err) {
      updateLastBotMessage('Sorry, I encountered an error. Please try again.');
    }
    
    setStreaming(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed',
          bottom: 90,
          right: 24,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          border: '2px solid #FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
        }}
        className="md:bottom-6"
      >
        {isOpen ? <X size={22} color="#FFFFFF" /> : <MessageCircle size={22} color="#FFFFFF" />}
      </motion.button>

      {/* Chat Panel Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 24,
              width: 380,
              maxWidth: 'calc(100vw - 48px)',
              height: '52vh',
              maxHeight: 520,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              zIndex: 200,
              overflow: 'hidden',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -6px rgba(0, 0, 0, 0.04)',
            }}
            className="md:bottom-20"
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>HealthGenie AI</h3>
                  <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: 0 }}>Your clinical health assistant</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Messages Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              background: '#FFFFFF',
            }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Sparkles size={24} color="#2563EB" />
                  </div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: 4, fontFamily: 'Inter' }}>How can I help you today?</p>
                  <p style={{ color: '#6B7280', fontSize: '0.8rem', lineHeight: 1.4 }}>Ask any medical, diet, or exercise questions</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18, justifyContent: 'center' }}>
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSend(action.prompt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 12px',
                          fontSize: '0.78rem',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: 12,
                          color: '#2563EB',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'Inter',
                        }}
                      >
                        <action.icon size={14} />
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <AIMessageBubble
                    key={msg.id}
                    content={msg.content}
                    isUser={msg.role === 'user'}
                    isStreaming={isStreaming && msg.role === 'assistant' && msg === messages[messages.length - 1]}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              gap: 10,
              background: '#F8FAFC',
            }}>
              <input
                ref={inputRef}
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  outline: 'none',
                  color: '#111827',
                  fontFamily: 'Inter',
                }}
                placeholder="Ask HealthGenie AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isStreaming}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={isStreaming || !input.trim()}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: input.trim() ? '#2563EB' : '#E2E8F0',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                <Send size={16} color={input.trim() ? '#FFFFFF' : '#9CA3AF'} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingChat;
