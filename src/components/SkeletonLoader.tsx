import { View } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme } from '../contexts/AppContext';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  
  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: colors.surfaceElev,
          borderRadius,
          opacity: 0.7,
        },
        style,
      ]}
    />
  );
};

export const SkeletonCard = ({ children }: { children?: React.ReactNode }) => {
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
        gap: 12,
      }}
    >
      {children || (
        <>
          <Skeleton height={16} width="60%" />
          <Skeleton height={24} width="40%" />
          <Skeleton height={12} width="80%" />
        </>
      )}
    </View>
  );
};

export const SkeletonChart = () => {
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
        gap: 12,
        minHeight: 300,
        flex: 1,
      }}
    >
      <Skeleton height={16} width="40%" />
      <Skeleton height={260} width="100%" borderRadius={8} />
    </View>
  );
};

export const SkeletonMetric = () => (
  <SkeletonCard>
    <Skeleton height={12} width="60%" />
    <Skeleton height={28} width="30%" />
  </SkeletonCard>
);

export const SkeletonList = ({ items = 3 }: { items?: number }) => (
  <View style={{ gap: 12 }}>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonCard key={index}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton height={16} width="70%" />
          <Skeleton height={16} width="20%" />
        </View>
      </SkeletonCard>
    ))}
  </View>
);
