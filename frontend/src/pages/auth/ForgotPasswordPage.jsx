import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Reset your password</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-7">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {sent ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-4">📧</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Check your inbox</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your spam folder if you don't see it.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-gradient w-full">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="text-sm text-center mt-6">
        <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline">← Back to sign in</Link>
      </p>
    </div>
  );
}
