/**
 * Redux Slice for App Settings
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  hapticEnabled: boolean;
  gyroEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoDiscovery: boolean;
  refreshInterval: number;
  useGlassmorphism: boolean;
  language: string;
  notificationsEnabled: boolean;
}

const initialState: SettingsState = {
  hapticEnabled: true,
  gyroEnabled: true,
  theme: 'auto',
  autoDiscovery: true,
  refreshInterval: 30000, // 30 seconds
  useGlassmorphism: true,
  language: 'en',
  notificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setHapticEnabled: (state, action: PayloadAction<boolean>) => {
      state.hapticEnabled = action.payload;
    },
    setGyroEnabled: (state, action: PayloadAction<boolean>) => {
      state.gyroEnabled = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setAutoDiscovery: (state, action: PayloadAction<boolean>) => {
      state.autoDiscovery = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    setUseGlassmorphism: (state, action: PayloadAction<boolean>) => {
      state.useGlassmorphism = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  setHapticEnabled,
  setGyroEnabled,
  setTheme,
  setAutoDiscovery,
  setRefreshInterval,
  setUseGlassmorphism,
  setLanguage,
  setNotificationsEnabled,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
