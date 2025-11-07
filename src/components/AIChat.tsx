import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { RobotIcon } from './Icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I am ConvPilot AI, your intelligent assistant for convertible bonds. How can I help you today?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    text: 'Can you explain the current market trends?',
    sender: 'user',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: '3',
    text: 'Of course! The convertible bond market is showing 8.5% growth this quarter. Technology and energy sectors are showing the best performance. The average delta is at 54.2%, indicating a balanced positioning between bond and equity characteristics.',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3480000),
  },
  {
    id: '4',
    text: 'What are the top-performing securities?',
    sender: 'user',
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: '5',
    text: 'The top 3 performing securities this week are:\n\n1. TechCorp CB 2026 (+12.5%)\n2. GreenEnergy Conv 2027 (+10.8%)\n3. BioPharm Bond 2025 (+9.3%)\n\nThese securities benefit from strong underlying equity market dynamics and favorable volatility.',
    sender: 'ai',
    timestamp: new Date(Date.now() - 3350000),
  },
];

export const AIChat: React.FC = () => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'I am searching for this information for you...',
        'According to my analysis, this trend is very interesting.',
        'I recommend checking the dashboard for more details.',
        'Excellent question! Let me explain...',
        'This data is available in the Aggregations section.',
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
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
          boxShadow: `0 8px 24px ${colors.accent}40`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onHoverIn={(e: any) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 32px ${colors.accent}60`;
        }}
        onHoverOut={(e: any) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = `0 8px 24px ${colors.accent}40`;
        }}
      >
        {/* Robot Icon */}
        <RobotIcon size={32} color="white" />
        
        {/* Notification Badge */}
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.danger,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.background,
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              fontSize: 10,
              fontWeight: '700',
            }}
          >
            5
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        position: 'fixed' as any,
        bottom: 24,
        right: 24,
        width: 400,
        height: 600,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: `0 20px 60px ${isDark ? '#00000080' : '#00000020'}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        animation: 'slideInUp 0.3s ease-out',
      }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.accent,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Robot Avatar */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#ffffff20',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RobotIcon size={24} color="white" />
          </View>

          <View>
            <Text
              style={{
                color: '#ffffff',
                fontSize: parseInt(typography.fontSize.default),
                fontWeight: '700',
                fontFamily: typography.fontFamily.heading,
              }}
            >
              ConvPilot AI
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#4ade80',
                }}
              />
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: parseInt(typography.fontSize.small),
                  opacity: 0.9,
                }}
              >
                Online
              </Text>
            </View>
          </View>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          onPress={() => setIsOpen(false)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#ffffff20',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onHoverIn={(e: any) => {
            e.currentTarget.style.backgroundColor = '#ffffff30';
          }}
          onHoverOut={(e: any) => {
            e.currentTarget.style.backgroundColor = '#ffffff20';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        contentContainerStyle={{
          padding: 16,
          gap: 16,
        }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
            }}
          >
            <View
              style={{
                backgroundColor: message.sender === 'user' ? colors.accent : colors.surface,
                padding: 12,
                borderRadius: 12,
                borderWidth: message.sender === 'ai' ? 1 : 0,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: message.sender === 'user' ? '#ffffff' : colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.default),
                  fontFamily: typography.fontFamily.body,
                  lineHeight: 20,
                }}
              >
                {message.text}
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: parseInt(typography.fontSize.small) - 2,
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
      </ScrollView>

      {/* Input Area */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          padding: 16,
          backgroundColor: colors.surface,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Write your message..."
            placeholderTextColor={colors.textSecondary}
            multiline
            onSubmitEditing={handleSendMessage}
            style={{
              flex: 1,
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: parseInt(colors.borderRadius.medium),
              padding: 12,
              color: colors.textPrimary,
              fontSize: parseInt(typography.fontSize.default),
              fontFamily: typography.fontFamily.body,
              maxHeight: 120,
              outline: 'none',
            }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: inputText.trim() ? colors.accent : colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
            onHoverIn={(e: any) => {
              if (inputText.trim()) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onHoverOut={(e: any) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Animation styles */}
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
        `}
      </style>
    </View>
  );
};

