import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { colors, shadow } from '../theme';

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
  const deltaColor = tone === 'positive' ? colors.success : tone === 'negative' ? colors.danger : colors.textSecondary;
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        gap: 8,
        ...shadow.card,
      }}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 12, letterSpacing: 0.5 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          {prefix ? <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{prefix}</Text> : null}
          <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: '700' }}>{value}</Text>
          {suffix ? <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{suffix}</Text> : null}
        </View>
        {right}
      </View>
      {delta ? (
        <Text style={{ color: deltaColor, fontSize: 13 }}> {delta}</Text>
      ) : null}
    </View>
  );
}
