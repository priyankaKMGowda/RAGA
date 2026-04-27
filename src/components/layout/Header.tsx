import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logoutThunk } from '@/features/auth/authSlice';
import { markAllRead, markRead } from '@/features/notifications/notificationsSlice';
import { showNotification, requestNotificationPermission } from '@/services/notifications';
import Avatar from '@/components/common/Avatar';

interface Props {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const notifications = useAppSelector((s) => s.notifications.items);
  const permission = useAppSelector((s) => s.notifications.permission);
  const unread = notifications.filter((n) => !n.read).length;

  const [showPanel, setShowPanel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  async function handleEnableNotifications() {
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      await showNotification({
        title: 'Notifications enabled',
        body: 'You will receive real-time alerts about your patients.',
        level: 'success',
      });
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-6">
      <button
        type="button"
        className="lg:hidden -ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search patients, reports, doctors..."
            className="input pl-9"
          />
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1">
        {permission !== 'granted' && permission !== 'unsupported' && (
          <button
            type="button"
            onClick={handleEnableNotifications}
            className="hidden sm:inline-flex btn-secondary text-xs"
            title="Enable browser notifications"
          >
            Enable alerts
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPanel((v) => !v)}
            className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </button>

          {showPanel && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-100 bg-white shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-semibold text-sm">Notifications</span>
                <button
                  className="text-xs text-brand-600 hover:underline"
                  onClick={() => dispatch(markAllRead())}
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <li className="p-6 text-sm text-center text-slate-500">No notifications</li>
                )}
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => dispatch(markRead(n.id))}
                    className={`px-4 py-3 cursor-pointer border-b border-slate-50 hover:bg-slate-50 ${
                      !n.read ? 'bg-brand-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          n.level === 'critical'
                            ? 'bg-rose-500'
                            : n.level === 'warning'
                            ? 'bg-amber-500'
                            : n.level === 'success'
                            ? 'bg-emerald-500'
                            : 'bg-sky-500'
                        }`}
                      />
                      <p className="text-sm font-medium">{n.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.body}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{relativeTime(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu((v) => !v)}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-slate-100"
          >
            <Avatar name={user?.displayName ?? user?.email ?? 'U'} size={32} color="#0369A1" />
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium">{user?.displayName ?? 'User'}</span>
              <span className="text-[11px] text-slate-500 capitalize">{user?.role}</span>
            </span>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="text-sm font-medium">{user?.displayName}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
              <button
                onClick={() => dispatch(logoutThunk())}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
