# 📖 Developer Guide

## Getting Started with Development

This guide provides practical examples and best practices for developing features in the Universal Remote App.

---

## Project Structure Quick Reference

```
universal-remote-app/
│
├── src/
│   ├── App.tsx                 # Root component & navigation
│   ├── main.tsx                # App entry point
│   │
│   ├── screens/                # Full-page screens
│   │   ├── HomeScreen.tsx      # Device list
│   │   ├── ControlScreen.tsx   # Remote control UI
│   │   ├── SetupScreen.tsx     # Device setup wizard
│   │   └── SettingsScreen.tsx  # App settings
│   │
│   ├── components/             # Reusable UI components
│   │   ├── RemoteButton.tsx    # Control button
│   │   ├── DeviceCard.tsx      # Device info card
│   │   ├── GyroscopeOverlay.tsx# Gesture hints
│   │   └── Header.tsx          # App header
│   │
│   ├── services/               # Business logic
│   │   ├── DeviceService.ts    # Device control
│   │   ├── WiFiService.ts      # Network scanning
│   │   ├── SensorService.ts    # Gyro/haptics
│   │   └── StorageService.ts   # Local data
│   │
│   ├── adapters/               # Device-specific code
│   │   ├── IDeviceAdapter.ts   # Interface
│   │   ├── devices/            # Adapter implementations
│   │   │   ├── SonosAdapter.ts
│   │   │   ├── LGTVAdapter.ts
│   │   │   └── ...
│   │   ├── protocols/          # Communication protocols
│   │   │   ├── RestProtocol.ts
│   │   │   ├── UPnPProtocol.ts
│   │   │   └── BluetoothProtocol.ts
│   │   └── AdapterFactory.ts
│   │
│   ├── store/                  # Redux state (optional)
│   │   ├── store.ts            # Store config
│   │   ├── slices/             # Redux slices
│   │   │   ├── deviceSlice.ts
│   │   │   ├── remoteSlice.ts
│   │   │   └── settingsSlice.ts
│   │   └── hooks.ts            # Redux hooks
│   │
│   ├── types/                  # TypeScript types
│   │   ├── devices.ts          # Device types
│   │   ├── commands.ts         # Command types
│   │   └── api.ts              # API types
│   │
│   ├── utils/                  # Utilities
│   │   ├── constants.ts        # App constants
│   │   ├── helpers.ts          # Helper functions
│   │   ├── validators.ts       # Validation logic
│   │   └── formatters.ts       # Data formatting
│   │
│   └── theme/                  # UI theme
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
│
├── ios/                        # iOS native code
├── android/                    # Android native code
│
├── docs/                       # Documentation
│   ├── SETUP.md                # Setup guide
│   ├── ARCHITECTURE.md         # Architecture overview
│   ├── DEVICE_INTEGRATION.md   # Device integration guide
│   ├── examples/               # Code examples
│   └── TROUBLESHOOTING.md      # Common issues
│
├── __tests__/                  # Test files
├── package.json
├── tsconfig.json
└── README.md
```

---

## Development Workflow

### 1. Running the Development Environment

```bash
# Install dependencies
npm install

# Start Metro bundler (handles hot reload)
npm run start

# In another terminal, run on iOS
npm run ios

# Or run on Android
npm run android
```

### 2. Making Code Changes

When you modify code:
- **JavaScript/TypeScript**: Auto hot-reload (Cmd + R on device)
- **Native modules**: Must rebuild (Cmd + B then Cmd + R)
- **Assets**: Rebuild app bundle

### 3. Debugging

#### Using React Native Debugger

```bash
# Install React Native Debugger (one-time)
brew install react-native-debugger

# Open debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

#### Debug Menu (Device)
- **Cmd + D** (iOS) - Open debug menu
- **Cmd + M** (Android) - Open debug menu

#### Console Logging
```typescript
console.log('Device found:', device);
console.error('Connection failed:', error);
console.debug('Status:', status);
```

---

## Common Development Tasks

### Task 1: Add a New Remote Button

**File**: `src/components/RemoteButton.tsx`

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { triggerHapticFeedback } from '../services/SensorService';

interface RemoteButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'small';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function RemoteButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
}: RemoteButtonProps) {
  const handlePress = async () => {
    // Trigger haptic feedback
    await triggerHapticFeedback('light');
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <>{icon}</>}
      <Text style={[styles.label, styles[`${variant}Text`]]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#E5E5EA',
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFF',
  },
  secondaryText: {
    color: '#000',
  },
  smallText: {
    fontSize: 14,
    color: '#000',
  },
});
```

