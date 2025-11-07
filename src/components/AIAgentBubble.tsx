import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AIAgentBubble: React.FC = () => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<any>(null);

  // Mock conversations in French
  const mockConversations = [
    {
      user: "Bonjour, pouvez-vous m'aider à analyser mon portefeuille?",
      ai: "Bonjour! Bien sûr, je serais ravi de vous aider. J'ai analysé votre portefeuille et je constate que vous avez une bonne diversification sectorielle avec 45% en technologie, 30% en finance et 25% en énergie."
    },
    {
      user: "Quels sont les risques principaux de mon portefeuille?",
      ai: "Les principaux risques identifiés sont:\n\n1. **Concentration sectorielle**: Exposition élevée au secteur technologique (45%)\n2. **Volatilité**: Delta moyen de 0.65, ce qui indique une sensibilité aux mouvements du sous-jacent\n3. **Risque de crédit**: 15% du portefeuille est noté HY\n\nJe recommande une diversification accrue pour réduire ces risques."
    },
    {
      user: "Quelle est la performance YTD?",
      ai: "La performance Year-to-Date de votre portefeuille est de **+8.3%**, ce qui est excellent! Cela surperforme le benchmark de 2.1 points.\n\nLes principales contributions:\n• TotalEnergies 0.875% 2028: +1.2%\n• Volkswagen 0.5% 2027: +0.9%\n• Schneider 0% 2026: +0.7%"
    },
  ];

  useEffect(() => {
    // Initialize with mock conversation
    if (messages.length === 0) {
      const initialMessages: Message[] = [
        {
          id: '1',
          text: "Bonjour! Je suis votre assistant ConvPilot AI. Comment puis-je vous aider aujourd'hui?",
          sender: 'ai',
          timestamp: new Date(Date.now() - 3600000),
        },
        ...mockConversations.flatMap((conv, idx) => [
          {
            id: `user-${idx}`,
            text: conv.user,
            sender: 'user' as const,
            timestamp: new Date(Date.now() - 3600000 + idx * 300000),
          },
          {
            id: `ai-${idx}`,
            text: conv.ai,
            sender: 'ai' as const,
            timestamp: new Date(Date.now() - 3600000 + idx * 300000 + 5000),
          },
        ]),
      ];
      setMessages(initialMessages);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current && isOpen) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: "Merci pour votre question. Je suis en train d'analyser les données pour vous fournir une réponse personnalisée. Veuillez patienter un instant...",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed' as any,
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
        onHoverIn={(e: any) => {
          e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
        }}
        onHoverOut={(e: any) => {
          e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
        }}
      >
        {!isOpen ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28, color: '#ffffff', fontWeight: '700' }}>AI</Text>
            <View
              style={{
                position: 'absolute' as any,
                top: -2,
                right: -2,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: colors.success,
                borderWidth: 2,
                borderColor: colors.accent,
              }}
            />
          </View>
        ) : (
          <Text style={{ fontSize: 32, color: '#ffffff', fontWeight: '300' }}>×</Text>
        )}
      </TouchableOpacity>

      {/* Chat Window */}
      {isOpen && (
        <View
          style={{
            position: 'fixed' as any,
            bottom: 100,
            right: 24,
            width: 420,
            height: 600,
            backgroundColor: colors.surface,
            borderRadius: parseInt(colors.borderRadius.large),
            borderWidth: 1,
            borderColor: colors.border,
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
            zIndex: 998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideInUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <View
            style={{
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              backgroundColor: colors.surfaceElev,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, color: '#ffffff', fontWeight: '700' }}>CP</Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '700',
                    color: colors.textPrimary,
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  ConvPilot AI
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.success,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.xsmall),
                      color: colors.textSecondary,
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    En ligne
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={{
              flex: 1,
              padding: 20,
            }}
            contentContainerStyle={{ gap: 16 }}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <View
                  style={{
                    padding: 12,
                    borderRadius: parseInt(colors.borderRadius.medium),
                    backgroundColor: message.sender === 'user' ? colors.accent : colors.surfaceCard,
                    borderWidth: message.sender === 'ai' ? 1 : 0,
                    borderColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.default),
                      color: message.sender === 'user' ? '#ffffff' : colors.textPrimary,
                      fontFamily: typography.fontFamily.body,
                      lineHeight: parseInt(typography.fontSize.default) * 1.5,
                    }}
                  >
                    {message.text}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: parseInt(typography.fontSize.xsmall),
                    color: colors.textMuted,
                    fontFamily: typography.fontFamily.body,
                    marginTop: 4,
                    marginLeft: message.sender === 'user' ? 0 : 8,
                    marginRight: message.sender === 'user' ? 8 : 0,
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <View
                style={{
                  alignSelf: 'flex-start',
                  padding: 12,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  backgroundColor: colors.surfaceCard,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.textSecondary,
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.textSecondary,
                      animation: 'pulse 1.5s ease-in-out 0.2s infinite',
                    }}
                  />
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.textSecondary,
                      animation: 'pulse 1.5s ease-in-out 0.4s infinite',
                    }}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.surfaceElev,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleSendMessage}
                placeholder="Tapez votre message..."
                placeholderTextColor={colors.textMuted}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.default),
                  fontFamily: typography.fontFamily.body,
                  outline: 'none',
                }}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!inputValue.trim()}
                style={{
                  padding: 12,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  backgroundColor: inputValue.trim() ? colors.accent : colors.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                }}
              >
                <Text style={{ fontSize: 20, color: '#ffffff' }}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

