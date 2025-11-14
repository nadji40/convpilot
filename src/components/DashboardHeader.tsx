import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme, useSidebar } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { SettingsIcon, HelpIcon, BellIcon, AnalystIcon } from './Icons';
import { LanguageToggle } from './LanguageToggle';
import { UserProfileModal } from './UserProfileModal';
import { SettingsModal } from './SettingsModal';
import { NotificationDropdown } from './NotificationDropdown';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { user } = useAuth();
  const colors = isDark ? darkColors : lightColors;
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('') || 'MT';
  const unreadCount = 2; // Mock unread count - would come from API

  // Handle scroll detection - now looking at the main scrollable container
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollY = target.scrollTop || 0;
      setIsScrolled(scrollY > 50);
    };

    // Find the scrollable container - it's the parent View with overflow: auto
    const findScrollContainer = () => {
      let element = headerRef.current?.parentElement;
      while (element) {
        const style = window.getComputedStyle(element);
        if (style.overflow === 'auto' || style.overflowY === 'auto') {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    };

    const scrollContainer = findScrollContainer();
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <>
      <View
        ref={headerRef as any}
        className={`dashboard-header ${isScrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed' as any,
          top: 0,
          left: isCollapsed ? 80 : 280,
          right: 0,
          zIndex: 1000,
          transition: 'left 0.4s ease',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          {/* Left side - Title and Description */}
          <View style={{ gap: 2, flex: 1 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: Math.round(parseInt(typography.fontSize.h2) * 0.65),
                fontWeight: '700',
                fontFamily: typography.fontFamily.heading,
                animation: 'fadeInUp 0.6s ease-out',
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: Math.round(parseInt(typography.fontSize.default) * 0.85),
                fontFamily: typography.fontFamily.body,
                animation: 'fadeInUp 0.6s ease-out 0.1s',
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              {description}
            </Text>
          </View>

          {/* Right side - Actions */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Request Analyst Review */}
            <TouchableOpacity
              onPress={() => alert('Analyst review request sent!')}
              style={{
                padding: 8,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onHoverIn={(e: any) => {
                e.currentTarget.style.backgroundColor = `${colors.accent}15`;
                e.currentTarget.style.borderColor = colors.accent;
              }}
              onHoverOut={(e: any) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <AnalystIcon size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Notifications */}
            <View style={{ position: 'relative' as any }} ref={notificationRef as any}>
              <TouchableOpacity
                onPress={() => setShowNotifications(!showNotifications)}
                style={{
                  padding: 8,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  backgroundColor: showNotifications ? `${colors.accent}15` : colors.surface,
                  borderWidth: 1,
                  borderColor: showNotifications ? colors.accent : colors.border,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative' as any,
                }}
                onHoverIn={(e: any) => {
                  if (!showNotifications) {
                    e.currentTarget.style.backgroundColor = `${colors.accent}10`;
                    e.currentTarget.style.borderColor = colors.accent;
                  }
                }}
                onHoverOut={(e: any) => {
                  if (!showNotifications) {
                    e.currentTarget.style.backgroundColor = colors.surface;
                    e.currentTarget.style.borderColor = colors.border;
                  }
                }}
              >
                <BellIcon size={18} color={colors.textSecondary} />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: 'absolute' as any,
                      top: -4,
                      right: -4,
                      backgroundColor: colors.accent,
                      borderRadius: 8,
                      minWidth: 16,
                      height: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 4,
                      borderWidth: 2,
                      borderColor: colors.background,
                    }}
                  >
                    <Text
                      style={{
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: '700',
                        fontFamily: typography.fontFamily.body,
                      }}
                    >
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <NotificationDropdown 
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                anchorRef={notificationRef}
              />
            </View>

            {/* Help Icon */}
            <TouchableOpacity
              onPress={() => window.open('/contact', '_blank')}
              style={{
                padding: 8,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onHoverIn={(e: any) => {
                e.currentTarget.style.backgroundColor = colors.surfaceElev;
                e.currentTarget.style.borderColor = colors.accent;
              }}
              onHoverOut={(e: any) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <HelpIcon size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Settings Icon */}
            <TouchableOpacity
              onPress={() => setShowSettingsModal(true)}
              style={{
                padding: 8,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onHoverIn={(e: any) => {
                e.currentTarget.style.backgroundColor = colors.surfaceElev;
                e.currentTarget.style.borderColor = colors.accent;
              }}
              onHoverOut={(e: any) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <SettingsIcon size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={{
                width: 1,
                height: 24,
                backgroundColor: colors.border,
              }}
            />

            {/* User Profile */}
            <TouchableOpacity
              onPress={() => setShowProfileModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onHoverIn={(e: any) => {
                e.currentTarget.style.backgroundColor = colors.surfaceElev;
                e.currentTarget.style.borderColor = colors.accent;
              }}
              onHoverOut={(e: any) => {
                e.currentTarget.style.backgroundColor = colors.surface;
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              {/* Profile Picture */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: '700',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  {userInitials}
                </Text>
              </View>

              {/* User Name */}
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: Math.round(parseInt(typography.fontSize.default) * 0.9),
                  fontWeight: '500',
                  fontFamily: typography.fontFamily.body,
                }}
              >
                {user?.name || 'Meriem Tarzaali'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modals */}
      <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
};

