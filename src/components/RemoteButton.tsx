/**
 * Remote Control Button
 * Button for controlling device functions
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '@theme/index';
import SensorService from '@services/SensorService';
import type { Command } from '@types/devices';

interface RemoteButtonProps {
  command: Command;
  onPress: (command: Command) => void;
  variant?: 'normal' | 'circular' | 'rectangular';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  hapticEnabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const RemoteButton: React.FC<RemoteButtonProps> = ({
  command,
  onPress,
  variant = 'circular',
  size = 'medium',
  disabled = false,
  hapticEnabled = true,
  style,
  testID,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handlePress = async () => {
    if (disabled) return;

    if (hapticEnabled) {
      await SensorService.triggerHaptic('medium');
    }

    setIsPressed(true);
    onPress(command);
    setTimeout(() => setIsPressed(false), 150);
  };

  const buttonStyle = [
    styles.button,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    disabled && styles.disabled,
    isPressed && styles.pressed,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID || `remote-button-${command.id}`}
    >
      <Text style={[styles.label, styles[`size_${size}_text`]]}>{command.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glass.light,
    borderColor: Colors.glass.lighter,
    borderWidth: 1,
  },

  // Variants
  variant_circular: {
    borderRadius: 9999,
  },
  variant_rectangular: {
    borderRadius: Spacing.radius.md,
  },
  variant_normal: {
    borderRadius: Spacing.radius.lg,
  },

  // Sizes
  size_small: {
    width: 60,
    height: 60,
  },
  size_medium: {
    width: 80,
    height: 80,
  },
  size_large: {
    width: 100,
    height: 100,
  },

  // Text sizes
  size_small_text: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  size_medium_text: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  size_large_text: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },

  // States
  label: {
    color: Colors.text.primary,
    textAlign: 'center',
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.6,
    backgroundColor: Colors.glass.medium,
  },
});

export default RemoteButton;
