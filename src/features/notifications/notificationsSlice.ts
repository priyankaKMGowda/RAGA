import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  level: 'info' | 'success' | 'warning' | 'critical';
  createdAt: number;
  read: boolean;
}

interface NotificationsState {
  items: NotificationItem[];
  permission: NotificationPermission | 'unsupported';
}

const initialState: NotificationsState = {
  items: [
    {
      id: 'n-1',
      title: 'New patient admitted',
      body: 'Karthik Reddy (P-1048) has been admitted under Dr. Banerjee.',
      level: 'info',
      createdAt: Date.now() - 1000 * 60 * 8,
      read: false,
    },
    {
      id: 'n-2',
      title: 'Critical vitals',
      body: 'Rohan Verma (P-1044) — heart rate elevated. Review required.',
      level: 'critical',
      createdAt: Date.now() - 1000 * 60 * 22,
      read: false,
    },
    {
      id: 'n-3',
      title: 'Lab report ready',
      body: 'Blood panel results for Sneha Kapoor are available.',
      level: 'success',
      createdAt: Date.now() - 1000 * 60 * 45,
      read: true,
    },
  ],
  permission:
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported',
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification(state, action: PayloadAction<Omit<NotificationItem, 'id' | 'createdAt' | 'read'>>) {
      state.items.unshift({
        id: `n-${Date.now()}`,
        createdAt: Date.now(),
        read: false,
        ...action.payload,
      });
    },
    markAllRead(state) {
      state.items = state.items.map((n) => ({ ...n, read: true }));
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find((x) => x.id === action.payload);
      if (n) n.read = true;
    },
    setPermission(state, action: PayloadAction<NotificationPermission | 'unsupported'>) {
      state.permission = action.payload;
    },
    clearAll(state) {
      state.items = [];
    },
  },
});

export const { pushNotification, markAllRead, markRead, setPermission, clearAll } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
