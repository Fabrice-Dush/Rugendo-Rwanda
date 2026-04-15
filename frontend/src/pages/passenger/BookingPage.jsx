import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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

function formatDuration(min) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scheduleId = parseInt(searchParams.get('scheduleId'), 10);

  const [schedule, setSchedule] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [seats,    setSeats]    = useState(1);

  useEffect(() => {
    if (!scheduleId || isNaN(scheduleId)) {
      setError('No schedule selected.');
      setLoading(false);
      return;
    }
    bookingService.getScheduleById(scheduleId)
      .then((res) => setSchedule(res.data))
      .catch(() => setError('Could not load schedule details. Please go back and try again.'))
      .finally(() => setLoading(false));
  }, [scheduleId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-slate-400">Loading schedule…</p>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Schedule not found</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6">{error || 'The selected schedule could not be found.'}</p>
        <Link to="/" className="btn-gradient">Search trips</Link>
      </div>
    );
  }

  const price      = parseFloat(schedule.price);
  const maxSeats   = Math.min(schedule.seatsAvailable, 6);
  const totalPrice = price * seats;

  function handleConfirm() {
    // Booking creation (POST /api/bookings) is the next feature batch.
    // For now, pass state forward via navigation — placeholder until booking API is ready.
    navigate('/passenger/booking-confirm', {
      state: { scheduleId: schedule.id, seats, totalAmount: totalPrice, schedule },
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking summary</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Review your trip details before continuing to payment.
        </p>
      </div>

      {/* Schedule details card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Your trip</span>
          <span className="badge-brand">{schedule.company?.name}</span>
        </div>

        {/* Route + times */}
        <div className="flex items-center gap-4 mb-5">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatTime(schedule.departureTime)}
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mt-0.5">
              {schedule.route?.origin}
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            {schedule.route?.durationMin && (
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">
                {formatDuration(schedule.route.durationMin)}
              </p>
            )}
            <div className="w-full h-px bg-[#e8e3ff] dark:bg-[#2d1a5e] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-600" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatTime(schedule.arrivalTime)}
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mt-0.5">
              {schedule.route?.destination}
            </p>
          </div>
        </div>

        {/* Date + bus details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400 dark:text-slate-500">Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(schedule.departureTime)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500">Bus</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {schedule.bus?.model || 'Coach'} · {schedule.bus?.plateNumber}
            </p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500">Available seats</p>
            <p className={`font-medium ${schedule.seatsAvailable <= 5 ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
              {schedule.seatsAvailable}
            </p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500">Price per seat</p>
            <p className="font-medium text-brand-600 dark:text-brand-400">
              RWF {price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Seat count selector */}
      <div className="card mb-6">
        <label className="label mb-2">Number of seats</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSeats((s) => Math.max(1, s - 1))}
            disabled={seats <= 1}
            className="w-10 h-10 rounded-lg bg-[#f0ebff] dark:bg-[#2d1a5e] text-brand-700 dark:text-brand-300 font-bold text-xl disabled:opacity-40 hover:bg-brand-100 dark:hover:bg-[#3d2a6e] transition-colors"
          >
            −
          </button>
          <span className="text-2xl font-bold text-gray-900 dark:text-white w-6 text-center">{seats}</span>
          <button
            type="button"
            onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
            disabled={seats >= maxSeats}
            className="w-10 h-10 rounded-lg bg-[#f0ebff] dark:bg-[#2d1a5e] text-brand-700 dark:text-brand-300 font-bold text-xl disabled:opacity-40 hover:bg-brand-100 dark:hover:bg-[#3d2a6e] transition-colors"
          >
            +
          </button>
          <span className="text-sm text-gray-500 dark:text-slate-400 ml-2">
            (max {maxSeats})
          </span>
        </div>
      </div>

      {/* Price summary */}
      <div className="card mb-6 bg-[#f8f7ff] dark:bg-[#1a1035]">
        <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-2">
          <span>RWF {price.toLocaleString()} × {seats} seat{seats > 1 ? 's' : ''}</span>
          <span>RWF {totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white border-t border-[#e8e3ff] dark:border-[#2d1a5e] pt-3 mt-2">
          <span>Total</span>
          <span className="text-brand-600 dark:text-brand-400">RWF {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary flex-1"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="btn-gradient flex-1"
        >
          Continue to payment
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-slate-600 mt-4 text-center">
        Seats are not reserved until payment is completed.
      </p>
    </div>
  );
}
