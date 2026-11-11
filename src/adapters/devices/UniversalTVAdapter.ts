/**
 * Universal TV Adapter
 * Supports Xiaomi TV, LG WebOS, Samsung SmartTV, and other WiFi-enabled TVs
 */

import { IDeviceAdapter } from '../IDeviceAdapter';
import type { DiscoveredDevice, DeviceConfig, DeviceStatus, Command } from '@types/devices';
import axios from 'axios';

export class UniversalTVAdapter implements IDeviceAdapter {
  private device: DeviceConfig | null = null;
  private baseUrl: string = '';
  private timeout: number = 5000;
  private isConnected: boolean = false;

  /**
   * Check if this adapter can handle the discovered device
   */
  canHandle(device: DiscoveredDevice): boolean {
    // Check for TV-specific indicators
    const indicators = [
      device.model?.toLowerCase().includes('tv'),
      device.brand?.toLowerCase().includes('xiaomi'),
      device.brand?.toLowerCase().includes('lg'),
      device.brand?.toLowerCase().includes('samsung'),
      device.modelName?.toLowerCase().includes('tv'),
      device.serviceTypes?.some(s => s.includes('upnp')),
    ];
    return indicators.some(Boolean);
  }

  /**
   * Connect to the TV
   */
  async connect(config: DeviceConfig): Promise<void> {
    try {
      this.device = config;
      this.baseUrl = `http://${config.ip}:${config.port || 80}`;

      // Test connection
      const canConnect = await this.ping();
      if (!canConnect) {
        throw new Error('Failed to connect to TV');
      }

      this.isConnected = true;
      console.log(`✅ Connected to TV: ${config.name}`);
    } catch (error: any) {
      this.isConnected = false;
      throw new Error(`TV connection failed: ${error.message}`);
    }
  }

  /**
   * Send a command to the TV
   */
  async sendCommand(command: string, payload?: Record<string, unknown>): Promise<void> {
    if (!this.isConnected || !this.device) {
      throw new Error('Device not connected');
    }

    try {
      const commandData = this.buildCommand(command, payload);

      // Try different API endpoints based on TV type
      const endpoints = [
        '/api/v3/control',
        '/remote/sendkey',
        '/api/v1/device/sendkey',
        '/upnp/control',
      ];

      let success = false;
      for (const endpoint of endpoints) {
        try {
          const response = await axios.post(`${this.baseUrl}${endpoint}`, commandData, {
            timeout: this.timeout,
          });

          if (response.status === 200 || response.status === 204) {
            success = true;
            break;
          }
        } catch (e) {
          // Try next endpoint
          continue;
        }
      }

      if (!success) {
        throw new Error(`Command '${command}' failed on all endpoints`);
      }
    } catch (error: any) {
      throw new Error(`Failed to send command: ${error.message}`);
    }
  }

  /**
   * Get available commands for this TV
   */
  getAvailableCommands(): Command[] {
    return [
      // Power controls
      {
        id: 'power_on',
        name: 'Power On',
        category: 'power',
        action: 'POWER_ON',
        icon: 'power',
      },
      {
        id: 'power_off',
        name: 'Power Off',
        category: 'power',
        action: 'POWER_OFF',
        icon: 'power',
      },
      {
        id: 'power_toggle',
        name: 'Power Toggle',
        category: 'power',
        action: 'POWER',
        icon: 'power',
      },

      // Volume controls
      {
        id: 'volume_up',
        name: 'Volume Up',
        category: 'volume',
        action: 'VOLUME_UP',
        icon: 'volume-plus',
      },
      {
        id: 'volume_down',
        name: 'Volume Down',
        category: 'volume',
        action: 'VOLUME_DOWN',
        icon: 'volume-minus',
      },
      {
        id: 'mute_toggle',
        name: 'Mute',
        category: 'volume',
        action: 'MUTE',
        icon: 'volume-mute',
      },

      // Channel controls
      {
        id: 'channel_up',
        name: 'Channel Up',
        category: 'playback',
        action: 'CHANNEL_UP',
        icon: 'chevron-up',
      },
      {
        id: 'channel_down',
        name: 'Channel Down',
        category: 'playback',
        action: 'CHANNEL_DOWN',
        icon: 'chevron-down',
      },

      // Navigation
      {
        id: 'menu',
        name: 'Menu',
        category: 'menu',
        action: 'MENU',
        icon: 'menu',
      },
      {
        id: 'back',
        name: 'Back',
        category: 'menu',
        action: 'BACK',
        icon: 'arrow-left',
      },
      {
        id: 'enter',
        name: 'Enter',
        category: 'menu',
        action: 'ENTER',
        icon: 'check',
      },
      {
        id: 'up',
        name: 'Up',
        category: 'menu',
        action: 'UP',
      },
      {
        id: 'down',
        name: 'Down',
        category: 'menu',
        action: 'DOWN',
      },
      {
        id: 'left',
        name: 'Left',
        category: 'menu',
        action: 'LEFT',
      },
      {
        id: 'right',
        name: 'Right',
        category: 'menu',
        action: 'RIGHT',
      },

      // Home
      {
        id: 'home',
        name: 'Home',
        category: 'menu',
        action: 'HOME',
        icon: 'home',
      },
    ];
  }

  /**
   * Get current TV status
   */
  async getStatus(): Promise<DeviceStatus> {
    if (!this.isConnected || !this.device) {
      throw new Error('Device not connected');
    }

    try {
      // Try different status endpoints
      const endpoints = [
        '/api/v3/status',
        '/api/v1/device/status',
        '/remote/status',
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(`${this.baseUrl}${endpoint}`, {
            timeout: this.timeout,
          });

          return this.parseStatus(response.data);
        } catch (e) {
          // Try next endpoint
          continue;
        }
      }

      // Return default status if we can't get detailed status
      return {
        id: this.device.id,
        power: 'on',
        isConnected: true,
        lastUpdated: Date.now(),
        volume: 50,
      };
    } catch (error: any) {
      throw new Error(`Failed to get status: ${error.message}`);
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.device = null;
  }

  /**
   * Test connection to device
   */
  async ping(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/device/info`, {
        timeout: this.timeout,
      });
      return response.status === 200;
    } catch {
      try {
        // Try alternative endpoint
        const response = await axios.get(`${this.baseUrl}/remote/status`, {
          timeout: this.timeout,
        });
        return response.status === 200;
      } catch {
        return false;
      }
    }
  }

  /**
   * Helper: Build command payload
   */
  private buildCommand(
    action: string,
    payload?: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      action,
      payload: payload || {},
      timestamp: Date.now(),
    };
  }

  /**
   * Helper: Parse status response
   */
  private parseStatus(data: any): DeviceStatus {
    return {
      id: this.device?.id || 'unknown',
      power: data.power === 'on' || data.power === 1 ? 'on' : 'off',
      volume: data.volume ?? 50,
      mute: data.mute ?? false,
      input: data.input ?? data.hdmi ?? 'HDMI1',
      isConnected: true,
      lastUpdated: Date.now(),
    };
  }
}
