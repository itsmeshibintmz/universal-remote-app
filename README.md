# 📱 Universal Remote App

A universal remote control application for smart home devices with haptic feedback, gyroscope-triggered controls, and modern UI design. Control your soundbar, smart TV, cable box, and other WiFi-connected devices from your iPhone.

**Built with React Native • Haptic Feedback • Gyroscope Controls • Device Profiles • Cloud Sync Ready**

---

## ✨ Features

- **🎛️ Multi-Device Control**: Control soundbar, smart TV, cable box, and other WiFi-connected devices
- **📳 Haptic Feedback**: Real haptic vibrations for tactile button feedback (iOS)
- **🔄 Gyroscope Controls**: Tilt your phone to trigger lighting effects and device actions
- **🎨 Beautiful UI**: Modern, intuitive interface with custom design and app icon
- **👤 Device Profiles**: Save multiple device profiles for different rooms
- **☁️ Cloud Sync Ready**: Backup and sync remotes across devices (future feature)
- **📡 WiFi/Network Based**: Control devices on the same WiFi network
- **⚡ Offline Support**: Access local network controls without internet (future feature)

---

## 🎯 Supported Devices

### Currently Targeting
- **Soundbars** (WiFi-enabled, e.g., Sonos, Bose)
- **Smart TVs** (WiFi-enabled, e.g., Samsung SmartTV, LG WebOS)
- **Cable Boxes** (Network-enabled with API)
- **Smart Lights** (Philips Hue, LIFX)
- **AV Receivers** (WiFi-enabled)

### Connection Methods
- **WiFi Network** (Primary - iPhone compatible) ✅
- **Bluetooth** (Secondary - device dependent)
- **REST APIs** (Smart home platforms: HomeKit, SmartThings, etc.)

> **Note**: iPhones do not have built-in IR (infrared) transmitters. We use WiFi and network APIs for device control instead.

---

## 📋 Technology Stack

