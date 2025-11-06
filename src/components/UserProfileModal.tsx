import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ReactDOM from 'react-dom';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { CloseIcon, UserIcon } from './Icons';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const colors = isDark ? darkColors : lightColors;

  if (!isOpen) return null;

  const modalContent = (
    <View
      style={{
        position: 'fixed' as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose as any}
    >
      <View
        style={{
          backgroundColor: colors.surfaceCard,
          borderRadius: parseInt(colors.borderRadius.large),
          padding: 32,
          maxWidth: 500,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto' as any,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          borderWidth: 1,
          borderColor: colors.border,
        }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: parseInt(typography.fontSize.h3),
              fontWeight: '700',
              fontFamily: typography.fontFamily.heading,
            }}
          >
            Profile
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 8,
              borderRadius: parseInt(colors.borderRadius.small),
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <CloseIcon size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View style={{ gap: 24 }}>
          {/* Profile Picture */}
          <View style={{ alignItems: 'center', gap: 16 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 36,
                  fontWeight: '700',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                {user?.name?.split(' ').map(n => n[0]).join('') || 'MT'}
              </Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.h4),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                {user?.name || 'Meriem Tarzaali'}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.default),
                  fontFamily: typography.fontFamily.body,
                }}
              >
                {user?.email || 'meriem@convpilot.net'}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.border }} />

          {/* Details Section */}
          <View style={{ gap: 20 }}>
            {/* Team */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: parseInt(typography.fontSize.small),
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  fontFamily: typography.fontFamily.body,
                }}
              >
                Team
              </Text>
              <View
                style={{
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.default),
                    fontWeight: '500',
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  ConvPilot Analytics Team
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: parseInt(typography.fontSize.small),
                    fontFamily: typography.fontFamily.body,
                    marginTop: 4,
                  }}
                >
                  5 members
                </Text>
              </View>
            </View>

            {/* Plan */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: parseInt(typography.fontSize.small),
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  fontFamily: typography.fontFamily.body,
                }}
              >
                Plan
              </Text>
              <View
                style={{
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  borderWidth: 1,
                  borderColor: colors.accent,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontSize: parseInt(typography.fontSize.default),
                        fontWeight: '600',
                        fontFamily: typography.fontFamily.body,
                      }}
                    >
                      Professional Plan
                    </Text>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: parseInt(typography.fontSize.small),
                        fontFamily: typography.fontFamily.body,
                        marginTop: 4,
                      }}
                    >
                      Full access to all features
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: '6px 12px',
                      backgroundColor: colors.accent,
                      borderRadius: parseInt(colors.borderRadius.small),
                    }}
                  >
                    <Text
                      style={{
                        color: '#ffffff',
                        fontSize: parseInt(typography.fontSize.xsmall),
                        fontWeight: '600',
                        fontFamily: typography.fontFamily.body,
                      }}
                    >
                      PRO
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Account Status */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: parseInt(typography.fontSize.small),
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  fontFamily: typography.fontFamily.body,
                }}
              >
                Status
              </Text>
              <View
                style={{
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#10b981',
                  }}
                />
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.default),
                    fontWeight: '500',
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (typeof document === 'undefined') return null;
  
  return ReactDOM.createPortal(modalContent, document.body);
};

