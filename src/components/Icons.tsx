import { View } from 'react-native';
import { colors } from '../theme';

interface IconProps {
  size?: number;
  color?: string;
}

export const OverviewIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  </View>
);

export const ChartIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 3v18h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9l1.5-1.5L13 10l3-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const ReportIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const StarIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
               stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const PerformanceIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polyline points="22,6 12,16 2,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const TargetIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  </View>
);

export const MessageIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const SettingsIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const HelpIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="17" r="1" fill={color}/>
    </svg>
  </View>
);

export const MenuIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const CloseIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const MoonIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

export const SunIcon = ({ size = 20, color = colors.textSecondary }: IconProps) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </View>
);