- **Frontend**: React Native with TypeScript
- **Platform**: iOS (Primary), Android (Secondary)
- **State Management**: Redux/Context API
- **Sensors**: Gyroscope, Accelerometer (via React Native Sensors)
- **Haptics**: React Native Haptics
- **Networking**: Axios or Fetch API for device communication
- **Storage**: AsyncStorage for local device profiles
- **UI Framework**: React Native Paper or custom components

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Xcode (for iOS development) or Android Studio
- React Native CLI
- An iPhone or Android device for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/itsmeshibintmz/universal-remote-app.git
   cd universal-remote-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up React Native environment**
   Follow the official [React Native setup guide](https://reactnative.dev/docs/environment-setup)

4. **For iOS development**
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **Run the app**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

---

## 📁 Project Structure

```
universal-remote-app/
├── src/
│   ├── screens/              # App screens (Home, DeviceControl, Settings, etc.)
│   ├── components/           # Reusable UI components (RemoteButton, DeviceCard, etc.)
│   ├── services/             # Device communication services
│   │   ├── wifi-service.ts   # WiFi device discovery and control
│   │   ├── api-service.ts    # REST API calls to devices
│   │   └── sensor-service.ts # Gyroscope and haptic handling
│   ├── store/                # Redux/Context state management
│   ├── utils/                # Helper functions and constants
│   ├── types/                # TypeScript interfaces
│   └── App.tsx               # Root component
├── android/                  # Android native code
├── ios/                       # iOS native code
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────┐
│              Universal Remote App                    │
├─────────────────────────────────────────────────────┤
│  UI Layer (Screens & Components)                     │
│  - Home Screen (Device List)                         │
│  - Device Control Screen (Buttons & Gestures)        │
│  - Settings Screen (Profiles & Config)               │
├─────────────────────────────────────────────────────┤
│  Services Layer                                      │
│  - WiFi Service (Device Discovery, Control)          │
│  - API Service (REST calls to smart home platforms)  │
│  - Sensor Service (Gyroscope, Haptics)               │
├─────────────────────────────────────────────────────┤
│  State Management (Redux/Context)                    │
│  - Device State (list, active device, settings)      │
│  - Remote State (button mappings, profiles)          │
├─────────────────────────────────────────────────────┤
│  Device Communication Layer                          │
│  - WiFi Network Communication                        │
│  - REST API Calls                                    │
│  - Sensor Input Processing                           │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 Device Integration Guide

### Adding a New Device Type

#### Step 1: Define Device Interface
```typescript
// src/types/devices.ts
interface Device {
  id: string;
  name: string;
  type: 'soundbar' | 'tv' | 'cable_box' | 'lights';
  ip: string;
  port: number;
  apiKey?: string;
  config: Record<string, unknown>;
}
```

#### Step 2: Create Device Service
```typescript
// src/services/devices/{DeviceType}Service.ts
class SoundbarService {
  async discover(): Promise<Device[]> {}
  async sendCommand(device: Device, command: string): Promise<void> {}
  async getStatus(device: Device): Promise<Record<string, unknown>> {}
}
```

#### Step 3: Register in Service Factory
```typescript
// src/services/deviceFactory.ts
const createDeviceService = (type: string) => {
  switch(type) {
    case 'soundbar': return new SoundbarService();
    // ... other devices
  }
}
```

---

## 📡 WiFi Device Discovery

The app will:
1. **Scan the local WiFi network** for devices with known endpoints
2. **Query device APIs** for status and capabilities
3. **Store device profiles** locally with mDNS/Bonjour discovery

### Example: Sonos Soundbar Discovery
```
1. Scan 192.168.x.x/24 subnet
2. Check common ports: 1400 (Sonos UPnP), 80, 443
3. Query /api/v1/system/info endpoint
4. Parse device info and capabilities
5. Add to local device list
```

---

## 🎮 Control Methods

### Method 1: Button Interface
- **Volume Control**: Up/Down buttons
- **Playback Control**: Play, Pause, Next, Previous
- **Input Selection**: HDMI 1, HDMI 2, etc.
- **Power**: On/Off toggle

### Method 2: Gyroscope Gestures
- **Tilt Left**: Previous/Volume Down
- **Tilt Right**: Next/Volume Up
- **Tilt Up**: Brightness Up (for lights)
- **Tilt Down**: Brightness Down (for lights)
- **Rotation**: Menu navigation

### Method 3: Voice Commands (Future)
- Use Siri/Google Assistant integration
- Voice-controlled device commands

---

## ☁️ Cloud Sync & Offline Support (Future)

### Cloud Sync
- Backup device profiles to cloud
- Access remotes from multiple devices
- Sync custom button layouts

### Offline Support
- Cache device commands locally
- Queue commands when offline
- Sync when reconnected

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** with meaningful commits
4. **Test thoroughly** on iOS and Android
5. **Create a Pull Request** with description

### Code Guidelines

- Use **TypeScript** for all new code
- Follow **React Native best practices**
- Write **clear commit messages**
- Add **tests** for new features
- Update **documentation** as needed

### Areas to Contribute

- [ ] Additional device type support (Roku, Apple TV, etc.)
- [ ] Voice control integration
- [ ] Cloud sync implementation
- [ ] Offline command queueing
- [ ] Custom theme support
- [ ] Widget support (iOS 14+)
- [ ] Testing and bug fixes

---

## 📚 Documentation

- **[SETUP.md](./docs/SETUP.md)** - Detailed setup and configuration
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture details
- **[DEVICE_INTEGRATION.md](./docs/DEVICE_INTEGRATION.md)** - Guide for adding new devices
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** - API documentation

---

## 🐛 Troubleshooting

### App won't find devices
- ✅ Ensure your phone is on the same WiFi network as your devices
- ✅ Check that devices are powered on and WiFi-enabled
- ✅ Verify device firewall settings allow discovery

### Haptic feedback not working
- ✅ Ensure haptic feedback is enabled in iOS Settings
- ✅ Check app has necessary permissions
- ✅ Test on a physical device (simulator doesn't support haptics)

### Gyroscope controls not responding
- ✅ Ensure Motion & Fitness is enabled in iOS Settings
- ✅ Grant app permission to access motion data
- ✅ Recalibrate gyroscope in device settings

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

- 📖 Read the [documentation](./docs)
- 🐛 Report bugs via [GitHub Issues](https://github.com/itsmeshibintmz/universal-remote-app/issues)
- 💬 Start a [Discussion](https://github.com/itsmeshibintmz/universal-remote-app/discussions)

---

## 👥 Author

**Built by**: Shibin  
**Inspired by**: [Anthony's Universal Remote Demo](https://x.com/amfonte/status/2118834206470009063)

---

**Made with ❤️ for smart home enthusiasts**
