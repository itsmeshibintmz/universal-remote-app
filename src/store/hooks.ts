/**
 * Redux Hooks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Device selectors
export const useDevices = () => useAppSelector((state) => state.devices.devices);
export const useActiveDevice = () => useAppSelector((state) => {
  if (!state.devices.activeDeviceId) return null;
  return state.devices.devices.find(d => d.id === state.devices.activeDeviceId) || null;
});
export const useActiveDeviceStatus = () => useAppSelector((state) => state.devices.activeDeviceStatus);
export const useDiscoveredDevices = () => useAppSelector((state) => state.devices.discoveredDevices);
export const useIsDiscovering = () => useAppSelector((state) => state.devices.isDiscovering);
export const useIsConnecting = () => useAppSelector((state) => state.devices.isConnecting);
export const useDeviceError = () => useAppSelector((state) => state.devices.error);

// Remote selectors
export const useRemoteProfiles = () => useAppSelector((state) => state.remote.profiles);
export const useActiveProfile = () => useAppSelector((state) => {
  if (!state.remote.activeProfileId) return null;
  return state.remote.profiles.find(p => p.id === state.remote.activeProfileId) || null;
});
export const useEditingMode = () => useAppSelector((state) => state.remote.editingMode);

// Settings selectors
export const useSettings = () => useAppSelector((state) => state.settings);
export const useHapticEnabled = () => useAppSelector((state) => state.settings.hapticEnabled);
export const useGyroEnabled = () => useAppSelector((state) => state.settings.gyroEnabled);
export const useTheme = () => useAppSelector((state) => state.settings.theme);
export const useGlassmorphism = () => useAppSelector((state) => state.settings.useGlassmorphism);
