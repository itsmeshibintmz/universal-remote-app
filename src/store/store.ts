/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './slices/deviceSlice';
import remoteReducer from './slices/remoteSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    devices: deviceReducer,
    remote: remoteReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['devices/connect/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
