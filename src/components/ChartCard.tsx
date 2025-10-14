import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { colors, shadow } from '../theme';

export function ChartCard({ title, children, legend }: { title?: string; children: ReactNode; legend?: ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        ...shadow.card,
      }}
    >
      {title ? (
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>{title}</Text>
      ) : null}
      <View style={{ height: 260, justifyContent: 'center' }}>{children}</View>
      {legend ? <View style={{ marginTop: 8 }}>{legend}</View> : null}
    </View>
  );
}
