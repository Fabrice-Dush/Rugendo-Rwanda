import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService.js';

function formatTime(isoString) {
  if (!isoString) return '--:--';
  return new Date(isoString).toLocaleTimeString('en-RW', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-RW', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function StatusBadge({ status }) {
  const variants = {
    CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    PENDING:   'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    COMPLETED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  };
  const cls = variants[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-slate-400';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

function BookingCard({ booking, onRefresh }) {
  const navigate = useNavigate();
  const sch   = booking.schedule;
  const route = sch?.route;

  const [actionLoading, setActionLoading] = useState(null); // 'pay' | 'cancel'
  const [actionError,   setActionError]   = useState(null);

  // A booking is actionable (can retry or cancel) only when PENDING
  const isPending   = booking.status === 'PENDING';
  const payFailed   = booking.payment?.status === 'FAILED';

  async function handleRetryPayment() {
    setActionError(null);
    setActionLoading('pay');
    try {
      const res = await bookingService.payBooking({ bookingId: booking.id, method: 'simulated' });
      navigate('/passenger/booking-confirm', {
        state: { booking: res.data.booking, payment: res.data.payment },
      });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Payment could not be processed. Please try again.';
      setActionError(msg);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel() {
    setActionError(null);
    setActionLoading('cancel');
    try {
      await bookingService.cancelBooking(booking.id);
      onRefresh();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not cancel booking. Please try again.';
      setActionError(msg);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Booking reference</p>
          <p className="font-bold tracking-widest text-brand-700 dark:text-brand-300 text-sm">
            {booking.reference}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {sch && route && (
        <div className="flex items-center gap-3 mb-3">
          <div className="text-center min-w-[60px]">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(sch.departureTime)}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{route.origin}</p>
          </div>
          <div className="flex-1 h-px bg-[#e8e3ff] dark:bg-[#2d1a5e] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500" />
          </div>
          <div className="text-center min-w-[60px]">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(sch.arrivalTime)}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{route.destination}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
        <span>{sch ? formatDate(sch.departureTime) : formatDate(booking.createdAt)}</span>
        <span>{booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''} · RWF {parseFloat(booking.totalAmount).toLocaleString()}</span>
      </div>

      {payFailed && (
        <div className="mt-3 pt-3 border-t border-[#f0ebff] dark:border-[#2d1a5e] text-xs text-red-600 dark:text-red-400">
          Payment failed — booking is still pending.
        </div>
      )}

      {/* Action error */}
      {actionError && (
        <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          {actionError}
        </div>
      )}

      {/* Booking actions — only for PENDING bookings */}
      {isPending && (
        <div className="mt-4 pt-3 border-t border-[#f0ebff] dark:border-[#2d1a5e] flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRetryPayment}
            disabled={!!actionLoading}
            className="btn-gradient text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            {actionLoading === 'pay' && (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {actionLoading === 'pay' ? 'Processing…' : (payFailed ? 'Retry Payment' : 'Pay Now')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={!!actionLoading}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {actionLoading === 'cancel' && (
              <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            )}
            {actionLoading === 'cancel' ? 'Cancelling…' : 'Cancel Booking'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    bookingService.getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch(() => setError('Could not load bookings. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const now      = new Date();
  const upcoming = bookings.filter((b) => {
    const dep = b.schedule?.departureTime ? new Date(b.schedule.departureTime) : null;
    return (b.status === 'CONFIRMED' || b.status === 'PENDING') && dep && dep >= now;
  });
  const past = bookings.filter((b) => {
    const dep = b.schedule?.departureTime ? new Date(b.schedule.departureTime) : null;
    return b.status === 'COMPLETED' || (dep && dep < now);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-slate-400">Loading your bookings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-500 dark:text-slate-400 mb-4">{error}</p>
        <button
          type="button"
          onClick={load}
          className="btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
        <Link to="/" className="btn-gradient text-sm px-4 py-2">
          + Book a trip
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎟️</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookings yet</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">
            When you book a trip, it will appear here.
          </p>
          <Link to="/" className="btn-gradient">Search trips</Link>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Upcoming ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-gray-400 dark:text-slate-500 text-sm py-4">No upcoming trips.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {upcoming.map((b) => <BookingCard key={b.id} booking={b} onRefresh={load} />)}
              </div>
            )}
          </section>

          {/* Past / Completed */}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                Past trips ({past.length})
              </h2>
              <div className="flex flex-col gap-3">
                {past.map((b) => <BookingCard key={b.id} booking={b} onRefresh={load} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
