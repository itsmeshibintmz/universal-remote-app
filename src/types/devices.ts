/**
 * Device Types and Interfaces
 * Defines all device-related TypeScript types
 */

export type DeviceType =
  | 'tv'
  | 'soundbar'
  | 'cable_box'
  | 'receiver'
  | 'lights'
  | 'projector'
  | 'unknown';

export type ConnectionProtocol = 'rest' | 'upnp' | 'bluetooth' | 'mqtt';

/**
 * Base device configuration
 */
export interface DeviceConfig {
  id: string;
  name: string;
  type: DeviceType;
  ip: string;
  port: number;
  protocol: ConnectionProtocol;
  apiKey?: string;
  username?: string;
  password?: string;
  mac?: string;
  lastSeen: number;
}

/**
 * TV-specific configuration
 */
export interface TVConfig extends DeviceConfig {
  type: 'tv';
  model?: string;
  brand?: string;
  inputs?: string[];
}

/**
 * Soundbar-specific configuration
 */
export interface SoundbarConfig extends DeviceConfig {
  type: 'soundbar';
  model?: string;
  inputSources?: string[];
  maxVolume?: number;
}

/**
 * Discovered device (before pairing)
 */
export interface DiscoveredDevice {
  ip: string;
  port: number;
  name: string;
  model?: string;
  modelName?: string;
  brand?: string;
  type?: DeviceType;
  mac?: string;
  serviceTypes?: string[];
  discoveryMethod: 'mdns' | 'ping' | 'upnp' | 'broadcast';
}

/**
 * Device status/state
 */
export interface DeviceStatus {
  id: string;
  power: 'on' | 'off' | 'standby' | 'unknown';
  volume?: number;
  volumeDb?: number;
  mute?: boolean;
  input?: string;
  brightness?: number;
  temperature?: number;
  customStatus?: Record<string, unknown>;
  lastUpdated: number;
  isConnected: boolean;
}

/**
 * Remote control command
 */
export interface Command {
  id: string;
  name: string;
  category: 'power' | 'volume' | 'input' | 'playback' | 'menu' | 'custom';
  action: string;
  payload?: Record<string, unknown>;
  icon?: string;
  description?: string;
}

/**
 * Remote profile (collection of custom buttons)
 */
export interface RemoteProfile {
  id: string;
  name: string;
  description?: string;
  deviceId: string;
  deviceType: DeviceType;
  buttons: ButtonMapping[];
  createdAt: number;
  updatedAt: number;
  isDefault: boolean;
}

/**
 * Button mapping in a remote profile
 */
export interface ButtonMapping {
  id: string;
  label: string;
  command: Command;
  position: {
    row: number;
    col: number;
  };
  color?: string;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Gyroscope data
 */
export interface GyroData {
  x: number; // Tilt left/right
  y: number; // Tilt up/down
  z: number; // Rotation
  timestamp: number;
}

/**
 * Gesture recognition
 */
export interface Gesture {
  type: 'tilt' | 'shake' | 'rotate';
  direction?: 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  intensity: number; // 0-1
  confidence: number; // 0-1
}

/**
 * Network scan result
 */
export interface NetworkScanResult {
  ip: string;
  isActive: boolean;
  responseTime?: number;
  hostname?: string;
  mac?: string;
}

/**
 * Connection error details
 */
export interface ConnectionError {
  type: 'timeout' | 'refused' | 'unreachable' | 'authentication' | 'protocol' | 'unknown';
  message: string;
  code?: string;
  timestamp: number;
}
