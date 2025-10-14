import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { HelpIcon } from './Icons';
import { TechnicalDocumentationModal } from './TechnicalDocumentationModal';

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

      <TechnicalDocumentationModal 
        isVisible={showDocumentation} 
        onClose={() => setShowDocumentation(false)} 
      />
    </View>
  );
};
