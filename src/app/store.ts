import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import patientsReducer from '@/features/patients/patientsSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    notifications: notificationsReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
