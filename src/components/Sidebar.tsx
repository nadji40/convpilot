import { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme, useLanguage, useSidebar } from '../contexts/AppContext';
import {
  OverviewIcon,
  ChartIcon,
  ReportIcon,
  StarIcon,
  PerformanceIcon,
  TargetIcon,
  MessageIcon,
  SettingsIcon,
  HelpIcon,
  MenuIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
} from './Icons';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

function SidebarItem({ icon, label, active = false, onClick, collapsed = false }: SidebarItemProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

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
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      {icon}
      {!collapsed && (
        <Text style={{
          color: active ? colors.textPrimary : colors.textSecondary,
          fontSize: 14,
          fontWeight: active ? '600' : '500'
        }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

interface SidebarProps {
  children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const colors = isDark ? darkColors : lightColors;

  const iconColor = colors.textSecondary;
  const activeIconColor = colors.textPrimary;

  return (
    <View style={{
      width: isCollapsed ? 80 : 280,
      backgroundColor: colors.surface,
      borderRightColor: colors.border,
      borderRightWidth: 1,
      padding: isCollapsed ? 12 : 20,
      gap: 24,
      height: '100vh',
      position: 'fixed' as any,
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: 'width 0.3s ease',
    }}>
      {/* Header with toggle */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
      }}>
        {!isCollapsed && (
          <Text style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '900',
            letterSpacing: 1,
          }}>
            CONVPILOT
          </Text>
        )}
        <TouchableOpacity onPress={toggleSidebar} style={{ padding: 4 }}>
          {isCollapsed ? (
            <MenuIcon size={20} color={colors.textSecondary} />
          ) : (
            <CloseIcon size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Navigation Section */}
      <View style={{ gap: 4 }}>
        {!isCollapsed && (
          <Text style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8
          }}>
            {t('nav.navigation') || 'NAVIGATION'}
          </Text>
        )}
        <SidebarItem 
          icon={<OverviewIcon size={20} color={activeIconColor} />} 
          label={t('nav.overview')} 
          active 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<ChartIcon size={20} color={iconColor} />} 
          label={t('nav.cb_report')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<ReportIcon size={20} color={iconColor} />} 
          label={t('nav.market_report')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<StarIcon size={20} color={iconColor} />} 
          label={t('nav.favorites')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<PerformanceIcon size={20} color={iconColor} />} 
          label={t('nav.performance')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<TargetIcon size={20} color={iconColor} />} 
          label={t('nav.performance_simulation')} 
          collapsed={isCollapsed}
        />
      </View>

      {/* Account Section */}
      <View style={{ gap: 4 }}>
        {!isCollapsed && (
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
        )}
        <SidebarItem 
          icon={<MessageIcon size={20} color={iconColor} />} 
          label={t('account.messages')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<SettingsIcon size={20} color={iconColor} />} 
          label={t('account.settings')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<HelpIcon size={20} color={iconColor} />} 
          label={t('account.help')} 
          collapsed={isCollapsed}
        />
      </View>

      {/* Language Selector */}
      {!isCollapsed && (
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
          <TouchableOpacity
            onPress={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '500' }}>
              {language === 'en' ? 'English' : 'Français'}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>▼</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Currency Selector */}
      {!isCollapsed && (
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
            {t('currency.us_dollar')}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>▼</Text>
        </View>
      )}

      {/* Dark Mode Toggle */}
      <View style={{
        flexDirection: isCollapsed ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        marginTop: 'auto',
        gap: isCollapsed ? 8 : 0,
      }}>
        {!isCollapsed && (
          <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '500' }}>
            {isDark ? t('dark_mode') : t('light_mode')}
          </Text>
        )}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            width: 44,
            height: 24,
            backgroundColor: isDark ? colors.accentGreen : colors.accentBlue,
            borderRadius: 12,
            padding: 2,
            alignItems: isDark ? 'flex-end' : 'flex-start',
            justifyContent: 'center'
          }}
        >
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.textPrimary,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {isDark ? (
              <MoonIcon size={12} color={colors.background} />
            ) : (
              <SunIcon size={12} color={colors.background} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {children}
    </View>
  );
}