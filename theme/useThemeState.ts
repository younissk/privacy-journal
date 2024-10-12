// theme/useThemeState.tsx
import { create } from 'zustand';
import { Theme } from '@/interfaces/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme } from './index';

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  loadTheme: () => Promise<void>;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: lightTheme, // default theme
  setTheme: (theme) => {
    set({ theme });
    AsyncStorage.setItem('customTheme', JSON.stringify(theme));
  },
  loadTheme: async () => {
    const themeString = await AsyncStorage.getItem('customTheme');
    if (themeString) {
      const theme = JSON.parse(themeString);
      set({ theme });
    }
  },
}));
