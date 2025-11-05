// Design tokens from landing page (convpilot.webflow.css)
export const darkColors = {
  // Main backgrounds
  background: '#01000a', // --_colors---bg
  surface: '#0d131a', // --_colors---dark-v2
  surfaceElev: '#1f2327', // --_colors---gradient-1
  surfaceCard: '#0f1215', // --_colors---gradient-2
  dark: '#00050a', // --_colors---dark
  
  // Borders
  border: '#1f2327',
  borderLight: '#2a2a2a',
  
  // Text colors
  textPrimary: '#ffffff', // --_colors---white
  textSecondary: '#a3a3a3', // --_colors---text-sub-600
  textMuted: '#898c9f', // --_colors---lighter-gray
  gray: '#afb0b4', // --_colors---gray
  grayLighter: '#9b9ca1', // --_colors---gray-lighter
  
  // Brand & accents
  accent: '#0a7cff', // --_colors---brand (primary brand color)
  accentBlue: '#0a7cff', // --_colors---brand
  accentCyan: '#9bc7f9', // --_colors---cyan
  accentGreen: '#00d4aa',
  accentPurple: '#8b5cf6',
  accentOrange: '#f59e0b',
  accentPink: '#ec4899',
  
  // Status colors
  danger: '#ef4444',
  warn: '#f59e0b',
  success: '#10b981',
  
  // Chart colors (matching landing)
  chartColors: {
    blue: '#0a7cff', // Primary brand blue
    cyan: '#9bc7f9', // Landing cyan
    green: '#00d4aa', 
    purple: '#8b5cf6',
    orange: '#f59e0b',
    pink: '#ec4899',
    yellow: '#eab308'
  },
  
  // Border radius from landing page
  borderRadius: {
    xsmall: '8px', // --border-radius--xsmall
    small: '8px', // --border-radius--small
    medium: '10px', // --border-radius--medium
    regular: '16px', // --border-radius--regular
    large: '24px', // --border-radius--large
    xlarge: '48px', // --border-radius--xlarge
    rounded: '1000px', // --border-radius--rounded (pills)
  }
};

export const lightColors = {
  background: '#ffffff',
  surface: '#ebebeb', // --_colors---bg-soft-200
  surfaceElev: '#e9ecef',
  surfaceCard: '#ffffff',
  dark: '#00050a',
  
  border: '#dee2e6',
  borderLight: '#ced4da',
  
  textPrimary: '#00050a', // --_colors---dark
  textSecondary: '#495057',
  textMuted: '#9b9ca1', // --_colors---gray-lighter
  gray: '#afb0b4',
  grayLighter: '#9b9ca1',
  
  accent: '#0a7cff', // --_colors---brand
  accentBlue: '#0a7cff',
  accentCyan: '#9bc7f9',
  accentGreen: '#00d4aa',
  accentPurple: '#8b5cf6',
  accentOrange: '#f59e0b',
  accentPink: '#ec4899',
  
  danger: '#ef4444',
  warn: '#f59e0b',
  success: '#10b981',
  
  chartColors: {
    blue: '#0a7cff',
    cyan: '#9bc7f9',
    green: '#00d4aa', 
    purple: '#8b5cf6',
    orange: '#f59e0b',
    pink: '#ec4899',
    yellow: '#eab308'
  },
  
  borderRadius: {
    xsmall: '8px',
    small: '8px',
    medium: '10px',
    regular: '16px',
    large: '24px',
    xlarge: '48px',
    rounded: '1000px',
  }
};

export const colors = darkColors; // Default to dark theme

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  }
};

// Typography from landing page
export const typography = {
  fontFamily: {
    body: '"Times New Roman", sans-serif', // --font-family--body-font
    heading: '"Times New Roman", Times, serif', // --font-family--heading-font
  },
  fontSize: {
    h1: '65px', // --_typography---heading--h1
    h2: '48px', // --_typography---heading--h2
    h3: '40px', // --_typography---heading--h3
    h4: '32px', // --_typography---heading--h4
    h5: '24px', // --_typography---heading--h5
    h6: '20px', // --_typography---heading--h6
    xlarge: '24px', // --_typography---paragraphs--text-x-large
    large: '20px', // --_typography---paragraphs--text-large
    medium: '18px', // --_typography---paragraphs--text-medium
    default: '16px', // --_typography---paragraphs--text-default
    small: '14px', // --_typography---paragraphs--text-small
    xsmall: '12px', // --_typography---paragraphs--text-xsmall
  }
};
