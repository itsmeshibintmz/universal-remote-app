/**
 * Theme Export
 */

export { Colors, GlassmorphismTheme } from './colors';
export { Typography } from './typography';
export { Spacing } from './spacing';

// Combined theme object
export const Theme = {
  colors: require('./colors').Colors,
  glassmorphism: require('./colors').GlassmorphismTheme,
  typography: require('./typography').Typography,
  spacing: require('./spacing').Spacing,
};
