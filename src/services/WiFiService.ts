/**
 * WiFi Network Discovery Service
 */

import type { DiscoveredDevice, NetworkScanResult } from '@types/devices';

export class WiFiService {
  private static instance: WiFiService;

  private constructor() {}

  static getInstance(): WiFiService {
    if (!WiFiService.instance) {
      WiFiService.instance = new WiFiService();
    }
    return WiFiService.instance;
  }

  /**
   * Get device's current IP address
   */
  async getDeviceIP(): Promise<string> {
    try {
      // Note: This requires native module on real device
      // For now, return a default value
      return '192.168.1.100';
    } catch (error) {
      console.error('Failed to get device IP:', error);
      return '192.168.1.1';
    }
  }

  /**
   * Calculate network subnet from IP
   * Example: 192.168.1.45 -> 192.168.1.0
   */
  getNetworkSubnet(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
    }
    return parts.join('.');
  }

  /**
   * Scan network for active devices
   */
  async scanNetwork(onProgress?: (progress: number) => void): Promise<DiscoveredDevice[]> {
    try {
      const deviceIP = await this.getDeviceIP();
      const subnet = this.getNetworkSubnet(deviceIP);
      const baseIP = subnet.replace('.0', '');

      const discoveredDevices: DiscoveredDevice[] = [];
      const promises: Promise<DiscoveredDevice | null>[] = [];

      // Scan IPs 1-254
      for (let i = 1; i < 255; i++) {
        const ip = `${baseIP}.${i}`;
        promises.push(this.probeIP(ip));

        // Report progress
        if (onProgress) {
          onProgress((i / 254) * 100);
        }

        // Limit concurrent requests
        if (promises.length >= 20) {
          const results = await Promise.allSettled(promises);
          results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
              discoveredDevices.push(result.value);
            }
          });
          promises.length = 0;
        }
      }

      // Process remaining
      const results = await Promise.allSettled(promises);
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          discoveredDevices.push(result.value);
        }
      });

      onProgress?.(100);
      return discoveredDevices;
    } catch (error) {
      console.error('Network scan failed:', error);
      return [];
    }
  }

  /**
   * Probe a single IP for devices
   */
  private async probeIP(ip: string): Promise<DiscoveredDevice | null> {
    try {
      // Try common device endpoints
      const endpoints = [
        `http://${ip}:80/api/v1/device/info`,
        `http://${ip}:1400/device`,
        `http://${ip}:8008/setup/eureka_info`,
        `http://${ip}:443/device`,
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            timeout: 2000,
            method: 'GET',
          });

          if (response.ok) {
            const data = await response.json();
            return this.parseDeviceInfo(ip, data);
          }
        } catch (e) {
          // Try next endpoint
          continue;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse device info response
   */
  private parseDeviceInfo(ip: string, data: any): DiscoveredDevice {
    return {
      ip,
      port: 80,
      name: data.name || data.device_name || 'Unknown Device',
      model: data.model || data.product,
      brand: data.brand || this.detectBrand(data),
      mac: data.mac || data.macAddress,
      type: this.detectDeviceType(data),
      discoveryMethod: 'ping',
      serviceTypes: data.serviceTypes || [],
    };
  }

  /**
   * Detect device type from info
   */
  private detectDeviceType(data: any) {
    const str = JSON.stringify(data).toLowerCase();
    if (str.includes('tv')) return 'tv';
    if (str.includes('soundbar')) return 'soundbar';
    if (str.includes('light')) return 'lights';
    if (str.includes('receiver')) return 'receiver';
    return 'unknown';
  }

  /**
   * Detect device brand
   */
  private detectBrand(data: any): string {
    const model = (data.model || '').toLowerCase();
    if (model.includes('xiaomi')) return 'Xiaomi';
    if (model.includes('lg')) return 'LG';
    if (model.includes('samsung')) return 'Samsung';
    if (model.includes('sonos')) return 'Sonos';
    return 'Unknown';
  }

  /**
   * Ping a single device
   */
  async ping(ip: string): Promise<NetworkScanResult> {
    const startTime = Date.now();
    try {
      const response = await fetch(`http://${ip}:80/`, {
        timeout: 2000,
      });
      const responseTime = Date.now() - startTime;

      return {
        ip,
        isActive: response.ok,
        responseTime,
      };
    } catch (error) {
      return {
        ip,
        isActive: false,
      };
    }
  }
}

export default WiFiService.getInstance();
