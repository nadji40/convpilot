import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme } from '../contexts/AppContext';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 4000); // Change news every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
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
        }}>
          <View style={{
            transform: [{ translateX: 0 }],
            animation: 'slideIn 0.5s ease-in-out',
          }}>
            <Text style={{
              color: colors.textPrimary,
              fontSize: 14,
              fontFamily: 'Playfair Display',
              fontWeight: '500',
              whiteSpace: 'nowrap' as any,
            }}>
              {newsItems[currentIndex]}
            </Text>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          gap: 4,
          flexShrink: 0,
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
      </View>
    </View>
  );
};
