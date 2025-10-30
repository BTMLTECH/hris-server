import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./slices/auth/authSlice";
import leaveReducer from "./slices/leave/leaveSlice";
import attendanceReducer from "./slices/attendance/attendanceSlice";
import profileReducer from "./slices/profile/profileSlice";
import handoverReducer from "./slices/handover/handoverSlice";
import { baseApi } from "./slices/baseApi";
import appraisalReducer from "./slices/appraisal/appraisalSlice";
import payrollReducer from "./slices/payroll/payrollSlice";
import notificationReducer from "./slices/notification/notificationSlice";
import reportReducer from "./slices/report/reportSlice";
import classlevelReducer from "./slices/class/classSlice";
import trainingReducer from "./slices/training/trainingSlice";
import cooperativeReducer from "./slices/cooperative/cooperativeSlice";

// 1. Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  attendance: attendanceReducer,
  leave: leaveReducer,
  handover: handoverReducer,
  appraisal: appraisalReducer,
  payroll: payrollReducer,
  notification: notificationReducer,
  report: reportReducer,
  classlevel: classlevelReducer,
  training: trainingReducer,
  cooperative: cooperativeReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>;

// 2. Create persisted reducer with type
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
  // whitelist: ['auth', 'leave', 'handover','attendance','payroll', 'notification', 'report', 'classlevel', 'training'],
};

const persistedReducer = persistReducer<RootReducerType>(
  persistConfig,
  rootReducer
);

// 3. Configure store with safe middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         ignoredPaths: [
          "report.selectedDate", 
        ],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
