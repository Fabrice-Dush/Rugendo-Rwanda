import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const RWANDA_PHONE_RE = /^07(2|3|8|9)\d{7}$/;

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
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
      text:  'signup_with',
    });
  }, []);

  const handleGoogleResponse = async ({ credential }) => {
    setError('');
    setLoading(true);
    try {
      const data = await loginWithGoogle(credential);
      // Google-registered passengers land on their dashboard
      const roleRoutes = { passenger: '/passenger', admin: '/admin', super_admin: '/super-admin', operator: '/operator' };
      navigate(roleRoutes[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Email / phone registration ────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!RWANDA_PHONE_RE.test(form.phone)) {
      setError('Phone must be a valid Rwanda number (e.g. 0781234567 — starts with 072, 073, 078, or 079).');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create account</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-7">
        Book intercity buses across Rwanda. Free to join.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Google sign-up button — rendered by GSI SDK */}
      <div ref={googleBtnRef} className="mb-4 flex justify-center" />

      <div className="relative my-5 flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-slate-700" />
        <span className="mx-3 text-xs text-gray-400 dark:text-slate-500 shrink-0">or register with email</span>
        <div className="flex-grow border-t border-gray-200 dark:border-slate-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Jean-Pierre Nkurunziza"
            className="input"
          />
        </div>
        <div>
          <label className="label">Email address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="input"
          />
        </div>
        <div>
          <label className="label">Phone number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            placeholder="0781234567"
            className="input"
          />
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            Rwanda numbers only: 072, 073, 078, or 079 followed by 7 digits.
          </p>
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            className="input"
          />
        </div>
        <div>
          <label className="label">Confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="input"
          />
        </div>

        <p className="text-xs text-gray-400 dark:text-slate-500">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</Link>.
        </p>

        <button type="submit" disabled={loading} className="btn-gradient w-full mt-1">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-gray-500 dark:text-slate-400 mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
