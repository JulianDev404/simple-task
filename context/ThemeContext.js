import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(undefined);

export const themes = {
  light: {
    name: 'light',
    // Backgrounds
    background: 'bg-gray-50',
    card: 'bg-white',
    cardSecondary: 'bg-gray-50',
    cardHover: 'active:bg-gray-100',

    // Text Colors
    text: 'text-gray-900',
    secondaryText: 'text-gray-600',
    tertiaryText: 'text-gray-500',

    // Borders
    border: 'border-gray-200',
    divider: 'border-gray-100',

    // Icons & Accents
    icon: '#64748b',
    iconSelected: '#9333EA',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-600',
    accentLight: 'bg-purple-50',

    // Stats & Indicators
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    info: 'text-blue-600',

    // Input & Forms
    input: 'bg-white border-gray-200',
    inputFocus: 'border-purple-500',

    // Shadows
    shadow: 'shadow-sm',
    shadowLg: 'shadow-md',

    // Status Bar
    statusBar: 'dark',

    // Navigation
    tabBar: 'bg-white border-t border-gray-200',
    tabBarInactive: '#94a3b8',
  },
  dark: {
    name: 'dark',
    // Backgrounds
    background: 'bg-gray-900',
    card: 'bg-gray-800/50',
    cardSecondary: 'bg-gray-800',
    cardHover: 'active:bg-gray-700',

    // Text Colors
    text: 'text-white',
    secondaryText: 'text-gray-400',
    tertiaryText: 'text-gray-500',

    // Borders
    border: 'border-gray-800',
    divider: 'border-gray-700',

    // Icons & Accents
    icon: '#9CA3AF',
    iconSelected: '#9333EA',
    accent: 'text-purple-500',
    accentBg: 'bg-purple-600',
    accentLight: 'bg-purple-900/30',

    // Stats & Indicators
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    info: 'text-blue-500',

    // Input & Forms
    input: 'bg-gray-800 border-gray-700',
    inputFocus: 'border-purple-500',

    // Shadows
    shadow: 'shadow-none',
    shadowLg: 'shadow-lg shadow-black/20',

    // Status Bar
    statusBar: 'light',

    // Navigation
    tabBar: 'bg-gray-900 border-t border-gray-800',
    tabBarInactive: '#6B7280',
  },
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? themes.dark : themes.light,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
