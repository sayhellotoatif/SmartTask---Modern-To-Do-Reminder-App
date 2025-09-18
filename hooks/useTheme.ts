import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export interface Colors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
}

const lightTheme: Colors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  primary: '#2563EB',
  secondary: '#10B981',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#059669',
};

const darkTheme: Colors = {
  background: '#1C1C1E',
  surface: '#2C2C2E',
  primary: '#3B82F6',
  secondary: '#10B981',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#3C3C3E',
  error: '#F87171',
  success: '#34D399',
};

const THEME_KEY = '@smarttask:theme';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsReady(true);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDark ? darkTheme : lightTheme;

  return {
    isDark,
    colors,
    toggleTheme,
    isReady,
  };
}