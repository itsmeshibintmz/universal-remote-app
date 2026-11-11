# 🔌 Device Integration Guide

## How to Add Support for New Devices

This guide walks you through adding support for a new smart device type to the Universal Remote App.

---

## Overview

Adding a new device involves:

1. **Define the Device Type** - Create TypeScript interfaces
2. **Create a Device Adapter** - Implement device-specific communication
3. **Register the Adapter** - Add to adapter factory
4. **Create UI Controls** - Build remote buttons for the device
5. **Test Integration** - Verify discovery and control

---

## Step-by-Step Guide

### Step 1: Define the Device Type

Create a new device type in `src/types/devices.ts`:

```typescript
export type DeviceType = 
  | 'soundbar'
  | 'tv'
  | 'cable_box'
  | 'lights'
  | 'receiver'        // NEW
  | 'projector'       // Example for new device type

// Define device-specific config
export interface ReceiverConfig extends DeviceConfig {
  type: 'receiver';
  presets?: string[]; // Favorite radio stations
  inputs: string[]; // HDMI, optical, etc.
}

// Define device status
export interface ReceiverStatus extends DeviceStatus {
  power: 'on' | 'off' | 'standby';
  volume: number;
  volumeDb: number;
  mute: boolean;
  input: string;
  bass?: number;
  treble?: number;
}
```

---

### Step 2: Create a Device Adapter

Create `src/adapters/devices/YamahaReceiverAdapter.ts`:

```typescript
import { IDeviceAdapter } from '../IDeviceAdapter';
import { DiscoveredDevice, DeviceConfig, DeviceStatus, Command } from '../../types/devices';

export class YamahaReceiverAdapter implements IDeviceAdapter {
  private device: DiscoveredDevice | null = null;
  private baseUrl: string = '';
  private timeout: number = 5000;

  /**
   * Check if this adapter can handle the discovered device
   */
  canHandle(device: DiscoveredDevice): boolean {
    // Check device name or model
    return device.model?.includes('Yamaha') || 
           device.modelName?.includes('Receiver') ||
           device.serviceTypes?.includes('urn:yamaha-com:service:ZoneControl');
  }

  /**
   * Connect to the device
   */
  async connect(config: DeviceConfig): Promise<void> {
    this.baseUrl = `http://${config.ip}:${config.port || 80}`;
    
    try {
      // Test connection
      const response = await fetch(`${this.baseUrl}/YamahaRemoteControl/desc.xml`, {
        timeout: this.timeout,
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to receiver');
      }
      
      this.device = config as DiscoveredDevice;
    } catch (error) {
      throw new Error(`Yamaha Receiver connection failed: ${error.message}`);
    }
  }

  /**
   * Send a command to the device
   */
  async sendCommand(command: string, value?: unknown): Promise<void> {
    if (!this.device) throw new Error('Device not connected');

    const payload = this.buildXMLPayload(command, value);
    
    try {
      const response = await fetch(
        `${this.baseUrl}/YamahaRemoteControl/ctrl`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml; charset=UTF-8',
          },
          body: payload,
          timeout: this.timeout,
        }
      );

      if (!response.ok) {
        throw new Error(`Command failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to send command: ${error.message}`);
    }
  }

  /**
   * Get available commands for this device
   */
  getAvailableCommands(): Command[] {
    return [
      {
        id: 'power_on',
        name: 'Power On',
        action: 'Power',
        payload: { state: 'On' },
      },
      {
        id: 'power_off',
        name: 'Power Off',
        action: 'Power',
        payload: { state: 'Standby' },
      },
      {
        id: 'volume_up',
        name: 'Volume Up',
        action: 'VolumeUp',
      },
      {
        id: 'volume_down',
        name: 'Volume Down',
        action: 'VolumeDown',
      },
      {
        id: 'mute_toggle',
        name: 'Mute',
        action: 'Mute',
        payload: { state: 'toggle' },
      },
      {
        id: 'input_hdmi1',
        name: 'HDMI 1',
        action: 'Input',
        payload: { input: 'HDMI1' },
      },
      {
        id: 'input_hdmi2',
        name: 'HDMI 2',
        action: 'Input',
        payload: { input: 'HDMI2' },
      },
    ];
  }

  /**
   * Get current device status
   */
  async getStatus(): Promise<DeviceStatus> {
    if (!this.device) throw new Error('Device not connected');

    try {
      const response = await fetch(
        `${this.baseUrl}/YamahaRemoteControl/getStatus`,
        { timeout: this.timeout }
      );
      
      const text = await response.text();
      return this.parseStatusXML(text);
    } catch (error) {
      throw new Error(`Failed to get status: ${error.message}`);
    }
  }

  /**
   * Helper: Build XML payload for Yamaha protocol
   */
  private buildXMLPayload(action: string, value?: unknown): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<YAMAHA_AV cmd="PUT">
  <System>
    <${action}>${value ?? ''}</${action}>
  </System>
