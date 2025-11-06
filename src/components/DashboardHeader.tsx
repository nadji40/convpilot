import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { SettingsIcon, HelpIcon } from './Icons';
import { LanguageToggle } from './LanguageToggle';
import { UserProfileModal } from './UserProfileModal';
import { SettingsModal } from './SettingsModal';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const colors = isDark ? darkColors : lightColors;
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('') || 'MT';

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 24,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginBottom: 32,
        }}
      >
        {/* Left side - Title and Description */}
        <View style={{ gap: 6, flex: 1 }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: parseInt(typography.fontSize.h2),
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
              fontSize: parseInt(typography.fontSize.default),
              fontFamily: typography.fontFamily.body,
              animation: 'fadeInUp 0.6s ease-out 0.1s',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            {description}
          </Text>
        </View>

        {/* Right side - Language Toggle, Settings, Help, Profile */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Language Toggle */}
          <LanguageToggle />

          {/* Help Icon */}
          <TouchableOpacity
            onPress={() => window.open('/contact', '_blank')}
            style={{
              padding: 10,
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
            <HelpIcon size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Settings Icon */}
          <TouchableOpacity
            onPress={() => setShowSettingsModal(true)}
            style={{
              padding: 10,
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
            <SettingsIcon size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              width: 1,
              height: 32,
              backgroundColor: colors.border,
            }}
          />

          {/* User Profile */}
          <TouchableOpacity
            onPress={() => setShowProfileModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: '8px 16px',
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
                width: 36,
                height: 36,
                borderRadius: 18,
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
                  fontSize: 14,
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
                fontSize: parseInt(typography.fontSize.default),
                fontWeight: '500',
                fontFamily: typography.fontFamily.body,
              }}
            >
              {user?.name || 'Meriem Tarzaali'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  );
};

