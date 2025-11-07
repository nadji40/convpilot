import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement>;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  isOpen, 
  onClose,
  anchorRef 
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock notifications - in real app, this would come from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Market Update',
      message: 'Convertible bond market shows 2.5% increase',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Portfolio Alert',
      message: 'Your portfolio performance exceeded benchmark by 1.2%',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'Analysis Complete',
      message: 'Weekly performance attribution analysis is ready',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      type: 'info',
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      default: return colors.accent;
    }
  };

  if (!isOpen) return null;

  return (
    <View
      ref={dropdownRef as any}
      style={{
        position: 'absolute' as any,
        top: '100%',
        right: 0,
        marginTop: 8,
        width: 380,
        maxHeight: 500,
        backgroundColor: colors.surface,
        borderRadius: parseInt(colors.borderRadius.large),
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: `${colors.accent}08`,
        }}
      >
        <Text
          style={{
            fontSize: parseInt(typography.fontSize.large),
            fontWeight: '700',
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.heading,
          }}
        >
          Notifications
        </Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.small),
              color: colors.accent,
              fontWeight: '600',
              fontFamily: typography.fontFamily.body,
            }}
          >
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={{
          maxHeight: 400,
        }}
      >
        {notifications.length === 0 ? (
          <View
            style={{
              padding: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: colors.textMuted,
                fontSize: parseInt(typography.fontSize.default),
                fontFamily: typography.fontFamily.body,
              }}
            >
              No notifications
            </Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => markAsRead(notification.id)}
              style={{
                padding: 16,
                borderBottomWidth: index < notifications.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                backgroundColor: notification.read 
                  ? 'transparent' 
                  : `${colors.accent}06`,
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
              }}
              onHoverIn={(e: any) => {
                e.currentTarget.style.backgroundColor = `${colors.accent}10`;
              }}
              onHoverOut={(e: any) => {
                e.currentTarget.style.backgroundColor = notification.read 
                  ? 'transparent' 
                  : `${colors.accent}06`;
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                {/* Type Indicator */}
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: getTypeColor(notification.type),
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <View style={{ flex: 1, gap: 4 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: parseInt(typography.fontSize.default),
                        fontWeight: notification.read ? '500' : '700',
                        color: colors.textPrimary,
                        fontFamily: typography.fontFamily.body,
                        flex: 1,
                      }}
                    >
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: colors.accent,
                          marginTop: 4,
                        }}
                      />
                    )}
                  </View>

                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.small),
                      color: colors.textSecondary,
                      fontFamily: typography.fontFamily.body,
                      lineHeight: parseInt(typography.fontSize.small) * 1.4,
                    }}
                  >
                    {notification.message}
                  </Text>

                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.xsmall),
                      color: colors.textMuted,
                      fontFamily: typography.fontFamily.body,
                      marginTop: 4,
                    }}
                  >
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          alignItems: 'center',
          backgroundColor: colors.surfaceCard,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.small),
              color: colors.accent,
              fontWeight: '600',
              fontFamily: typography.fontFamily.body,
            }}
          >
            View all notifications
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
