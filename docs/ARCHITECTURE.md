# 🏗️ Architecture Documentation

## System Architecture

### Overview

The Universal Remote App follows a **layered architecture** pattern optimized for cross-platform mobile development with React Native.

```
┌────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  Screens (Home, Control, Settings)                          │
│  UI Components (Buttons, Cards, Gestures)                   │
│  Theme & Styling                                            │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                   State Management Layer                    │
│  Redux Store / Context API                                  │
│  Actions, Reducers, Selectors                               │
│  Device & Remote State                                      │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                     Services Layer                          │
│  Device Communication Service                               │
│  WiFi Discovery & Control                                   │
│  Sensor Management (Gyro, Haptics)                          │
│  Storage Service (AsyncStorage)                             │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                   Device Integration Layer                  │
│  WiFi/Network Communication                                 │
│  REST API Calls                                             │
│  Device-Specific Adapters                                   │
└────────────────────────────────────────────────────────────┘
```

---

## Layer Details

### 1. Presentation Layer

**Responsibility**: Render UI and handle user interactions

```typescript
src/
├── screens/
│   ├── HomeScreen.tsx        // Device list & discovery
│   ├── ControlScreen.tsx      // Remote control interface
│   ├── DeviceSetup.tsx        // Device pairing/setup
│   └── SettingsScreen.tsx     // App configuration
├── components/
│   ├── RemoteButton.tsx       // Single remote button
│   ├── DeviceCard.tsx         // Device display card
│   ├── Gyroscope.tsx          // Gesture handler
│   └── HapticFeedback.tsx     // Vibration component
└── theme/
    ├── colors.ts
    ├── typography.ts
    └── spacing.ts
```

**Key Components**:
- **HomeScreen**: Lists available devices, enables discovery
- **ControlScreen**: Main interface for device control
- **RemoteButton**: Reusable button component with haptic feedback
- **Gyroscope Component**: Detects and handles device tilt/rotation

---

### 2. State Management Layer

**Responsibility**: Centralize application state and state mutations

**Using Redux** (Recommended for larger scale):

```typescript
src/store/
├── slices/
│   ├── deviceSlice.ts         // Device state (list, active, status)
│   ├── remoteSlice.ts         // Remote config (profiles, buttons)
│   └── settingsSlice.ts       // App settings
├── actions/
│   ├── deviceActions.ts       // Async actions for device ops
│   └── remoteActions.ts       // Remote-related actions
├── selectors/
│   ├── deviceSelectors.ts     // Derived state queries
│   └── remoteSelectors.ts
└── store.ts                   // Store configuration
```

**Or using Context API** (Simpler alternative):

```typescript
src/context/
├── DeviceContext.tsx          // Device state provider
├── RemoteContext.tsx          // Remote state provider
└── SettingsContext.tsx        // Settings provider
```

**State Structure**:

```typescript
interface AppState {
  devices: {
    list: Device[];
    activeDeviceId: string | null;
    isDiscovering: boolean;
    error: string | null;
  };
  remote: {
    profiles: RemoteProfile[];
    activeProfileId: string | null;
    buttonMappings: ButtonMapping[];
  };
  settings: {
    vibrationEnabled: boolean;
    gyroEnabled: boolean;
    theme: 'light' | 'dark';
  };
}
```

---

### 3. Services Layer

**Responsibility**: Encapsulate business logic and device communication

```typescript
src/services/
├── DeviceService.ts           // Main device service interface
├── WiFiDiscoveryService.ts    // WiFi network scanning
├── DeviceControlService.ts    // Send commands to devices
├── SensorService.ts           // Gyroscope & accelerometer
├── HapticService.ts           // Haptic feedback
└── StorageService.ts          // Local data persistence
```

#### 3.1 Device Service

```typescript
class DeviceService {
  // Discover devices on WiFi network
  async discoverDevices(): Promise<Device[]>
  
  // Get device status
  async getDeviceStatus(deviceId: string): Promise<DeviceStatus>
  
  // Send command to device
  async sendCommand(deviceId: string, command: Command): Promise<void>
  
  // Get available commands for device
  async getAvailableCommands(deviceId: string): Promise<Command[]>
}
```

#### 3.2 WiFi Discovery Service

```typescript
class WiFiDiscoveryService {
  // Scan network for devices
  async scanNetwork(): Promise<DiscoveredDevice[]>
  
  // Check if device is reachable
  async ping(ipAddress: string): Promise<boolean>
  
  // Get device info via mDNS
  async discoverViaMDNS(): Promise<DiscoveredDevice[]>
}
```

#### 3.3 Sensor Service

```typescript
class SensorService {
  // Subscribe to gyroscope updates
  subscribeToGyroscope(callback: (data: GyroData) => void): Unsubscribe
  
  // Trigger haptic feedback
  triggerHaptic(pattern: HapticPattern): void
}
```

---

### 4. Device Integration Layer

