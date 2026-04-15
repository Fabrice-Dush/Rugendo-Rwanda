import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Reset token is missing. Please use the link from your email.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword({ token, password: form.password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid reset link</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
          This link is invalid or has expired. Request a new one below.
        </p>
        <Link to="/forgot-password" className="btn-gradient">Request new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password updated</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
          Your password has been reset. You can now sign in with your new password.
        </p>
        <Link to="/login" className="btn-gradient">Sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Set a new password</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-7">
        Choose a strong password for your Rugendo Rwanda account.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">New password</label>
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
          <label className="label">Confirm new password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Repeat your new password"
            className="input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-gradient w-full">
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
