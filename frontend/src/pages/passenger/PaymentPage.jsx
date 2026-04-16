import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [paying,      setPaying]     = useState(false);
  const [payError,    setPayError]   = useState(null);

  // Guard: if navigated here without state (e.g. direct URL), send back
  if (!state?.booking) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No booking found</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6">
          Start by searching for a trip.
        </p>
        <Link to="/" className="btn-gradient">Search trips</Link>
      </div>
    );
  }

  const { booking, schedule } = state;
  const amount = parseFloat(booking.totalAmount);

  async function handlePay(method = 'simulated') {
    setPayError(null);
    setPaying(true);
    try {
      const res = await bookingService.payBooking({ bookingId: booking.id, method });
      navigate('/passenger/booking-confirm', {
        state: { booking: res.data.booking, payment: res.data.payment },
        replace: true,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Payment could not be processed. Please try again.';
      setPayError(msg);
    } finally {
      setPaying(false);
    }
  }

  const sch = booking.schedule || schedule;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Confirm your booking and complete payment.
        </p>
      </div>

      {/* Booking reference banner */}
      <div className="card mb-5 bg-[#f0ebff] dark:bg-[#1a1035] border border-[#c4b5fd] dark:border-[#4c1d95]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-0.5">Booking reference</p>
            <p className="text-xl font-bold tracking-widest text-brand-700 dark:text-brand-300">
              {booking.reference}
            </p>
          </div>
          <span className="badge-brand">PENDING</span>
        </div>
      </div>

      {/* Trip summary */}
      {sch && (
        <div className="card mb-5">
          <p className="text-xs font-medium text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-wide">
            Trip summary
          </p>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {formatTime(sch.departureTime)}
              </p>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                {sch.route?.origin}
              </p>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-px bg-[#e8e3ff] dark:bg-[#2d1a5e] relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {formatTime(sch.arrivalTime)}
              </p>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                {sch.route?.destination}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-400 dark:text-slate-500">Date</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(sch.departureTime)}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-slate-500">Company</p>
              <p className="font-medium text-gray-900 dark:text-white">{sch.company?.name || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-slate-500">Seats</p>
              <p className="font-medium text-gray-900 dark:text-white">{booking.seatsBooked}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-slate-500">Bus</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {sch.bus?.model || 'Coach'} · {sch.bus?.plateNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Amount due */}
      <div className="card mb-6 bg-[#f8f7ff] dark:bg-[#1a1035]">
        <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
          <span>Amount due</span>
          <span className="text-brand-600 dark:text-brand-400">RWF {amount.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
          Simulated payment — no real money will be charged.
        </p>
      </div>

      {/* Error */}
      {payError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {payError}
        </div>
      )}

      {/* Payment actions */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handlePay('simulated')}
          disabled={paying}
          className="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-base"
        >
          {paying && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {paying ? 'Processing…' : `Pay RWF ${amount.toLocaleString()}`}
        </button>

        {/* Dev convenience: simulate a payment failure */}
        <button
          type="button"
          onClick={() => handlePay('fail')}
          disabled={paying}
          className="btn-secondary w-full text-sm py-2 opacity-70 hover:opacity-100"
        >
          Simulate payment failure (dev)
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={paying}
          className="text-sm text-gray-500 dark:text-slate-400 hover:underline text-center"
        >
          ← Back to booking summary
        </button>
      </div>
    </div>
  );
}
