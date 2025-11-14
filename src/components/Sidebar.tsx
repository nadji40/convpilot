import { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme, useSidebar, useLanguage } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  OverviewIcon,
  ChartIcon,
  ReportIcon,
  StarIcon,
  PerformanceIcon,
  TargetIcon,
  MenuIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  TrendingUpIcon,
  LogoutIcon,
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
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const colors = isDark ? darkColors : lightColors;
  const location = useLocation();
  const navigate = useNavigate();

  const iconColor = colors.textSecondary;
  const activeIconColor = colors.accent;

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      // Rounded right corners
      borderTopRightRadius: parseInt(colors.borderRadius.large),
      borderBottomRightRadius: parseInt(colors.borderRadius.large),
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
            src="/images/favicon.png" 
            alt="CONVPILOT" 
            style={{ height: 28, width: 28, objectFit: 'contain' }}
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
            {t('nav.navigation')}
          </Text>
        )}
        <SidebarItem 
          icon={<OverviewIcon size={20} color={isActive('/dashboard') ? activeIconColor : iconColor} />} 
          label={t('nav.overview')}
          active={isActive('/dashboard')}
          collapsed={isCollapsed}
          onClick={() => navigate('/dashboard')}
        />
        <SidebarItem 
          icon={<ChartIcon size={20} color={isActive('/dashboard/universe') ? activeIconColor : iconColor} />} 
          label={t('nav.cb_universe')}
          active={isActive('/dashboard/universe')}
          collapsed={isCollapsed}
          onClick={() => navigate('/dashboard/universe')}
        />
        <SidebarItem 
          icon={<ReportIcon size={20} color={isActive('/dashboard/aggregations') ? activeIconColor : iconColor} />} 
          label={t('nav.aggregations')}
          active={isActive('/dashboard/aggregations')}
          collapsed={isCollapsed}
          onClick={() => navigate('/dashboard/aggregations')}
        />
        <SidebarItem 
          icon={<PerformanceIcon size={20} color={isActive('/dashboard/portfolio') ? activeIconColor : iconColor} />} 
          label={t('nav.portfolio')}
          active={isActive('/dashboard/portfolio')}
          collapsed={isCollapsed}
          onClick={() => navigate('/dashboard/portfolio')}
        />
        <SidebarItem 
          icon={<TrendingUpIcon size={20} color={isActive('/dashboard/performance') ? activeIconColor : iconColor} />} 
          label={t('nav.performance')}
          active={isActive('/dashboard/performance')}
          collapsed={isCollapsed}
          onClick={() => navigate('/dashboard/performance')}
        />
 
      </View>


      {/* Logout Button */}
      <View style={{ marginTop: 'auto', gap: 12 }}>
        {/* Version Number */}
        <View style={{
          alignItems: isCollapsed ? 'center' : 'flex-start',
          paddingHorizontal: isCollapsed ? 0 : 4,
        }}>
          <Text style={{
            color: colors.textMuted,
            fontSize: parseInt(typography.fontSize.xsmall),
            fontWeight: '600',
            fontFamily: typography.fontFamily.body,
            letterSpacing: 0.5,
            opacity: 0.7,
          }}>
            v0.9
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: isCollapsed ? 12 : 14,
            borderRadius: parseInt(colors.borderRadius.regular),
            backgroundColor: colors.surfaceCard,
            borderColor: colors.border,
            borderWidth: 1,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onHoverIn={(e: any) => {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
            e.currentTarget.style.borderColor = colors.danger;
          }}
          onHoverOut={(e: any) => {
            e.currentTarget.style.backgroundColor = colors.surfaceCard;
            e.currentTarget.style.borderColor = colors.border;
          }}
        >
          <LogoutIcon size={20} color={colors.danger} />
          {!isCollapsed && (
            <Text style={{
              color: colors.danger,
              fontSize: parseInt(typography.fontSize.default),
              fontWeight: '500',
              fontFamily: typography.fontFamily.body,
              letterSpacing: -0.011,
            }}>
              {t('nav.logout') || 'Logout'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Dark Mode Toggle */}
        <View style={{
          flexDirection: isCollapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
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
      </View>

      {children}
    </View>
  );
}