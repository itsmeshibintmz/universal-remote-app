/**
 * Device Adapter Interface
 * All device-specific implementations must implement this interface
 */

import type { DiscoveredDevice, DeviceConfig, DeviceStatus, Command } from '@types/devices';

export interface IDeviceAdapter {
  /**
   * Check if this adapter can handle a discovered device
   */
  canHandle(device: DiscoveredDevice): boolean;

  /**
   * Connect to the device
   */
  connect(config: DeviceConfig): Promise<void>;

  /**
   * Send a command to the device
   */
  sendCommand(command: string, payload?: Record<string, unknown>): Promise<void>;

  /**
   * Get available commands for this device
   */
  getAvailableCommands(): Command[];

  /**
   * Get current device status
   */
  getStatus(): Promise<DeviceStatus>;

  /**
   * Disconnect from device
   */
  disconnect(): Promise<void>;

  /**
   * Test connection
   */
  ping(): Promise<boolean>;
}
