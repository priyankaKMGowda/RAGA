import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setUser } from '@/features/auth/authSlice';
import { setPermission } from '@/features/notifications/notificationsSlice';
import { subscribeToAuth } from '@/features/auth/authService';
import { registerServiceWorker, isSupported } from '@/services/notifications';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  const dispatch = useAppDispatch();

  // Bootstrap: subscribe to auth state and register service worker.
  useEffect(() => {
    const unsub = subscribeToAuth((user) => dispatch(setUser(user)));

    if (isSupported()) {
      registerServiceWorker();
      dispatch(setPermission(Notification.permission));
    }

    return () => unsub();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
