import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search...', 
  value, 
  onChange,
  suggestions = [],
  onSuggestionClick
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions
    .filter(s => s.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 5);

  return (
    <View style={{ position: 'relative' as any, width: '100%' }}>
      <View style={{
        backgroundColor: colors.surfaceCard,
        borderColor: isFocused ? colors.accent : colors.border,
        borderWidth: 1,
        borderRadius: parseInt(colors.borderRadius.medium),
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        transition: 'all 0.3s ease',
      }}>
        {/* Search Icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke={colors.textSecondary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        <TextInput
          style={{
            flex: 1,
            color: colors.textPrimary,
            fontSize: parseInt(typography.fontSize.default),
            fontFamily: typography.fontFamily.body,
            outline: 'none' as any,
            border: 'none',
            backgroundColor: 'transparent',
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        
        {value && (
          <button
            onClick={() => onChange('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke={colors.textSecondary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </View>

      {/* Autocomplete Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && value && (
        <View style={{
          position: 'absolute' as any,
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 8,
          backgroundColor: colors.surfaceCard,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: parseInt(colors.borderRadius.medium),
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          overflow: 'hidden' as any,
        }}>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onChange(suggestion);
                if (onSuggestionClick) onSuggestionClick(suggestion);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.textPrimary,
                fontSize: typography.fontSize.default,
                fontFamily: typography.fontFamily.body,
                borderBottom: index < filteredSuggestions.length - 1 ? `1px solid ${colors.border}` : 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.surfaceElev;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {suggestion}
            </button>
          ))}
        </View>
      )}
    </View>
  );
};

