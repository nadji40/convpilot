import React, { useState, useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';

interface SearchableSelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [searchTerm, isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: colors.surfaceCard,
          color: colors.textPrimary,
          border: `1px solid ${isOpen ? colors.accent : colors.border}`,
          borderRadius: parseInt(colors.borderRadius.medium),
          fontSize: parseInt(typography.fontSize.default),
          fontFamily: typography.fontFamily.body,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ color: selectedOption ? colors.textPrimary : colors.textSecondary }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke={colors.textSecondary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: colors.surfaceCard,
            border: `1px solid ${colors.border}`,
            borderRadius: parseInt(colors.borderRadius.medium),
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            maxHeight: '400px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search Input */}
          <div style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search..."
              autoFocus
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
                borderRadius: parseInt(colors.borderRadius.small),
                fontSize: parseInt(typography.fontSize.default),
                fontFamily: typography.fontFamily.body,
                outline: 'none',
              }}
            />
          </div>

          {/* Options List */}
          <div style={{ overflowY: 'auto', maxHeight: '320px' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor:
                      index === highlightedIndex
                        ? colors.surfaceElev
                        : option.value === value
                        ? colors.surface
                        : 'transparent',
                    color: option.value === value ? colors.accent : colors.textPrimary,
                    borderLeft: option.value === value ? `3px solid ${colors.accent}` : '3px solid transparent',
                    fontFamily: typography.fontFamily.body,
                    fontSize: parseInt(typography.fontSize.default),
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: colors.textSecondary,
                  fontFamily: typography.fontFamily.body,
                }}
              >
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

