import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ReactDOM from 'react-dom';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { CloseIcon, MoonIcon, SunIcon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dataRefresh, setDataRefresh] = useState('realtime');

  if (!isOpen) return null;

  const ToggleSwitch = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        width: 48,
        height: 26,
        backgroundColor: value ? colors.accent : colors.muted,
        borderRadius: parseInt(colors.borderRadius.rounded),
        padding: 3,
        alignItems: value ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: colors.background,
          borderRadius: parseInt(colors.borderRadius.rounded),
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </TouchableOpacity>
  );

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
          maxWidth: 600,
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
            Settings & Preferences
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

        {/* Settings Sections */}
        <View style={{ gap: 24 }}>
          {/* Appearance */}
          <View style={{ gap: 12 }}>
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
              Appearance
            </Text>
            <View
              style={{
                padding: 16,
                backgroundColor: colors.surface,
                borderRadius: parseInt(colors.borderRadius.medium),
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {isDark ? (
                  <MoonIcon size={20} color={colors.accent} />
                ) : (
                  <SunIcon size={20} color={colors.accentCyan} />
                )}
                <View>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '500',
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Dark Mode
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: parseInt(typography.fontSize.small),
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    {isDark ? 'Currently enabled' : 'Currently disabled'}
                  </Text>
                </View>
              </View>
              <ToggleSwitch value={isDark} onToggle={toggleTheme} />
            </View>
          </View>

          {/* Notifications */}
          <View style={{ gap: 12 }}>
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
              Notifications
            </Text>
            <View style={{ gap: 8 }}>
              <View
                style={{
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '500',
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Push Notifications
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: parseInt(typography.fontSize.small),
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Receive updates about market changes
                  </Text>
                </View>
                <ToggleSwitch value={notifications} onToggle={() => setNotifications(!notifications)} />
              </View>

              <View
                style={{
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '500',
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Email Alerts
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: parseInt(typography.fontSize.small),
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Get email summaries of your portfolio
                  </Text>
                </View>
                <ToggleSwitch value={emailAlerts} onToggle={() => setEmailAlerts(!emailAlerts)} />
              </View>
            </View>
          </View>

          {/* Data & Performance */}
          <View style={{ gap: 12 }}>
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
              Data & Performance
            </Text>
            <View
              style={{
                padding: 16,
                backgroundColor: colors.surface,
                borderRadius: parseInt(colors.borderRadius.medium),
                borderWidth: 1,
                borderColor: colors.border,
                gap: 12,
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
                Data Refresh Rate
              </Text>
              <View style={{ gap: 8 }}>
                {[
                  { value: 'realtime', label: 'Real-time', desc: 'Update as data changes' },
                  { value: '1min', label: '1 Minute', desc: 'Refresh every minute' },
                  { value: '5min', label: '5 Minutes', desc: 'Refresh every 5 minutes' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setDataRefresh(option.value)}
                    style={{
                      padding: 12,
                      backgroundColor: dataRefresh === option.value ? colors.surfaceElev : colors.background,
                      borderRadius: parseInt(colors.borderRadius.small),
                      borderWidth: 1,
                      borderColor: dataRefresh === option.value ? colors.accent : colors.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: dataRefresh === option.value ? colors.accent : colors.muted,
                        backgroundColor: dataRefresh === option.value ? colors.accent : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {dataRefresh === option.value && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: colors.background,
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.textPrimary,
                          fontSize: parseInt(typography.fontSize.default),
                          fontWeight: '500',
                          fontFamily: typography.fontFamily.body,
                        }}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: parseInt(typography.fontSize.small),
                          fontFamily: typography.fontFamily.body,
                        }}
                      >
                        {option.desc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
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

