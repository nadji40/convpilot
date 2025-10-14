import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, shadow } from '../theme';
import { useTheme } from '../contexts/AppContext';

export function ChartCard({ title, children, legend }: { title?: string; children: ReactNode; legend?: ReactNode }) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View
      style={{
        backgroundColor: colors.surfaceCard,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        ...shadow.card,
        minHeight: 300,
        flex: 1,
      }}
    >
      {title ? (
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 12, letterSpacing: 0.3, fontFamily: 'Playfair Display' }}>{title}</Text>
      ) : null}
      <View style={{ 
        height: title ? 260 : 280, 
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative' as any
      }}>
        {children}
      </View>
      {legend ? <View style={{ marginTop: 8 }}>{legend}</View> : null}
    </View>
  );
}
