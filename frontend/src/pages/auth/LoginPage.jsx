import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ROLE_ROUTES = {
  passenger:  '/',
  admin:      '/admin',
  super_admin:'/super-admin',
  operator:   '/operator',
};

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ identifier: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const googleBtnRef = useRef(null);

  // ── Google Identity Services setup ───────────────────────────────────────
  useEffect(() => {
    if (!window.google || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback:  handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size:  'large',
      width: '100%',
      text:  'signin_with',
    });
  }, []);

  const handleGoogleResponse = async ({ credential }) => {
    setError('');
    setLoading(true);
    try {
      const data = await loginWithGoogle(credential);
      navigate(ROLE_ROUTES[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Email / phone login ───────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      navigate(ROLE_ROUTES[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Sign in</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-7">
        Welcome back. Enter your details to continue.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Google sign-in button — rendered by GSI SDK */}
      <div ref={googleBtnRef} className="mb-4 flex justify-center" />

      <div className="relative my-5 flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-slate-700" />
        <span className="mx-3 text-xs text-gray-400 dark:text-slate-500 shrink-0">or sign in with email / phone</span>
        <div className="flex-grow border-t border-gray-200 dark:border-slate-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email address or phone number</label>
          <input
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="you@example.com or 0781234567"
            className="input"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-gradient w-full mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-gray-500 dark:text-slate-400 mt-6 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
