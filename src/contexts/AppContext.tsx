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
    'nav.overview': 'Overview',
    'nav.navigation': 'NAVIGATION',
    'nav.cb_universe': 'CB Universe',
    'nav.aggregations': 'Aggregations',
    'nav.portfolio': 'Portfolio',
    'nav.favorites': 'Favorites',
    'nav.simulations': 'Simulations',
    'nav.cb_report': 'CB Report',
    'nav.market_report': 'Market Report',
    'nav.performance': 'Performance',
    'nav.performance_simulation': 'Performance Simulation',
    'nav.logout': 'Logout',
    
    // Account
    'account.messages': 'Messages',
    'account.settings': 'Settings',
    'account.help': 'Help',
    
    // Dashboard Pages
    'dashboard.overview': 'Dashboard Overview',
    'dashboard.overview_desc': 'Real-time insights into the convertible bonds market',
    'dashboard.universe': 'Convertible Bonds Universe',
    'dashboard.universe_desc': 'bonds',
    'dashboard.aggregations': 'Cross-Filter Aggregations',
    'dashboard.aggregations_desc': 'Analyze market breakdown across multiple dimensions',
    'dashboard.portfolio': 'Portfolio Analysis',
    'dashboard.portfolio_desc': 'bonds selected • Total market cap:',
    'dashboard.instrument_desc': 'ISIN:',
    
    // KPIs
    'kpi.total_convertible_bonds': 'Total Convertible Bonds',
    'kpi.total_market_cap': 'Total Market Cap',
    'kpi.average_yield': 'Average Yield',
    'kpi.average_1d_change': 'Average 1D Change',
    'kpi.ytm': 'YTM',
    'kpi.vs_yesterday': 'vs yesterday',
    'kpi.price': 'Price',
    'kpi.fair_value': 'Fair Value',
    'kpi.ytm_yield': 'YTM (Yield)',
    'kpi.coupon': 'Coupon',
    'kpi.conversion_price': 'Conversion Price',
    'kpi.parity': 'Parity',
    'kpi.delta': 'Delta',
    'kpi.theta': 'Theta',
    'kpi.total_bonds': 'Total Bonds',
    'kpi.weighted_delta': 'Weighted Delta',
    'kpi.weighted_ytm': 'Weighted YTM',
    'kpi.1m_performance': '1M Performance',
    'kpi.avg_performance_1m': 'Avg Performance 1M',
    'kpi.performance_1m': 'Performance 1M',
    
    // Charts & Widgets
    'widget.market_index_performance': 'Market Index Performance',
    'widget.sector_breakdown': 'Sector Breakdown',
    'widget.credit_rating_breakdown': 'Credit Rating Breakdown',
    'widget.maturity_breakdown': 'Maturity Breakdown',
    'widget.profile_breakdown': 'Profile Breakdown',
    'widget.performance_history': 'Performance History (30 Days)',
    'widget.sector_allocation': 'Sector Allocation',
    'widget.rating_distribution': 'Rating Distribution',
    'widget.historical_prices': 'Historical Prices & Greeks',
    'widget.bond_characteristics': 'Bond Characteristics',
    'widget.last_30_days': 'Last 30 days performance trend',
    
    // Legend items
    'legend.cb_index': 'CB Index',
    'legend.equity_index': 'Equity Index',
    'legend.delta_neutral': 'Delta Neutral',
    
    // Table Headers
    'table.isin': 'ISIN',
    'table.issuer': 'Issuer',
    'table.sector': 'Sector',
    'table.currency': 'Currency',
    'table.coupon': 'Coupon',
    'table.price': 'Price',
    'table.delta': 'Delta',
    'table.rating': 'Rating',
    'table.maturity': 'Maturity',
    'table.perf_1m': 'Perf 1M',
    
    // Buttons
    'button.export_csv': 'Export to CSV',
    'button.back_to_universe': 'Back to Universe',
    'button.save_inputs': 'Save Custom Inputs',
    
    // Filter Labels
    'filter.search': 'Search by ISIN, issuer, or country...',
    'filter.sector': 'Sector',
    'filter.country': 'Country',
    'filter.rating': 'Credit Rating',
    'filter.currency': 'Currency',
    
    // Dimension Labels
    'dimension.primary': 'Primary Dimension',
    'dimension.secondary': 'Secondary Dimension',
    'dimension.secondary_cross_filter': 'Secondary Dimension (Cross-Filter)',
    'dimension.sector': 'Sector',
    'dimension.rating': 'Credit Rating',
    'dimension.size': 'Market Cap Size',
    'dimension.profile': 'Bond Profile',
    'dimension.maturity': 'Maturity Bucket',
    
    // Other
    'currency.us_dollar': 'EUR',
    'search.placeholder': 'Search by ISIN, issuer, or country...',
    'portfolio.select_bonds': 'Select bonds to include in your portfolio analysis',
    'chart.primary_dimension': 'Primary Dimension Chart',
    'chart.secondary_dimension': 'Secondary Dimension Chart',
    'dark_mode': 'Dark Mode',
    'light_mode': 'Light Mode',
    'of': 'of',
    'tracking': 'Tracking',
  },
  fr: {
    // Navigation
    'nav.overview': 'Vue d\'ensemble',
    'nav.navigation': 'NAVIGATION',
    'nav.cb_universe': 'Univers CB',
    'nav.aggregations': 'Agrégations',
    'nav.portfolio': 'Portefeuille',
    'nav.favorites': 'Favoris',
    'nav.simulations': 'Simulations',
    'nav.cb_report': 'Rapport CB',
    'nav.market_report': 'Rapport de marché',
    'nav.performance': 'Performance',
    'nav.performance_simulation': 'Simulation de performance',
    'nav.logout': 'Déconnexion',
    
    // Account
    'account.messages': 'Messages',
    'account.settings': 'Paramètres',
    'account.help': 'Aide',
    
    // Dashboard Pages
    'dashboard.overview': 'Aperçu du tableau de bord',
    'dashboard.overview_desc': 'Informations en temps réel sur le marché des obligations convertibles',
    'dashboard.universe': 'Univers des obligations convertibles',
    'dashboard.universe_desc': 'obligations',
    'dashboard.aggregations': 'Agrégations à filtres croisés',
    'dashboard.aggregations_desc': 'Analyser la répartition du marché à travers plusieurs dimensions',
    'dashboard.portfolio': 'Analyse de portefeuille',
    'dashboard.portfolio_desc': 'obligations sélectionnées • Capitalisation totale:',
    'dashboard.instrument_desc': 'ISIN:',
    
    // KPIs
    'kpi.total_convertible_bonds': 'Total obligations convertibles',
    'kpi.total_market_cap': 'Capitalisation totale',
    'kpi.average_yield': 'Rendement moyen',
    'kpi.average_1d_change': 'Variation moyenne 1J',
    'kpi.ytm': 'TRM',
    'kpi.vs_yesterday': 'vs hier',
    'kpi.price': 'Prix',
    'kpi.fair_value': 'Valeur équitable',
    'kpi.ytm_yield': 'TRM (Rendement)',
    'kpi.coupon': 'Coupon',
    'kpi.conversion_price': 'Prix de conversion',
    'kpi.parity': 'Parité',
    'kpi.delta': 'Delta',
    'kpi.theta': 'Thêta',
    'kpi.total_bonds': 'Total obligations',
    'kpi.weighted_delta': 'Delta pondéré',
    'kpi.weighted_ytm': 'TRM pondéré',
    'kpi.1m_performance': 'Performance 1M',
    
    // Charts & Widgets
    'widget.market_index_performance': 'Performance des indices de marché',
    'widget.sector_breakdown': 'Répartition sectorielle',
    'widget.credit_rating_breakdown': 'Répartition des notations',
    'widget.maturity_breakdown': 'Répartition des échéances',
    'widget.profile_breakdown': 'Répartition des profils',
    'widget.performance_history': 'Historique des performances (30 jours)',
    'widget.sector_allocation': 'Allocation sectorielle',
    'widget.rating_distribution': 'Distribution des notations',
    'widget.historical_prices': 'Prix historiques et grecques',
    'widget.bond_characteristics': 'Caractéristiques de l\'obligation',
    'widget.last_30_days': 'Tendance des performances des 30 derniers jours',
    
    // Legend items
    'legend.cb_index': 'Indice CB',
    'legend.equity_index': 'Indice actions',
    'legend.delta_neutral': 'Delta neutre',
    
    // Table Headers
    'table.isin': 'ISIN',
    'table.issuer': 'Émetteur',
    'table.sector': 'Secteur',
    'table.currency': 'Devise',
    'table.coupon': 'Coupon',
    'table.price': 'Prix',
    'table.delta': 'Delta',
    'table.rating': 'Notation',
    'table.maturity': 'Échéance',
    'table.perf_1m': 'Perf 1M',
    
    // Buttons
    'button.export_csv': 'Exporter en CSV',
    'button.back_to_universe': 'Retour à l\'univers',
    'button.save_inputs': 'Enregistrer les entrées personnalisées',
    
    // Filter Labels
    'filter.search': 'Rechercher par ISIN, émetteur ou pays...',
    'filter.sector': 'Secteur',
    'filter.country': 'Pays',
    'filter.rating': 'Notation de crédit',
    'filter.currency': 'Devise',
    
    // Dimension Labels
    'dimension.primary': 'Dimension primaire',
    'dimension.secondary': 'Dimension secondaire',
    'dimension.sector': 'Secteur',
    'dimension.rating': 'Notation de crédit',
    'dimension.size': 'Taille de capitalisation',
    'dimension.profile': 'Profil d\'obligation',
    'dimension.maturity': 'Tranche d\'échéance',
    
    // Other
    'currency.us_dollar': 'EUR',
    'dark_mode': 'Mode sombre',
    'light_mode': 'Mode clair',
    'of': 'de',
    'tracking': 'Suivi',
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
  const [language, setLanguageState] = useState<Language>(() => {
    // Load language from localStorage on initialization
    if (typeof localStorage !== 'undefined') {
      const savedLang = localStorage.getItem('convpilot-language');
      if (savedLang === 'en' || savedLang === 'fr') {
        return savedLang;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('convpilot-language', lang);
    }
  };

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
