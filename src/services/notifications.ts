/**
 * Service-worker registration & local notification helpers.
 *
 * The service worker (`/service-worker.js`) handles incoming push events
 * and "show notification" messages from the page. This module exposes a
 * thin TypeScript wrapper to:
 *   - register the SW
 *   - request notification permission
 *   - dispatch local notifications via the SW
 */

const SW_URL = '/service-worker.js';

let swRegistration: ServiceWorkerRegistration | null = null;

export function isSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'Notification' in window
  );
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isSupported()) return null;
  try {
    swRegistration = await navigator.serviceWorker.register(SW_URL, { scope: '/' });
    // wait until active
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
        // If already activated, resolve immediately on next tick
        setTimeout(resolve, 1500);
      });
    }
    return swRegistration;
  } catch (err) {
    console.warn('[SW] Registration failed:', err);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isSupported()) return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

interface ShowOptions {
  title: string;
  body: string;
  tag?: string;
  level?: 'info' | 'success' | 'warning' | 'critical';
  data?: Record<string, unknown>;
}

/**
 * Show a notification through the service worker (preferred) or fall back to
 * the page-level Notification API.
 */
export async function showNotification(opts: ShowOptions): Promise<boolean> {
  if (!isSupported()) return false;
  if (Notification.permission !== 'granted') {
    const result = await requestNotificationPermission();
    if (result !== 'granted') return false;
  }

  const reg = swRegistration ?? (await navigator.serviceWorker.getRegistration());
  const payload = {
    title: opts.title,
    options: {
      body: opts.body,
      tag: opts.tag ?? `medicore-${Date.now()}`,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { level: opts.level ?? 'info', ...(opts.data ?? {}) },
    },
  };

  if (reg && reg.active) {
    reg.active.postMessage({ type: 'SHOW_NOTIFICATION', payload });
    return true;
  }

  // Fallback: page-level notification
  new Notification(payload.title, payload.options);
  return true;
}
