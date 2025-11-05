import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterPanelProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  title, 
  options, 
  selectedValues, 
  onChange,
  collapsible = true,
  defaultCollapsed = false,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(options.map(opt => opt.value));
  };

  return (
    <View style={{
      backgroundColor: colors.surfaceCard,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: parseInt(colors.borderRadius.medium),
      overflow: 'hidden' as any,
    }}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => collapsible && setIsCollapsed(!isCollapsed)}
        style={{
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.surface,
          cursor: collapsible ? 'pointer' : 'default',
        }}
      >
        <Text style={{
          color: colors.textPrimary,
          fontSize: parseInt(typography.fontSize.default),
          fontWeight: '600',
          fontFamily: typography.fontFamily.heading,
        }}>
          {title}
          {selectedValues.length > 0 && (
            <Text style={{ color: colors.accent }}> ({selectedValues.length})</Text>
          )}
        </Text>
        
        {collapsible && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke={colors.textSecondary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </TouchableOpacity>

      {/* Options */}
      {!isCollapsed && (
        <View style={{ padding: 16, gap: 12 }}>
          {/* Select All / Clear All */}
          {options.length > 3 && (
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
              <button
                onClick={selectAll}
                style={{
                  padding: '4px 12px',
                  backgroundColor: 'transparent',
                  color: colors.accent,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: parseInt(colors.borderRadius.small),
                  cursor: 'pointer',
                  fontSize: typography.fontSize.small,
                  fontFamily: typography.fontFamily.body,
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.accent;
                }}
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                style={{
                  padding: '4px 12px',
                  backgroundColor: 'transparent',
                  color: colors.textSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: parseInt(colors.borderRadius.small),
                  cursor: 'pointer',
                  fontSize: typography.fontSize.small,
                  fontFamily: typography.fontFamily.body,
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.textSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                Clear All
              </button>
            </View>
          )}

          {/* Filter Options */}
          <View style={{ gap: 8 }}>
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => toggleValue(option.value)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    padding: 8,
                    borderRadius: parseInt(colors.borderRadius.small),
                    backgroundColor: isSelected ? `${colors.accent}20` : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Checkbox */}
                  <View style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.accent : colors.border,
                    backgroundColor: isSelected ? colors.accent : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-6"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </View>
                  
                  {/* Label */}
                  <Text style={{
                    flex: 1,
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.default),
                    fontFamily: typography.fontFamily.body,
                  }}>
                    {option.label}
                  </Text>
                  
                  {/* Count Badge */}
                  {option.count !== undefined && (
                    <View style={{
                      backgroundColor: colors.surface,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: parseInt(colors.borderRadius.rounded),
                    }}>
                      <Text style={{
                        color: colors.textSecondary,
                        fontSize: parseInt(typography.fontSize.xsmall),
                        fontWeight: '600',
                        fontFamily: typography.fontFamily.body,
                      }}>
                        {option.count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