</YAMAHA_AV>`;
  }

  /**
   * Helper: Parse status XML response
   */
  private parseStatusXML(xml: string): DeviceStatus {
    // Parse XML and extract status fields
    // This is a simplified example - use a real XML parser in production
    return {
      power: xml.includes('<Power>On</Power>') ? 'on' : 'off',
      volume: this.extractNumber(xml, 'Volume'),
      input: this.extractString(xml, 'Input'),
      mute: xml.includes('<Mute>On</Mute>'),
    };
  }

  private extractNumber(xml: string, tag: string): number {
    const match = xml.match(new RegExp(`<${tag}>(\\d+)</${tag}>`));
    return match ? parseInt(match[1], 10) : 0;
  }

  private extractString(xml: string, tag: string): string {
    const match = xml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`));
    return match ? match[1] : '';
  }
}
```

---

### Step 3: Create Device Adapter Interface

Ensure your adapter implements `src/adapters/IDeviceAdapter.ts`:

```typescript
import { DiscoveredDevice, DeviceConfig, DeviceStatus, Command } from '../types/devices';

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
  sendCommand(command: string, value?: unknown): Promise<void>;

  /**
   * Get available commands for this device
   */
  getAvailableCommands(): Command[];

  /**
   * Get current device status
   */
  getStatus(): Promise<DeviceStatus>;
}
```

---

### Step 4: Register the Adapter

Update `src/services/AdapterFactory.ts`:

```typescript
import { IDeviceAdapter } from '../adapters/IDeviceAdapter';
import { YamahaReceiverAdapter } from '../adapters/devices/YamahaReceiverAdapter';
import { SonosAdapter } from '../adapters/devices/SonosAdapter';
import { LGTVAdapter } from '../adapters/devices/LGTVAdapter';

export class AdapterFactory {
  private static adapters: IDeviceAdapter[] = [
    new YamahaReceiverAdapter(),    // NEW
    new SonosAdapter(),
    new LGTVAdapter(),
    // ... other adapters
  ];

  /**
   * Find the appropriate adapter for a device
   */
  static getAdapterForDevice(device: DiscoveredDevice): IDeviceAdapter | null {
    return this.adapters.find(adapter => adapter.canHandle(device)) || null;
  }

  /**
   * Register a new adapter
   */
  static registerAdapter(adapter: IDeviceAdapter): void {
    this.adapters.push(adapter);
  }
}
```

---

### Step 5: Create UI Controls

Create `src/screens/controls/ReceiverControls.tsx`:

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import RemoteButton from '../../components/RemoteButton';
import { Command } from '../../types/devices';

interface ReceiverControlsProps {
  commands: Command[];
  onCommandPress: (command: Command) => void;
}

export default function ReceiverControls({ 
  commands, 
  onCommandPress 
}: ReceiverControlsProps) {
  const powerCommands = commands.filter(c => c.id?.includes('power'));
  const volumeCommands = commands.filter(c => c.id?.includes('volume'));
  const inputCommands = commands.filter(c => c.id?.includes('input'));

  return (
    <View style={styles.container}>
      {/* Power Controls */}
      <View style={styles.section}>
        <View style={styles.row}>
          {powerCommands.map(cmd => (
            <RemoteButton
              key={cmd.id}
              label={cmd.name}
              onPress={() => onCommandPress(cmd)}
            />
          ))}
        </View>
      </View>

      {/* Volume Controls */}
      <View style={styles.section}>
        <View style={styles.row}>
          {volumeCommands.map(cmd => (
            <RemoteButton
              key={cmd.id}
              label={cmd.name}
              onPress={() => onCommandPress(cmd)}
            />
          ))}
        </View>
      </View>

      {/* Input Selection */}
      <View style={styles.section}>
        <View style={styles.inputGrid}>
          {inputCommands.map(cmd => (
            <RemoteButton
              key={cmd.id}
              label={cmd.name}
              variant="small"
              onPress={() => onCommandPress(cmd)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});
```

