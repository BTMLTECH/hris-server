
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from './slices/auth/authSlice';
import leaveReducer from './slices/leave/leaveSlice';
import attendanceReducer from './slices/attendance/attendanceSlice'
import profileReducer from './slices/profile/profileSlice'
import handoverReducer from './slices/handover/handoverSlice'
import { baseApi } from './slices/baseApi';

// 1. Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  attendance: attendanceReducer,
  leave: leaveReducer,
  handover: handoverReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>; 

// 2. Create persisted reducer with type
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'leave', 'handover'],
};

const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

// 3. Configure store with safe middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
