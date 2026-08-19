import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { MessageCircle, X, Send, Sparkles, Zap, Stethoscope, Apple, AlertTriangle } from 'lucide-react-native';
import { useChatStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';

const { width, height } = Dimensions.get('window');

const quickActions = [
  { label: 'Analyze symptoms', icon: Stethoscope, prompt: 'I want to analyze my symptoms. Can you help me?', context: 'symptoms' },
  { label: 'Plan my meals', icon: Apple, prompt: 'Help me plan healthy meals for today based on a balanced diet.', context: 'diet' },
  { label: 'Emergency help', icon: AlertTriangle, prompt: 'I need emergency health guidance. What should I do?', context: 'symptoms' },
  { label: 'Health tips', icon: Zap, prompt: 'Give me 5 personalized health tips for today.', context: 'general' },
];

export function FloatingChat() {
  const { messages, isStreaming, isOpen, addMessage, updateLastBotMessage, setStreaming, toggleChat } = useChatStore();
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [messages]);

  const handleSend = async (text = input, overrideContext = '') => {
    if (!text.trim() || isStreaming) return;
    
    const userMsg = text.trim();
    const lower = userMsg.toLowerCase();
    
    let ctx = overrideContext || 'general';
    if (!overrideContext) {
      if (lower.includes('meal') || lower.includes('diet') || lower.includes('food') || lower.includes('eat')) {
        ctx = 'diet';
      } else if (lower.includes('symptom') || lower.includes('pain') || lower.includes('fever')) {
        ctx = 'symptoms';
      } else if (lower.includes('doctor') || lower.includes('specialist')) {
        ctx = 'doctor';
      } else if (lower.includes('exercise') || lower.includes('workout') || lower.includes('walk')) {
        ctx = 'exercise';
      }
    }

    setInput('');
    addMessage({ role: 'user', content: userMsg });
    addMessage({ role: 'assistant', content: '' });
    setStreaming(true);

    try {
      let fullResponse = '';
      for await (const chunk of streamHealthGenie(userMsg, ctx)) {
        fullResponse = chunk.full;
        updateLastBotMessage(fullResponse);
      }
    } catch (err) {
      updateLastBotMessage('Sorry, I encountered an error. Please try again.');
    }
    
    setStreaming(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={toggleChat}
        style={styles.fab}
        activeOpacity={0.8}
      >
        {isOpen ? <X size={24} color="#FFFFFF" /> : <MessageCircle size={24} color="#FFFFFF" />}
      </TouchableOpacity>

      {isOpen && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainerWrapper}
          pointerEvents="box-none"
        >
          <Animated.View 
            entering={SlideInDown.springify().damping(28).stiffness(350)}
            exiting={SlideOutDown}
            style={styles.chatWindow}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconBox}>
                  <Sparkles size={16} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>HealthGenie AI</Text>
                  <Text style={styles.headerSubtitle}>Your clinical health assistant</Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleChat} style={styles.closeBtn}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {messages.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconBox}>
                    <Sparkles size={28} color="#2563EB" />
                  </View>
                  <Text style={styles.emptyTitle}>How can I help you today?</Text>
                  <Text style={styles.emptySubtitle}>Ask any medical, diet, or exercise questions</Text>
                  
                  <View style={styles.quickActions}>
                    {quickActions.map((action) => (
                      <TouchableOpacity
                        key={action.label}
                        onPress={() => handleSend(action.prompt, action.context)}
                        style={styles.actionBtn}
                        activeOpacity={0.7}
                      >
                        <action.icon size={14} color="#2563EB" />
                        <Text style={styles.actionText}>{action.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                messages.map((msg: any, index: number) => {
                  const isUser = msg.role === 'user';
                  const isLastBot = !isUser && index === messages.length - 1;
                  
                  return (
                    <Animated.View 
                      key={msg.id ? `msg-${msg.id}-${index}` : `msg-${index}`} 
                      entering={FadeInUp}
                      style={[styles.msgBubble, isUser ? styles.userBubble : styles.botBubble]}
                    >
                      {!isUser && (
                        <View style={styles.botAvatar}>
                          <Sparkles size={12} color="#FFFFFF" />
                        </View>
                      )}
                      <View style={[styles.msgContent, isUser ? styles.userContent : styles.botContent]}>
                        <Text style={[styles.msgText, isUser ? styles.userText : styles.botText]}>
                          {msg.content || (isStreaming && isLastBot ? '...' : '')}
                        </Text>
                      </View>
                    </Animated.View>
                  );
                })
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                placeholder="Ask HealthGenie AI..."
                placeholderTextColor="#9CA3AF"
                value={input}
                onChangeText={setInput}
                editable={!isStreaming}
                onSubmitEditing={() => handleSend()}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, input.trim() ? styles.sendBtnActive : {}]}
                onPress={() => handleSend()}
                disabled={isStreaming || !input.trim()}
              >
                {isStreaming ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send size={16} color={input.trim() ? '#FFFFFF' : '#9CA3AF'} />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  chatContainerWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 160,
    paddingRight: 20,
    zIndex: 9998,
  },
  chatWindow: {
    width: width - 40,
    maxWidth: 400,
    height: height * 0.55,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  closeBtn: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  msgBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  botBubble: {
    alignSelf: 'flex-start',
    gap: 8,
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  msgContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userContent: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  botContent: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#1F2937',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#2563EB',
  }
});
