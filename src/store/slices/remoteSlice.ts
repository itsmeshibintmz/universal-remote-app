/**
 * Redux Slice for Remote Profile State
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RemoteProfile, ButtonMapping } from '@types/devices';

interface RemoteState {
  profiles: RemoteProfile[];
  activeProfileId: string | null;
  editingMode: boolean;
}

const initialState: RemoteState = {
  profiles: [],
  activeProfileId: null,
  editingMode: false,
};

const remoteSlice = createSlice({
  name: 'remote',
  initialState,
  reducers: {
    addProfile: (state, action: PayloadAction<RemoteProfile>) => {
      state.profiles.push(action.payload);
      if (!state.activeProfileId) {
        state.activeProfileId = action.payload.id;
      }
    },
    removeProfile: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter(p => p.id !== action.payload);
      if (state.activeProfileId === action.payload) {
        state.activeProfileId = state.profiles[0]?.id || null;
      }
    },
    updateProfile: (state, action: PayloadAction<RemoteProfile>) => {
      const index = state.profiles.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
    },
    setActiveProfile: (state, action: PayloadAction<string>) => {
      state.activeProfileId = action.payload;
    },
    addButton: (state, action: PayloadAction<{ profileId: string; button: ButtonMapping }>) => {
      const profile = state.profiles.find(p => p.id === action.payload.profileId);
      if (profile) {
        profile.buttons.push(action.payload.button);
        profile.updatedAt = Date.now();
      }
    },
    removeButton: (state, action: PayloadAction<{ profileId: string; buttonId: string }>) => {
      const profile = state.profiles.find(p => p.id === action.payload.profileId);
      if (profile) {
        profile.buttons = profile.buttons.filter(b => b.id !== action.payload.buttonId);
        profile.updatedAt = Date.now();
      }
    },
    updateButton: (state, action: PayloadAction<{ profileId: string; button: ButtonMapping }>) => {
      const profile = state.profiles.find(p => p.id === action.payload.profileId);
      if (profile) {
        const buttonIndex = profile.buttons.findIndex(b => b.id === action.payload.button.id);
        if (buttonIndex !== -1) {
          profile.buttons[buttonIndex] = action.payload.button;
          profile.updatedAt = Date.now();
        }
      }
    },
    setEditingMode: (state, action: PayloadAction<boolean>) => {
      state.editingMode = action.payload;
    },
  },
});

export const {
  addProfile,
  removeProfile,
  updateProfile,
  setActiveProfile,
  addButton,
  removeButton,
  updateButton,
  setEditingMode,
} = remoteSlice.actions;

export default remoteSlice.reducer;
