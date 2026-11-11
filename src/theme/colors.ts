/**
 * Color Palette with Glassmorphism Support
 */

export const Colors = {
  // Primary Colors
  primary: '#007AFF', // iOS Blue
  primaryLight: '#40B0FF',
  primaryDark: '#0051D5',

  // Secondary Colors
  secondary: '#5AC8FA',
  accent: '#FF2D55',

  // Glassmorphism Background
  glass: {
    light: 'rgba(255, 255, 255, 0.3)',
    lighter: 'rgba(255, 255, 255, 0.15)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },

  // Dark Mode
  darkBg: '#000000',
  darkBgSecondary: '#1C1C1E',
  darkBgTertiary: '#2C2C2E',

  // Light Mode
  lightBg: '#FFFFFF',
  lightBgSecondary: '#F2F2F7',
  lightBgTertiary: '#E5E5EA',

  // Text
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    light: '#FFFFFF',
    lightSecondary: 'rgba(255, 255, 255, 0.8)',
  },

  // Status Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#0A84FF',

  // Semantic
  background: '#FFFFFF',
  surface: '#F2F2F7',
  border: '#E5E5EA',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Interactive States
  hover: 'rgba(0, 0, 0, 0.05)',
  active: 'rgba(0, 0, 0, 0.1)',
  disabled: 'rgba(0, 0, 0, 0.2)',
};

export const GlassmorphismTheme = {
  // Blur effect (note: React Native requires blur view component)
  blur: 10,
  opacity: 0.8,

  // Gradient backgrounds for glass effect
  gradients: {
    primary: ['rgba(0, 122, 255, 0.15)', 'rgba(64, 176, 255, 0.1)'],
    secondary: ['rgba(90, 200, 250, 0.15)', 'rgba(90, 200, 250, 0.1)'],
    accent: ['rgba(255, 45, 85, 0.15)', 'rgba(255, 45, 85, 0.1)'],
    success: ['rgba(52, 199, 89, 0.15)', 'rgba(52, 199, 89, 0.1)'],
  },

  // Border colors
  borders: {
    light: 'rgba(255, 255, 255, 0.3)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },
};
