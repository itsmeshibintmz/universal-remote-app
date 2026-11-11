/**
 * Glass Morphism Button Component
 * Beautiful iOS-style button with glass effect
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, GlassmorphismTheme, Spacing, Typography } from '@theme/index';
import { useHapticEnabled } from '@store/hooks';
import SensorService from '@services/SensorService';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  hapticEnabled?: boolean;
  hapticPattern?: 'light' | 'medium' | 'heavy';
  style?: ViewStyle;
  testID?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  hapticEnabled = true,
  hapticPattern = 'medium',
  style,
  testID,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const globalHapticEnabled = useHapticEnabled();

  const handlePress = async () => {
    if (disabled) return;

    // Trigger haptic
    if (hapticEnabled && globalHapticEnabled) {
      await SensorService.triggerHaptic(hapticPattern);
    }

    setIsPressed(true);
    onPress();
    setTimeout(() => setIsPressed(false), 200);
  };

  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    isPressed && styles.pressed,
    style,
  ];

  const textStyle = [styles.text, styles[`${size}Text`], styles[`${variant}Text`]];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {icon && <>{icon}</>}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.radius.lg,
    borderWidth: GlassmorphismTheme.glassMorphism.borderWidth,
    backgroundColor: GlassmorphismTheme.glassMorphism.opacity
      ? Colors.glass.light
      : Colors.primary,
  },

  // Variants
  primary: {
    backgroundColor: Colors.glass.light,
    borderColor: Colors.glass.light,
  },
  secondary: {
    backgroundColor: Colors.glass.medium,
    borderColor: Colors.glass.lighter,
  },
  danger: {
    backgroundColor: `rgba(255, 59, 48, ${GlassmorphismTheme.glassMorphism.opacity})`,
    borderColor: Colors.error,
  },
  success: {
    backgroundColor: `rgba(52, 199, 89, ${GlassmorphismTheme.glassMorphism.opacity})`,
    borderColor: Colors.success,
  },

  // Sizes
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  medium: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minWidth: 80,
  },
  large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minWidth: 120,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },

  // Text styles
  text: {
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  smallText: {
    fontSize: Typography.sizes.sm,
  },
  mediumText: {
    fontSize: Typography.sizes.base,
  },
  largeText: {
    fontSize: Typography.sizes.lg,
  },

  primaryText: {
    color: Colors.primary,
  },
  secondaryText: {
    color: Colors.text.secondary,
  },
  dangerText: {
    color: Colors.error,
  },
  successText: {
    color: Colors.success,
  },
});

export default GlassButton;
