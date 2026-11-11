/**
 * Device Control Service
 * Main service for controlling devices
 */

import { AdapterFactory } from '@adapters/AdapterFactory';
import { IDeviceAdapter } from '@adapters/IDeviceAdapter';
import type { DeviceConfig, DeviceStatus, Command, DiscoveredDevice } from '@types/devices';

export class DeviceService {
  private static instance: DeviceService;
  private activeDevice: DeviceConfig | null = null;
  private activeAdapter: IDeviceAdapter | null = null;
  private deviceCache: Map<string, IDeviceAdapter> = new Map();

  private constructor() {}

  static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  /**
   * Connect to a device
   */
  async connectToDevice(device: DeviceConfig): Promise<void> {
    try {
      // Check cache first
      let adapter = this.deviceCache.get(device.id);

      if (!adapter) {
        // Get adapter from factory
        const discoveredDevice: DiscoveredDevice = {
          ip: device.ip,
          port: device.port,
          name: device.name,
          model: device.type,
          discoveryMethod: 'ping',
        };

        adapter = AdapterFactory.getAdapterForDevice(discoveredDevice);

        if (!adapter) {
          throw new Error(`No adapter found for device type: ${device.type}`);
        }

        this.deviceCache.set(device.id, adapter);
      }

      // Connect to device
      await adapter.connect(device);

      this.activeDevice = device;
      this.activeAdapter = adapter;

      console.log(`✅ Connected to ${device.name}`);
    } catch (error: any) {
      console.error('Failed to connect to device:', error);
      throw error;
    }
  }

  /**
   * Send command to active device
   */
  async sendCommand(commandId: string): Promise<void> {
    if (!this.activeAdapter || !this.activeDevice) {
      throw new Error('No device connected');
    }

    try {
      const commands = this.activeAdapter.getAvailableCommands();
      const command = commands.find((c) => c.id === commandId);

      if (!command) {
        throw new Error(`Command not found: ${commandId}`);
      }

      await this.activeAdapter.sendCommand(command.action, command.payload);
      console.log(`✅ Sent command: ${command.name}`);
    } catch (error: any) {
      console.error('Failed to send command:', error);
      throw error;
    }
  }

  /**
   * Send custom command
   */
  async sendCustomCommand(action: string, payload?: Record<string, unknown>): Promise<void> {
    if (!this.activeAdapter) {
      throw new Error('No device connected');
    }

    try {
      await this.activeAdapter.sendCommand(action, payload);
    } catch (error: any) {
      console.error('Failed to send custom command:', error);
      throw error;
    }
  }

  /**
   * Get device status
   */
  async getDeviceStatus(): Promise<DeviceStatus | null> {
    if (!this.activeAdapter) {
      return null;
    }

    try {
      return await this.activeAdapter.getStatus();
    } catch (error) {
      console.error('Failed to get device status:', error);
      return null;
    }
  }

  /**
   * Get available commands for active device
   */
  getAvailableCommands(): Command[] {
    return this.activeAdapter?.getAvailableCommands() ?? [];
  }

  /**
   * Get active device
   */
  getActiveDevice(): DeviceConfig | null {
    return this.activeDevice;
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    if (this.activeAdapter) {
      await this.activeAdapter.disconnect();
    }
    this.activeDevice = null;
    this.activeAdapter = null;
  }

  /**
   * Test device connection
   */
  async testConnection(device: DeviceConfig): Promise<boolean> {
    try {
      const discoveredDevice: DiscoveredDevice = {
        ip: device.ip,
        port: device.port,
        name: device.name,
        model: device.type,
        discoveryMethod: 'ping',
      };

      const adapter = AdapterFactory.getAdapterForDevice(discoveredDevice);
      if (!adapter) {
        return false;
      }

      const tempAdapter = adapter;
      await tempAdapter.connect(device);
      const isConnected = await tempAdapter.ping();
      await tempAdapter.disconnect();

      return isConnected;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Clear device cache
   */
  clearCache(): void {
    this.deviceCache.clear();
  }
}

export default DeviceService.getInstance();
