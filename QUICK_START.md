# ⚡ Quick Start Guide

## 🚀 In 5 Minutes

### 1. Verify Installation (1 min)
```bash
cd /Users/shibin_tmz/Desktop/Side\ Projects/universal-remote-app
npm list --depth=0
```

### 2. Start Development Server (1 min)
```bash
npm start
```
You should see: `Expo server started at http://localhost:8081`

### 3. Run on iOS (2 min)
In another terminal:
```bash
npm run ios
```
Expo will start the iOS simulator and load your app.

### 4. Test Discovery (1 min)
1. Make sure your iPhone/simulator is on WiFi
2. In the app, tap "Discover Devices"
3. Watch it scan your network
4. Your Xiaomi TV should appear!

---

## 📱 Your First Device Control

### Connect to Your Xiaomi TV

1. **Ensure Setup**
   - TV is powered on and on WiFi
   - Phone on same WiFi network
   - TV has IP address (e.g., 192.168.1.50)

2. **Discover**
   ```
   App Home Screen
   → Tap "Discover Devices"
   → Wait for scan (shows progress)
   ```

3. **Connect**
   ```
   Device appears in list
   → Tap "Control"
   → TV remote interface loads
   ```

4. **Control**
   ```
   Tap any button to control TV:
   - Power On/Off
   - Volume Up/Down
   - Change Channels
   - Navigate Menu
   ```

5. **Feel the Magic**
   ```
   - Haptic feedback on button press
   - Visual feedback
   - TV responds instantly
   ```

---

## 🛠️ Development Commands

```bash
# Start dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Type checking
npm run type-check

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Linting (when configured)
npm run lint
```

---

## 🐛 Troubleshooting

### App won't find devices
- ✅ Check WiFi: Phone on same network as TV
- ✅ Check TV: TV is on and WiFi-enabled
- ✅ Check IP: TV has IP address on network
- ✅ Check Firewall: TV allows incoming connections

### Haptic feedback not working
- ✅ iOS: Settings → Sounds & Haptics → Haptic Feedback ON
- ✅ Physical device: Simulator doesn't support haptics
- ✅ App settings: HomeScreen → Toggle haptics

### Gyroscope controls not responding
- ✅ iOS: Settings → Privacy → Motion & Fitness → App Permission ON
- ✅ Calibration: Device settings → Calibrate accelerometer
- ✅ Physical device only: Simulator doesn't have sensors

---

## 📖 Next Steps

### Want to Add a New Device?
→ Read `docs/DEVICE_INTEGRATION.md`

### Want to Understand Architecture?
→ Read `docs/ARCHITECTURE.md`

### Want Code Examples?
→ Read `docs/DEVELOPER_GUIDE.md`

### Want to Contribute?
→ Read `CONTRIBUTING.md`

---

## 💾 File Locations

```
Code: /Users/shibin_tmz/Desktop/Side\ Projects/universal-remote-app/src
Docs: /Users/shibin_tmz/Desktop/Side\ Projects/universal-remote-app/docs
GitHub: https://github.com/itsmeshibintmz/universal-remote-app
```

---

## 🎯 Success Checklist

- [ ] `npm list` shows all packages installed
- [ ] `npm start` runs without errors
- [ ] `npm run ios` opens simulator
- [ ] App loads with "Discover Devices" button
- [ ] Discovery finds your TV
- [ ] Can tap "Control" without errors
- [ ] Volume buttons work on TV
- [ ] Haptic feedback works
- [ ] Device status updates

---

**That's it! You're ready to build! 🎉**

Check out the docs folder for detailed guides on everything else.
