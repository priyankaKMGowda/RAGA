import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loginThunk, clearError } from '@/features/auth/authSlice';
import { firebaseEnabled } from '@/services/firebase';
import { demoCredentials } from '@/features/auth/authService';
import Spinner from '@/components/common/Spinner';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, user } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState(firebaseEnabled ? '' : demoCredentials.email);
  const [password, setPassword] = useState(firebaseEnabled ? '' : demoCredentials.password);
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect when authenticated
  useEffect(() => {
    if (user) {
      const dest = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate, location.state]);

  const emailError =
    touched && !/^\S+@\S+\.\S+$/.test(email) ? 'Please enter a valid email.' : '';
  const passwordError =
    touched && password.length < 6 ? 'Password must be at least 6 characters.' : '';
  const formValid = !emailError && !passwordError && email && password;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!formValid) return;
    dispatch(clearError());
    dispatch(loginThunk({ email, password }));
  }

  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center font-bold text-xl">
              M
            </div>
            <span className="font-semibold text-lg">MediCore</span>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Healthcare,<br />intelligently connected.
          </h1>
          <p className="mt-4 text-brand-50/90">
            Manage patients, monitor analytics, and stay alerted in real-time —
            all from a single, secure dashboard.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              'HIPAA-aligned design patterns',
              'Real-time push notifications',
              'Unified patient records',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckIcon /> {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-brand-100/70">
          © {new Date().getFullYear()} MediCore Health Systems
        </p>

        {/* Decorative shapes */}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="absolute top-10 right-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-semibold text-lg">MediCore</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your healthcare dashboard.
          </p>

          {!firebaseEnabled && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              <strong>Demo mode:</strong> Firebase isn't configured. Use{' '}
              <code className="font-mono">{demoCredentials.email}</code> /{' '}
              <code className="font-mono">{demoCredentials.password}</code>.
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className={`input mt-1 ${emailError ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500' : ''}`}
                placeholder="you@hospital.com"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-err' : undefined}
              />
              {emailError && (
                <p id="email-err" className="mt-1 text-xs text-rose-600">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={`input pr-10 ${passwordError ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500' : ''}`}
                  placeholder="••••••••"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'pwd-err' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {passwordError && (
                <p id="pwd-err" className="mt-1 text-xs text-rose-600">{passwordError}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? (
                <>
                  <Spinner /> Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              By continuing you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