---

### Step 6: Integrate into Control Screen

Update `src/screens/ControlScreen.tsx`:

```typescript
import ReceiverControls from './controls/ReceiverControls';

export default function ControlScreen() {
  const activeDevice = useSelector(selectActiveDevice);
  
  const renderDeviceControls = () => {
    switch (activeDevice?.type) {
      case 'soundbar':
        return <SoundbarControls {...props} />;
      case 'tv':
        return <TVControls {...props} />;
      case 'receiver':           // NEW
        return <ReceiverControls {...props} />;
      default:
        return <GenericControls {...props} />;
    }
  };

  return (
    <View>
      {renderDeviceControls()}
    </View>
  );
}
```

---

## Testing Your Integration

### 1. Unit Tests

Create `src/adapters/__tests__/YamahaReceiverAdapter.test.ts`:

```typescript
import { YamahaReceiverAdapter } from '../devices/YamahaReceiverAdapter';

describe('YamahaReceiverAdapter', () => {
  let adapter: YamahaReceiverAdapter;

  beforeEach(() => {
    adapter = new YamahaReceiverAdapter();
  });

  it('should recognize Yamaha devices', () => {
    const device = {
      model: 'Yamaha RX-V',
      ip: '192.168.1.50',
      port: 80,
    };
    expect(adapter.canHandle(device)).toBe(true);
  });

  it('should return available commands', () => {
    const commands = adapter.getAvailableCommands();
    expect(commands.length).toBeGreaterThan(0);
    expect(commands.some(c => c.id === 'power_on')).toBe(true);
  });
});
```

### 2. Integration Testing

1. Set up a real Yamaha receiver on your test network
2. Run the app and tap "Discover Devices"
3. Verify the receiver is detected
4. Test each command (power, volume, input switching)
5. Check haptic feedback and visual feedback

### 3. Manual Testing Checklist

- [ ] Device is discovered automatically
- [ ] Device appears in device list
- [ ] Control buttons render correctly
- [ ] Power on/off works
- [ ] Volume up/down works
- [ ] Input switching works
- [ ] Status updates in real-time
- [ ] Haptic feedback plays on button press
- [ ] Gyroscope controls work with device
- [ ] Graceful error handling if device disconnects

---

## Common Device Protocols

### REST API Pattern

```typescript
// Example: Generic HTTP device
async sendCommand(command: string, value?: unknown): Promise<void> {
  const response = await fetch(
    `http://${this.baseUrl}/api/command`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, value }),
    }
  );
}
```

### UPnP Pattern

```typescript
// Example: UPnP device (Sonos, DLNA)
private async invokeAction(service: string, action: string, args: any) {
  const soap = this.buildSOAPRequest(service, action, args);
  const response = await fetch(
    `${this.baseUrl}${this.controlURL}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset="utf-8"',
        'SOAPACTION': `"urn:schemas-sonos-com:service:${service}:1#${action}"`,
      },
      body: soap,
    }
  );
}
```

### Bluetooth Pattern

```typescript
// Example: Bluetooth LE device
async sendCommand(command: string): Promise<void> {
  const characteristic = this.device.characteristics
    .find(c => c.uuid === CONTROL_CHARACTERISTIC_UUID);
  
  const data = Buffer.from(command, 'utf8');
  await characteristic.write(data);
}
```

---

## Troubleshooting Device Integration

| Issue | Solution |
|-------|----------|
| Device not discovered | Check if device is on same WiFi, verify port/endpoint |
| Commands fail | Add logging to `sendCommand()`, verify device API docs |
| Status not updating | Implement polling in `getStatus()`, verify response parsing |
| Connection times out | Increase timeout, add retry logic |
| Device disconnects | Implement reconnection logic in adapter |

---

## Next Steps

After successfully integrating a device:

1. **Add device-specific UI** - Create custom controls optimized for device
2. **Implement device profiles** - Save presets/favorites per device
3. **Add to documentation** - Update supported devices list
4. **Create examples** - Add code examples in `/docs/examples`
5. **Submit PR** - Contribute to the main repository!

---

## Resources

- [React Native Fetch API](https://reactnative.dev/docs/network)
- [UPnP/DLNA Specs](https://upnp.org/)
- [Device-Specific Documentation](https://github.com/itsmeshibintmz/universal-remote-app/discussions)
