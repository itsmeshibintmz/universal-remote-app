# 📋 Setup & Installation Guide

## Complete Setup Instructions

### 1. Environment Requirements

Before you start, ensure you have:

- **Node.js**: Version 16 or higher
  ```bash
  node --version  # Check version
  ```

- **npm or Yarn**: Package managers
  ```bash
  npm --version
  # or
  yarn --version
  ```

- **Xcode** (for iOS development):
  - Download from Mac App Store
  - Install via: `xcode-select --install`

- **CocoaPods** (for iOS dependencies):
  ```bash
  sudo gem install cocoapods
  ```

- **Watchman** (optional, but recommended for faster builds):
  ```bash
  brew install watchman
  ```

---

### 2. Project Setup

#### Clone the Repository
```bash
git clone https://github.com/itsmeshibintmz/universal-remote-app.git
cd universal-remote-app
```

#### Install Dependencies
```bash
npm install
# or
yarn install
```

#### iOS Setup (Required for iPhone)
```bash
cd ios
pod install
cd ..
```

---

### 3. Running the App

#### On iOS Simulator
```bash
npm run ios
```

#### On iOS Device
1. Connect your iPhone via USB or use wireless pairing
2. Select your device in Xcode
3. Run: `npm run ios -- --device`

#### On Android Emulator
```bash
npm run android
```

---

### 4. Initial Configuration

#### WiFi Network Setup
- Ensure your development device is on the **same WiFi network** as your smart devices
- Devices should be:
  - ✅ Powered on
  - ✅ Connected to WiFi
  - ✅ Accessible on the local network

#### Permissions
The app requires these iOS permissions:
- **Network**: Local network access
- **Motion**: Gyroscope access
- **Bluetooth** (optional): For Bluetooth devices

Grant permissions when prompted by the app.

---

### 5. Development Tips

#### Hot Reload
The app supports hot reload during development. Save changes to see them instantly.

#### Debug Menu
Press `Cmd + D` (iOS) to open the debug menu:
- Enable Hot Reload
- Enable Remote Debugging
- View performance metrics

#### Debugging
```bash
# Open React Native debugger
npm run debug
```

---

### 6. Building for Production

#### iOS Build
```bash
# Debug build
npm run build:ios

# Production build
npm run build:ios:prod
```

#### Android Build
```bash
# APK
npm run build:android

# AAB (for Play Store)
npm run build:android:aab
```

---

### 7. Troubleshooting Setup Issues

#### Issue: Pod install fails
```bash
# Clean and retry
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### Issue: Node modules are corrupted
```bash
# Clean and reinstall
rm -rf node_modules
npm install
```

#### Issue: Xcode build errors
```bash
# Clean build
npm run ios -- --reset-cache
```

#### Issue: Port already in use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
npm run ios
```

---

### 8. Next Steps

Once setup is complete:
1. Read the [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the project structure
2. Check [DEVICE_INTEGRATION.md](./DEVICE_INTEGRATION.md) to add device support
3. Review code examples in the `/docs/examples` folder

---

### 📞 Need Help?

- Check the main [README.md](../README.md) for FAQ
- Open an [Issue](https://github.com/itsmeshibintmz/universal-remote-app/issues)
- Start a [Discussion](https://github.com/itsmeshibintmz/universal-remote-app/discussions)
