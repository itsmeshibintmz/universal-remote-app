/**
 * Sensor Service
 * Handles gyroscope, accelerometer, and haptic feedback
 */

import * as Haptics from 'expo-haptics';
import { Gyroscope } from 'expo-sensors';
import type { GyroData, Gesture } from '@types/devices';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export class SensorService {
  private static instance: SensorService;
  private gyroSubscription: any = null;
  private lastGestureTime: number = 0;
  private debounceMs: number = 100;
  private gyroThreshold: number = 1.5;
  private lastGyroData: GyroData = { x: 0, y: 0, z: 0, timestamp: 0 };

  private constructor() {
    // Set gyroscope update interval
    Gyroscope.setUpdateInterval(16); // ~60fps
  }

  static getInstance(): SensorService {
    if (!SensorService.instance) {
      SensorService.instance = new SensorService();
    }
    return SensorService.instance;
  }

  /**
   * Subscribe to gyroscope events
   */
  subscribeToGyroscope(
    onGesture: (gesture: Gesture) => void,
    onRawData?: (data: GyroData) => void
  ): () => void {
    this.gyroSubscription = Gyroscope.addListener((data: any) => {
      const gyroData: GyroData = {
        x: data.x,
        y: data.y,
        z: data.z,
        timestamp: Date.now(),
      };

      // Call raw data callback if provided
      onRawData?.(gyroData);

      // Detect gestures
      const gesture = this.detectGesture(gyroData);
      if (gesture) {
        onGesture(gesture);
      }

      this.lastGyroData = gyroData;
    });

    // Return unsubscribe function
    return () => {
      if (this.gyroSubscription) {
        this.gyroSubscription.remove();
        this.gyroSubscription = null;
      }
    };
  }

  /**
   * Detect gesture from gyro data
   */
  private detectGesture(data: GyroData): Gesture | null {
    const now = Date.now();

    // Debounce gesture detection
    if (now - this.lastGestureTime < this.debounceMs) {
      return null;
    }

    // Detect tilt (x-axis = left/right, y-axis = up/down)
    if (Math.abs(data.x) > this.gyroThreshold) {
      this.lastGestureTime = now;
      const intensity = Math.min(Math.abs(data.x) / 3, 1);
      return {
        type: 'tilt',
        direction: data.x > 0 ? 'right' : 'left',
        intensity,
        confidence: Math.min(intensity, 1),
      };
    }

    if (Math.abs(data.y) > this.gyroThreshold) {
      this.lastGestureTime = now;
      const intensity = Math.min(Math.abs(data.y) / 3, 1);
      return {
        type: 'tilt',
        direction: data.y > 0 ? 'down' : 'up',
        intensity,
        confidence: Math.min(intensity, 1),
      };
    }

    // Detect rotation (z-axis)
    if (Math.abs(data.z) > this.gyroThreshold) {
      this.lastGestureTime = now;
      const intensity = Math.min(Math.abs(data.z) / 3, 1);
      return {
        type: 'rotate',
        direction: data.z > 0 ? 'clockwise' : 'counterclockwise',
        intensity,
        confidence: Math.min(intensity, 1),
      };
    }

    return null;
  }

  /**
   * Trigger haptic feedback
   */
  async triggerHaptic(pattern: HapticPattern = 'light'): Promise<void> {
    try {
      switch (pattern) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }

  /**
   * Selection haptic (for UI feedback)
   */
  async triggerSelectionHaptic(): Promise<void> {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.error('Selection haptic failed:', error);
    }
  }

  /**
   * Custom haptic pattern (single impact)
   */
  async triggerCustom(intensity: number = 0.5): Promise<void> {
    try {
      const pattern = intensity > 0.7 ? 'heavy' : intensity > 0.4 ? 'medium' : 'light';
      await this.triggerHaptic(pattern as HapticPattern);
    } catch (error) {
      console.error('Custom haptic failed:', error);
    }
  }

  /**
   * Get last gyro data
   */
  getLastGyroData(): GyroData {
    return this.lastGyroData;
  }

  /**
   * Set gyro threshold (sensitivity)
   */
  setGyroThreshold(threshold: number): void {
    this.gyroThreshold = threshold;
  }

  /**
   * Set debounce interval
   */
  setDebounceInterval(ms: number): void {
    this.debounceMs = ms;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.gyroSubscription) {
      this.gyroSubscription.remove();
      this.gyroSubscription = null;
    }
  }
}

export default SensorService.getInstance();
