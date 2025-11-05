import { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
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
        padding: collapsed ? 12 : 14,
        borderRadius: parseInt(colors.borderRadius.regular),
        backgroundColor: active 
          ? colors.surfaceElev
          : 'transparent',
        borderColor: active ? colors.border : 'transparent',
        borderWidth: 1,
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onHoverIn={(e: any) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = isDark ? 'rgba(31, 35, 39, 0.5)' : 'rgba(0, 0, 0, 0.03)';
        }
      }}
      onHoverOut={(e: any) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <View style={{ opacity: active ? 1 : 0.7 }}>
        {icon}
      </View>
      {!collapsed && (
        <Text style={{
          color: active ? colors.textPrimary : colors.textSecondary,
          fontSize: parseInt(typography.fontSize.default),
          fontWeight: active ? '600' : '400',
          fontFamily: typography.fontFamily.body,
          letterSpacing: -0.011,
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
  const activeIconColor = colors.accent;

  return (
    <View style={{
      width: isCollapsed ? 80 : 280,
      backgroundColor: colors.surface,
      borderRightColor: colors.border,
      borderRightWidth: 1,
      padding: isCollapsed ? 16 : 24,
      gap: 28,
      height: '100vh',
      position: 'fixed' as any,
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: 'all 0.4s ease',
      overflowY: 'auto' as any,
      overflowX: 'hidden' as any,
    }}>
      {/* Header with Logo and Toggle */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        paddingTop: 4,
        marginBottom: 12,
      }}>
        {!isCollapsed && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <img 
              src="/images/Logo.png" 
              alt="CONVPILOT" 
              style={{ height: 32, width: 'auto' }}
            />
          </View>
        )}
        {isCollapsed && (
          <img 
            src="/images/Logo.png" 
            alt="CONVPILOT" 
            style={{ height: 28, width: 'auto' }}
          />
        )}
        <TouchableOpacity 
          onPress={toggleSidebar} 
          style={{ 
            padding: 8,
            borderRadius: parseInt(colors.borderRadius.small),
            backgroundColor: colors.surfaceCard,
            borderWidth: 1,
            borderColor: colors.border,
            transition: 'all 0.3s ease',
          }}
        >
          {isCollapsed ? (
            <MenuIcon size={18} color={colors.textSecondary} />
          ) : (
            <CloseIcon size={18} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Navigation Section */}
      <View style={{ gap: 6 }}>
        {!isCollapsed && (
          <Text style={{
            color: colors.textMuted,
            fontSize: parseInt(typography.fontSize.xsmall),
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 8,
            fontFamily: typography.fontFamily.body,
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
      <View style={{ gap: 6 }}>
        {!isCollapsed && (
          <Text style={{
            color: colors.textMuted,
            fontSize: parseInt(typography.fontSize.xsmall),
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 8,
            fontFamily: typography.fontFamily.body,
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

      {/* Language & Currency Selectors */}
      {!isCollapsed && (
        <View style={{ gap: 12 }}>
          {/* Language Selector */}
          <TouchableOpacity
            onPress={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            style={{
              backgroundColor: colors.surfaceCard,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: parseInt(colors.borderRadius.medium),
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
          >
            <Text style={{ 
              color: colors.textPrimary, 
              fontSize: parseInt(typography.fontSize.default), 
              fontWeight: '500', 
              fontFamily: typography.fontFamily.body 
            }}>
              {language === 'en' ? 'EN' : 'FR'}
            </Text>
            <Text style={{ 
              color: colors.textMuted, 
              fontSize: parseInt(typography.fontSize.small),
              fontFamily: typography.fontFamily.body 
            }}>
              {language === 'en' ? 'English' : 'Français'}
            </Text>
          </TouchableOpacity>

          {/* Currency Selector */}
          <View style={{
            backgroundColor: colors.surfaceCard,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: parseInt(colors.borderRadius.medium),
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Text style={{ 
              color: colors.textPrimary, 
              fontSize: parseInt(typography.fontSize.default), 
              fontWeight: '500', 
              fontFamily: typography.fontFamily.body 
            }}>
              USD
            </Text>
            <Text style={{ 
              color: colors.textMuted, 
              fontSize: parseInt(typography.fontSize.small),
              fontFamily: typography.fontFamily.body 
            }}>
              {t('currency.us_dollar')}
            </Text>
          </View>
        </View>
      )}

      {/* Dark Mode Toggle */}
      <View style={{
        flexDirection: isCollapsed ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        marginTop: 'auto',
        padding: isCollapsed ? 8 : 14,
        backgroundColor: colors.surfaceCard,
        borderRadius: parseInt(colors.borderRadius.medium),
        borderWidth: 1,
        borderColor: colors.border,
        gap: isCollapsed ? 8 : 0,
      }}>
        {!isCollapsed && (
          <Text style={{ 
            color: colors.textPrimary, 
            fontSize: parseInt(typography.fontSize.default), 
            fontWeight: '500', 
            fontFamily: typography.fontFamily.body 
          }}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
        )}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            width: 48,
            height: 26,
            backgroundColor: isDark ? colors.accent : colors.accentCyan,
            borderRadius: parseInt(colors.borderRadius.rounded),
            padding: 3,
            alignItems: isDark ? 'flex-end' : 'flex-start',
            justifyContent: 'center',
            transition: 'all 0.4s ease',
          }}
        >
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.background,
            borderRadius: parseInt(colors.borderRadius.rounded),
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}>
            {isDark ? (
              <MoonIcon size={12} color={colors.accent} />
            ) : (
              <SunIcon size={12} color={colors.accentCyan} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {children}
    </View>
  );
}