### Task 2: Implement Device Discovery

**File**: `src/services/WiFiService.ts`

```typescript
import NetworkInfo from 'react-native-network-info';
import { Ping } from 'react-native-ping';

export class WiFiService {
  /**
   * Get device IP address
   */
  async getDeviceIP(): Promise<string> {
    const ip = await NetworkInfo.getIPAddress();
    if (!ip) throw new Error('Could not determine device IP');
    return ip;
  }

  /**
   * Calculate network subnet
   * Example: 192.168.1.45 -> 192.168.1.0/24
   */
  getNetworkSubnet(ip: string): string {
    const parts = ip.split('.');
    parts[3] = '0'; // Last octet
    return parts.join('.');
  }

  /**
   * Scan network for active devices
   */
  async scanNetwork(): Promise<string[]> {
    const deviceIP = await this.getDeviceIP();
    const subnet = this.getNetworkSubnet(deviceIP);
    
    const activeIPs: string[] = [];
    const ips = [];

    // Generate list of IPs to scan
    for (let i = 1; i < 255; i++) {
      ips.push(`${subnet.replace('0/24', '')}${i}`);
    }

    // Ping each IP (parallel with limit)
    const results = await Promise.allSettled(
      ips.map(ip => 
        this.pingIP(ip, 1000) // 1 second timeout
      )
    );

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value) {
        activeIPs.push(ips[idx]);
      }
    });

    return activeIPs;
  }

  /**
   * Ping a single IP
   */
  private async pingIP(ip: string, timeout: number): Promise<boolean> {
    try {
      const result = await Ping.ping(ip, timeout);
      return result > 0;
    } catch {
      return false;
    }
  }

  /**
   * Query device for info on known port
   */
  async queryDevice(ip: string): Promise<any> {
    const ports = [80, 443, 1400, 8008, 5000];
    
    for (const port of ports) {
      try {
        const response = await fetch(
          `http://${ip}:${port}/api/info`,
          { timeout: 2000 }
        );
        
        if (response.ok) {
          return await response.json();
        }
      } catch {
        // Try next port
        continue;
      }
    }
    
    return null;
  }
}
```

### Task 3: Add Gyroscope Control

**File**: `src/services/SensorService.ts`

```typescript
import RNSensors from 'react-native-sensors';
import { HapticFeedback } from 'react-native-haptic-feedback';

export class SensorService {
  private gyroSubscription: any;
  private lastAction: number = 0;
  private debounceMs: number = 100;

  /**
   * Start listening to gyroscope
   */
  subscribeToGyroscope(
    onTilt: (direction: 'left' | 'right' | 'up' | 'down') => void
  ): () => void {
    const { gyroscope } = RNSensors;

    this.gyroSubscription = gyroscope.subscribe(
      (event: { x: number; y: number; z: number }) => {
        const now = Date.now();
        if (now - this.lastAction < this.debounceMs) return;

        // Threshold for detecting tilt
        const threshold = 1.5;

        // x-axis = left/right tilt
        if (Math.abs(event.x) > threshold) {
          this.lastAction = now;
          onTilt(event.x > 0 ? 'right' : 'left');
          this.triggerHaptic('light');
        }

        // y-axis = up/down tilt
        if (Math.abs(event.y) > threshold) {
          this.lastAction = now;
          onTilt(event.y > 0 ? 'down' : 'up');
          this.triggerHaptic('light');
        }
      }
    );

    // Return unsubscribe function
    return () => this.gyroSubscription.unsubscribe();
  }

  /**
   * Trigger haptic feedback
   */
  async triggerHaptic(
    pattern: 'light' | 'medium' | 'heavy' | 'success'
  ): Promise<void> {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };

    const patterns: Record<string, number> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: 50,
    };

    HapticFeedback.trigger(
      patterns[pattern],
      options
    );
  }
}
```

### Task 4: Implement Device Control

**File**: `src/services/DeviceService.ts`

```typescript
import { AdapterFactory } from '../adapters/AdapterFactory';
import { IDeviceAdapter } from '../adapters/IDeviceAdapter';

export class DeviceService {
  private activeDevice: Device | null = null;
  private adapter: IDeviceAdapter | null = null;

