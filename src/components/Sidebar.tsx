import { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

interface SidebarItemProps {
  icon?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: active ? colors.surfaceElev : 'transparent',
        borderColor: active ? colors.borderLight : 'transparent',
        borderWidth: 1,
      }}
    >
      {icon && (
        <View style={{
          width: 20,
          height: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ color: active ? colors.textPrimary : colors.textSecondary, fontSize: 16 }}>
            {icon}
          </Text>
        </View>
      )}
      <Text style={{
        color: active ? colors.textPrimary : colors.textSecondary,
        fontSize: 14,
        fontWeight: active ? '600' : '500'
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface SidebarProps {
  children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <View style={{
      width: 280,
      backgroundColor: colors.surface,
      borderRightColor: colors.border,
      borderRightWidth: 1,
      padding: 20,
      gap: 24,
      height: '100vh'
    }}>
      {/* Navigation Section */}
      <View style={{ gap: 4 }}>
        <Text style={{
          color: colors.textMuted,
          fontSize: 11,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 8
        }}>
          NAVIGATION
        </Text>
        <SidebarItem icon="📊" label="OVERVIEW" active />
        <SidebarItem icon="📈" label="CB report" />
        <SidebarItem icon="📊" label="Market report" />
        <SidebarItem icon="⭐" label="Favorit" />
        <SidebarItem icon="📈" label="Performance" />
        <SidebarItem icon="🎯" label="Performance simulation" />
      </View>

      {/* Account Section */}
      <View style={{ gap: 4 }}>
        <Text style={{
          color: colors.textMuted,
          fontSize: 11,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 8
        }}>
          ACCOUNT
        </Text>
        <SidebarItem icon="💬" label="Messages" />
        <SidebarItem icon="⚙️" label="Settings" />
        <SidebarItem icon="❓" label="Help" />
      </View>

      {/* Currency Selector */}
      <View style={{
        backgroundColor: colors.surfaceCard,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '500' }}>
          US Dollar
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>▼</Text>
      </View>

      {/* Dark Mode Toggle */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto'
      }}>
        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '500' }}>
          Dark Mode
        </Text>
        <View style={{
          width: 44,
          height: 24,
          backgroundColor: colors.accentGreen,
          borderRadius: 12,
          padding: 2,
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.textPrimary,
            borderRadius: 10
          }} />
        </View>
      </View>

      {children}
    </View>
  );
}