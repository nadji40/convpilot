import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { HelpIcon } from './Icons';

const newsItems = [
  "📈 European Central Bank holds rates steady at 4.5% amid inflation concerns",
  "💼 Convertible bond issuance hits $180B globally in Q3 2024, up 15% YoY",
  "🏦 Deutsche Bank launches new €2B convertible bond program",
  "📊 S&P 500 reaches new highs as tech earnings beat expectations",
  "💰 Credit Suisse CB index shows 8.2% returns this quarter",
  "🌍 Asian markets rally on positive manufacturing data from China",
  "⚡ Tesla announces $5B convertible bond offering for expansion",
  "📉 Oil prices stabilize at $85/barrel after OPEC+ meeting",
  "🏢 Microsoft acquires AI startup for $12B in mixed securities deal",
  "💎 Gold futures climb to $2,100/oz on geopolitical tensions"
];

interface DocumentationBubbleProps {
  isVisible: boolean;
  onClose: () => void;
}

const DocumentationBubble = ({ isVisible, onClose }: DocumentationBubbleProps) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  if (!isVisible) return null;

  return (
    <View style={{
      position: 'absolute' as any,
      top: 60,
      right: 20,
      width: 400,
      maxWidth: '90vw',
      backgroundColor: isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      animation: 'fadeInScale 0.3s ease-out',
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{
          color: colors.textPrimary,
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'Playfair Display',
        }}>
          CONVPILOT Documentation
        </Text>
        <TouchableOpacity onPress={onClose} style={{
          padding: 8,
          borderRadius: 8,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }}>
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 16 }}>
        <View>
          <Text style={{
            color: colors.accentBlue,
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'Playfair Display',
            marginBottom: 8,
          }}>
            🎯 System Overview
          </Text>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 13,
            fontFamily: 'Playfair Display',
            lineHeight: 18,
          }}>
            CONVPILOT is a sophisticated convertible bonds analytics platform providing real-time market insights, performance tracking, and risk management tools.
          </Text>
        </View>

        <View>
          <Text style={{
            color: colors.accentGreen,
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'Playfair Display',
            marginBottom: 8,
          }}>
            📊 Key Features
          </Text>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 13,
            fontFamily: 'Playfair Display',
            lineHeight: 18,
          }}>
            • Real-time CB performance monitoring{'\n'}
            • Delta-neutral portfolio analytics{'\n'}
            • Market cap breakdown visualization{'\n'}
            • Inflow/outflow tracking{'\n'}
            • Multi-language support (EN/FR)
          </Text>
        </View>

        <View>
          <Text style={{
            color: colors.accentOrange,
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'Playfair Display',
            marginBottom: 8,
          }}>
            🔧 Navigation
          </Text>
          <Text style={{
            color: colors.textSecondary,
            fontSize: 13,
            fontFamily: 'Playfair Display',
            lineHeight: 18,
          }}>
            Use the collapsible sidebar to navigate between sections. Toggle dark/light mode and switch languages from the sidebar controls.
          </Text>
        </View>

        <View style={{
          backgroundColor: isDark ? 'rgba(0, 212, 170, 0.1)' : 'rgba(0, 212, 170, 0.1)',
          padding: 12,
          borderRadius: 8,
          borderLeftWidth: 3,
          borderLeftColor: colors.accentGreen,
        }}>
          <Text style={{
            color: colors.accentGreen,
            fontSize: 12,
            fontWeight: '600',
            fontFamily: 'Playfair Display',
          }}>
            💡 Pro Tip: Hover over charts for detailed tooltips and use the live news ticker for market updates.
          </Text>
        </View>
      </View>
    </View>
  );
};

export const NewsTickerBar = () => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDocumentation, setShowDocumentation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 6000); // Change news every 6 seconds for better readability

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ position: 'relative' as any }}>
      <View style={{
        backgroundColor: isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(248, 249, 250, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        padding: 12,
        overflow: 'hidden' as any,
        position: 'relative' as any,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
          <View style={{
            backgroundColor: colors.accentBlue,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            flexShrink: 0,
          }}>
            <Text style={{
              color: colors.background,
              fontSize: 12,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              LIVE NEWS
            </Text>
          </View>
          
          <View style={{
            flex: 1,
            overflow: 'hidden' as any,
            height: 20,
            position: 'relative' as any,
          }}>
            <View style={{
              position: 'absolute' as any,
              top: 0,
              left: 0,
              right: 0,
              animation: 'slideRightToLeft 25s linear infinite',
            }}>
              <Text style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontFamily: 'Playfair Display',
                fontWeight: '500',
                whiteSpace: 'nowrap' as any,
              }}>
                {newsItems.join(' • ')}
              </Text>
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <View style={{
              flexDirection: 'row',
              gap: 4,
            }}>
              {newsItems.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: index === currentIndex 
                      ? colors.accentBlue 
                      : colors.textMuted,
                    opacity: index === currentIndex ? 1 : 0.3,
                  }}
                />
              ))}
            </View>
            
            <TouchableOpacity
              onPress={() => setShowDocumentation(!showDocumentation)}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <HelpIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <DocumentationBubble 
        isVisible={showDocumentation} 
        onClose={() => setShowDocumentation(false)} 
      />
    </View>
  );
};