**Responsibility**: Device-specific implementations

```typescript
src/adapters/
├── devices/
│   ├── BaseSonosAdapter.ts    // Sonos soundbar
│   ├── BaseLGTVAdapter.ts     // LG SmartTV
│   ├── BasePhilipsHueAdapter.ts // Philips Hue lights
│   └── BaseGenericHTTPAdapter.ts // Generic HTTP devices
└── protocols/
    ├── UPnPProtocol.ts        // UPnP/DLNA
    ├── RESTProtocol.ts        // REST API
    └── BluetoothProtocol.ts   // Bluetooth
```

#### Device Adapter Pattern

```typescript
interface IDeviceAdapter {
  // Identify if this adapter supports the device
  canHandle(device: DiscoveredDevice): boolean
  
  // Connect to device
  connect(config: DeviceConfig): Promise<void>
  
  // Send command
  sendCommand(command: string): Promise<void>
  
  // Get available commands
  getAvailableCommands(): Command[]
  
  // Get current status
  getStatus(): Promise<DeviceStatus>
}
```

---

## Data Flow

### Device Discovery Flow

```
User taps "Discover Devices"
         ↓
HomeScreen dispatches discoverDevices action
         ↓
WiFiDiscoveryService.scanNetwork()
    ├─ Scan local network (192.168.x.x/24)
    ├─ Check known ports (1400, 80, 443, etc.)
    ├─ Query device endpoints (/api/info)
    └─ Return DiscoveredDevice[]
         ↓
Match discovered devices with adapters
         ↓
Create Device objects & store in Redux
         ↓
Update HomeScreen UI with device list
```

### Control Flow

```
User taps RemoteButton ("Volume Up")
         ↓
RemoteButton component:
    ├─ Trigger haptic feedback (SensorService)
    └─ Dispatch sendCommand action
         ↓
DeviceControlService.sendCommand()
    ├─ Get device adapter for active device
    ├─ Format command for device
    ├─ Send via REST/UPnP/Bluetooth
    └─ Update device status
         ↓
Redux state updates
         ↓
ControlScreen re-renders with feedback
```

### Gyroscope Flow

```
User tilts device
         ↓
SensorService detects gyro event
         ↓
Calculate tilt angle & direction
         ↓
Map to action (Volume Up/Down, Brightness, etc.)
         ↓
Send command same as button press
         ↓
Haptic feedback triggers
         ↓
Visual feedback on screen
```

---

## Key Interfaces & Types

```typescript
// Device type definition
interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ip: string;
  port: number;
  apiKey?: string;
  lastSeen: Date;
  config: Record<string, unknown>;
}

// Command interface
interface Command {
  id: string;
  name: string;
  action: string;
  payload?: Record<string, unknown>;
}

// Gyroscope data
interface GyroData {
  x: number;  // Tilt left/right
  y: number;  // Tilt up/down
  z: number;  // Rotation
  timestamp: number;
}

// Device status
interface DeviceStatus {
  power: 'on' | 'off';
  volume?: number;
  input?: string;
  [key: string]: unknown;
}

// Remote profile
interface RemoteProfile {
  id: string;
  name: string;
  deviceId: string;
  buttons: ButtonMapping[];
}

// Button mapping
interface ButtonMapping {
  id: string;
  label: string;
  command: Command;
  position: { row: number; col: number };
}
```

---

## Communication Protocols

### 1. WiFi/REST API

For devices with REST endpoints:

```
POST /api/devices/send-command
{
  "device_id": "sonos-living-room",
  "command": "volume_up",
  "value": 5
}
```

### 2. UPnP/DLNA

For UPnP-enabled devices (Sonos, etc.):

```
UPNP Control Point
    └─ M-SEARCH device discovery
    └─ SOAP action invocation
```

### 3. Bluetooth

For Bluetooth-enabled devices:

```
BLE Central (app)
    └─ Connect to device
    └─ Write to characteristic
    └─ Read status
```

---

## Performance Considerations

1. **Device Discovery**: Cache results, update periodically (5-10 min)
2. **State Management**: Use selectors to prevent unnecessary re-renders
3. **Network Calls**: Implement timeout & retry logic
4. **Sensor Data**: Debounce gyroscope events (50-100ms)
5. **UI Updates**: Batch updates for smooth animations

---

## Security

- ✅ Local network only (no cloud transmission of commands)
- ✅ Validate all device responses
- ✅ Timeout commands after 10 seconds
- ✅ Implement rate limiting for device control
- ✅ Secure storage of device credentials (Keychain)

---

## Extension Points

The architecture allows easy extension:

1. **Add new device type**: Implement `IDeviceAdapter`
2. **Add new communication protocol**: Extend `ProtocolBase`
3. **Add new sensors**: Register in `SensorService`
4. **Add new state**: Add Redux slice or Context
5. **Add new UI components**: Create in `/screens` or `/components`
