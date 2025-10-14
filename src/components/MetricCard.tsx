import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, shadow } from '../theme';
import { useTheme } from '../contexts/AppContext';

export function MetricCard({
  label,
  value,
  delta,
  prefix,
  suffix,
  right,
  tone = 'neutral',
}: {
  label: string;
  value: string | number;
  delta?: string;
  prefix?: string;
  suffix?: string;
  right?: ReactNode;
  tone?: 'neutral' | 'positive' | 'negative';
}) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  
  const deltaColor = tone === 'positive' ? colors.success : tone === 'negative' ? colors.danger : colors.textSecondary;
  return (
    <View
      style={{
        backgroundColor: colors.surfaceCard,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 18,
        gap: 10,
        ...shadow.card,
      }}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '600', fontFamily: 'Playfair Display' }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          {prefix ? <Text style={{ color: colors.textSecondary, fontSize: 16, fontFamily: 'Playfair Display' }}>{prefix}</Text> : null}
          <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: '700', fontFamily: 'Playfair Display' }}>{value}</Text>
          {suffix ? <Text style={{ color: colors.textSecondary, fontSize: 16, fontFamily: 'Playfair Display' }}>{suffix}</Text> : null}
        </View>
        {right}
      </View>
      {delta ? (
        <Text style={{ color: deltaColor, fontSize: 13, fontFamily: 'Playfair Display' }}> {delta}</Text>
      ) : null}
    </View>
  );
}
