import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme } from '../contexts/AppContext';

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: 0.5, fontFamily: 'Playfair Display' }}>{title}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}
