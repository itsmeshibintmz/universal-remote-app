/**
 * Redux Slice for Device State Management
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { DeviceConfig, DeviceStatus, DiscoveredDevice } from '@types/devices';

interface DeviceState {
  devices: DeviceConfig[];
  discoveredDevices: DiscoveredDevice[];
  activeDeviceId: string | null;
  activeDeviceStatus: DeviceStatus | null;
  isDiscovering: boolean;
  isConnecting: boolean;
  error: string | null;
  lastSync: number;
}

const initialState: DeviceState = {
  devices: [],
  discoveredDevices: [],
  activeDeviceId: null,
  activeDeviceStatus: null,
  isDiscovering: false,
  isConnecting: false,
  error: null,
  lastSync: 0,
};

// Async Thunks
export const discoverDevices = createAsyncThunk(
  'devices/discover',
  async (_, { rejectWithValue }) => {
    try {
      // This will be implemented in WiFiService
      // For now, return empty array
      return [] as DiscoveredDevice[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const connectToDevice = createAsyncThunk(
  'devices/connect',
  async (deviceConfig: DeviceConfig, { rejectWithValue }) => {
    try {
      // This will be implemented in DeviceService
      return deviceConfig;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDeviceStatus = createAsyncThunk(
  'devices/getStatus',
  async (deviceId: string, { rejectWithValue }) => {
    try {
      // This will be implemented in DeviceService
      return {
        id: deviceId,
        power: 'on' as const,
        isConnected: true,
        lastUpdated: Date.now(),
      } as DeviceStatus;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    setActiveDevice: (state, action: PayloadAction<string>) => {
      state.activeDeviceId = action.payload;
    },
    addDevice: (state, action: PayloadAction<DeviceConfig>) => {
      const exists = state.devices.find(d => d.id === action.payload.id);
      if (!exists) {
        state.devices.push(action.payload);
      }
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter(d => d.id !== action.payload);
      if (state.activeDeviceId === action.payload) {
        state.activeDeviceId = null;
      }
    },
    updateDevice: (state, action: PayloadAction<DeviceConfig>) => {
      const index = state.devices.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.devices[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Discover Devices
    builder
      .addCase(discoverDevices.pending, (state) => {
        state.isDiscovering = true;
        state.error = null;
      })
      .addCase(discoverDevices.fulfilled, (state, action) => {
        state.isDiscovering = false;
        state.discoveredDevices = action.payload;
        state.lastSync = Date.now();
      })
      .addCase(discoverDevices.rejected, (state, action) => {
        state.isDiscovering = false;
        state.error = action.payload as string;
      });

    // Connect to Device
    builder
      .addCase(connectToDevice.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(connectToDevice.fulfilled, (state, action) => {
        state.isConnecting = false;
        state.activeDeviceId = action.payload.id;
        const exists = state.devices.find(d => d.id === action.payload.id);
        if (!exists) {
          state.devices.push(action.payload);
        }
      })
      .addCase(connectToDevice.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.payload as string;
      });

    // Get Device Status
    builder
      .addCase(getDeviceStatus.fulfilled, (state, action) => {
        state.activeDeviceStatus = action.payload;
      })
      .addCase(getDeviceStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setActiveDevice, addDevice, removeDevice, updateDevice } =
  deviceSlice.actions;

export default deviceSlice.reducer;