  /**
   * Set active device and connect
   */
  async setActiveDevice(device: Device): Promise<void> {
    try {
      // Get appropriate adapter
      const adapter = AdapterFactory.getAdapterForDevice(device);
      if (!adapter) {
        throw new Error(`No adapter found for device type: ${device.type}`);
      }

      // Connect to device
      await adapter.connect(device);
      
      this.activeDevice = device;
      this.adapter = adapter;
    } catch (error) {
      console.error('Failed to set active device:', error);
      throw error;
    }
  }

  /**
   * Send command to active device
   */
  async sendCommand(commandId: string): Promise<void> {
    if (!this.adapter) {
      throw new Error('No device connected');
    }

    try {
      // Get command definition
      const commands = this.adapter.getAvailableCommands();
      const command = commands.find(c => c.id === commandId);
      
      if (!command) {
        throw new Error(`Unknown command: ${commandId}`);
      }

      // Send command
      await this.adapter.sendCommand(
        command.action,
        command.payload
      );
    } catch (error) {
      console.error('Command failed:', error);
      throw error;
    }
  }

  /**
   * Get device status
   */
  async getStatus(): Promise<DeviceStatus | null> {
    if (!this.adapter) return null;

    try {
      return await this.adapter.getStatus();
    } catch (error) {
      console.error('Failed to get status:', error);
      return null;
    }
  }

  /**
   * Get available commands
   */
  getAvailableCommands(): Command[] {
    return this.adapter?.getAvailableCommands() ?? [];
  }
}
```

---

## Testing Guidelines

### Unit Tests

```typescript
// src/__tests__/services/DeviceService.test.ts
import { DeviceService } from '../../services/DeviceService';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    service = new DeviceService();
  });

  describe('sendCommand', () => {
    it('should throw error when no device connected', async () => {
      await expect(service.sendCommand('power_on')).rejects.toThrow(
        'No device connected'
      );
    });

    it('should send command to connected device', async () => {
      const device = { id: 'test', type: 'soundbar' };
      await service.setActiveDevice(device);
      
      await service.sendCommand('power_on');
      // Assert command was sent
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test src/__tests__/services/DeviceService.test.ts

# Watch mode
npm test -- --watch
```

---

## Code Style & Best Practices

### TypeScript

✅ **DO**
```typescript
// Use proper typing
const handleCommand = (command: Command): void => {
  // ...
};

// Use interfaces
interface Device {
  id: string;
  name: string;
}

// Use type guards
if (device.type === 'soundbar') {
  // device is soundbar
}
```

❌ **DON'T**
```typescript
// Avoid any
const device: any = {};

// Avoid implicit returns
function getDevice() { return device }

// Avoid loose comparisons
if (device.type == 'soundbar') {}
```

### React Components

✅ **DO**
```typescript
// Functional component with hooks
const MyComponent = ({ prop }: Props) => {
  const [state, setState] = React.useState(false);
  
  React.useEffect(() => {
    // setup
    return () => { /* cleanup */ };
  }, [dependencies]);

  return <View>{/* JSX */}</View>;
};
```

❌ **DON'T**
```typescript
// Avoid class components (use hooks instead)
// Avoid inline functions in render
// Avoid mutating props
```

### Error Handling

✅ **DO**
```typescript
try {
  await deviceService.sendCommand(cmd);
} catch (error) {
  console.error('Command failed:', error);
  showErrorAlert('Failed to send command');
}
```

---

## Performance Tips

1. **Memoize Components**
   ```typescript
   export default React.memo(RemoteButton);
   ```

2. **Optimize List Rendering**
   ```typescript
   <FlatList
     data={devices}
     renderItem={({ item }) => <DeviceCard {...item} />}
     keyExtractor={item => item.id}
   />
   ```

3. **Debounce Sensor Events**
   ```typescript
   const debounce = (fn, delay) => {
     let timeout;
     return (...args) => {
       clearTimeout(timeout);
       timeout = setTimeout(() => fn(...args), delay);
     };
   };
   ```

---

## Useful Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check

# Build for production
npm run build:prod

# Clean build
npm run clean
```

---

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react)
- [Debugging Guide](https://reactnative.dev/docs/debugging)

---

## Getting Help

- 📖 Read the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 💬 Open a [Discussion](https://github.com/itsmeshibintmz/universal-remote-app/discussions)
- 🐛 Report a [Bug](https://github.com/itsmeshibintmz/universal-remote-app/issues)
