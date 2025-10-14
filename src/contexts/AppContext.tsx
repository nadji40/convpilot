import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme types
export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Language types
export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Sidebar types
interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

// Loading types
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Language Context
const translations = {
  en: {
    // Navigation
    'nav.overview': 'OVERVIEW',
    'nav.cb_report': 'CB Report',
    'nav.market_report': 'Market Report',
    'nav.favorites': 'Favorites',
    'nav.performance': 'Performance',
    'nav.performance_simulation': 'Performance Simulation',
    
    // Account
    'account.messages': 'Messages',
    'account.settings': 'Settings',
    'account.help': 'Help',
    
    // Dashboard
    'dashboard.market_cap': 'Market Cap: 43 Mds EUR',
    'dashboard.1d_changes': '1D CHANGES +72,852,654.23 EUR',
    'dashboard.one_day_changes': 'One day changes',
    'dashboard.top_worst_performance': 'Top and Worst Performance of the Month',
    'dashboard.inflows_outflows': 'Inflows/ outflows',
    'dashboard.scatter_cb_universe': 'Scatter: CB universe',
    'dashboard.profiles': 'Profiles',
    'dashboard.market_cap_breakdown': 'Market Cap breakdown',
    
    // Metrics
    'metrics.cb_performance': 'CB Performance',
    'metrics.equity_performance': 'Equity performance',
    'metrics.delta_adjusted_performance': 'Delta adjusted performance',
    'metrics.delta': 'Delta',
    'metrics.vega': 'VEGA',
    'metrics.ytm': 'YTM',
    'metrics.prime': 'Prime',
    'metrics.duration': 'Duration',
    
    // Other
    'currency.us_dollar': 'EUR',
    'dark_mode': 'Dark Mode',
    'light_mode': 'Light Mode',
  },
  fr: {
    // Navigation
    'nav.overview': 'VUE D\'ENSEMBLE',
    'nav.cb_report': 'Rapport CB',
    'nav.market_report': 'Rapport de marché',
    'nav.favorites': 'Favoris',
    'nav.performance': 'Performance',
    'nav.performance_simulation': 'Simulation de performance',
    
    // Account
    'account.messages': 'Messages',
    'account.settings': 'Paramètres',
    'account.help': 'Aide',
    
    // Dashboard
    'dashboard.market_cap': 'Capitalisation: 43 Mds EUR',
    'dashboard.1d_changes': 'CHANGEMENTS 1J +72,852,654.23 EUR',
    'dashboard.one_day_changes': 'Changements d\'un jour',
    'dashboard.top_worst_performance': 'Meilleures et pires performances du mois',
    'dashboard.inflows_outflows': 'Entrées/sorties de fonds',
    'dashboard.scatter_cb_universe': 'Nuage: univers CB',
    'dashboard.profiles': 'Profils',
    'dashboard.market_cap_breakdown': 'Répartition de la capitalisation',
    
    // Metrics
    'metrics.cb_performance': 'Performance CB',
    'metrics.equity_performance': 'Performance actions',
    'metrics.delta_adjusted_performance': 'Performance ajustée delta',
    'metrics.delta': 'Delta',
    'metrics.vega': 'VEGA',
    'metrics.ytm': 'TRM',
    'metrics.prime': 'Prime',
    'metrics.duration': 'Durée',
    
    // Other
    'currency.us_dollar': 'Dollar US',
    'dark_mode': 'Mode sombre',
    'light_mode': 'Mode clair',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Sidebar Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Loading Context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Combined Context Provider
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
