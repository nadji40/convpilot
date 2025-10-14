import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { colors, shadow } from '../theme';

export function ChartCard({ title, children, legend }: { title?: string; children: ReactNode; legend?: ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.surfaceCard,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        ...shadow.card,
      }}
    >
      {title ? (
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 12, letterSpacing: 0.3 }}>{title}</Text>
      ) : null}
      <View style={{ height: 260, justifyContent: 'center' }}>{children}</View>
      {legend ? <View style={{ marginTop: 8 }}>{legend}</View> : null}
    </View>
  );
}
