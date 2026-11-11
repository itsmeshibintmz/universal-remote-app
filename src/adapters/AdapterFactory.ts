/**
 * Adapter Factory
 * Manages and creates device adapters
 */

import { IDeviceAdapter } from './IDeviceAdapter';
import { UniversalTVAdapter } from './devices/UniversalTVAdapter';
import type { DiscoveredDevice } from '@types/devices';

export class AdapterFactory {
  private static adapters: IDeviceAdapter[] = [
    new UniversalTVAdapter(),
    // More adapters will be added here:
    // new SonosAdapter(),
    // new LGTVAdapter(),
    // new PhilipsHueAdapter(),
    // etc.
  ];

  /**
   * Find the appropriate adapter for a device
   */
  static getAdapterForDevice(device: DiscoveredDevice): IDeviceAdapter | null {
    for (const adapter of this.adapters) {
      if (adapter.canHandle(device)) {
        return adapter;
      }
    }
    console.warn(`No adapter found for device:`, device);
    return null;
  }

  /**
   * Register a new adapter (for plugins)
   */
  static registerAdapter(adapter: IDeviceAdapter): void {
    this.adapters.push(adapter);
    console.log('✅ Adapter registered:', adapter.constructor.name);
  }

  /**
   * Get all registered adapters
   */
  static getAllAdapters(): IDeviceAdapter[] {
    return [...this.adapters];
  }

  /**
   * Clear all adapters (for testing)
   */
  static clearAdapters(): void {
    this.adapters = [];
  }
}
