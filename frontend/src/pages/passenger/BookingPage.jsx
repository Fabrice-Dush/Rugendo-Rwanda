import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService.js';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const LOCALE_BY_LANGUAGE = { en: 'en-RW', rw: 'rw-RW', fr: 'fr-FR', sw: 'sw' };

function formatTime(isoString, locale) {
  if (!isoString) return '--:--';
  return new Date(isoString).toLocaleTimeString(locale, {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function formatDate(isoString, locale) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(locale, {
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
  const { t, language } = useLanguage();
  const locale = LOCALE_BY_LANGUAGE[language] || 'en-RW';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scheduleId = parseInt(searchParams.get('scheduleId'), 10);

  const [schedule,    setSchedule]   = useState(null);
  const [loading,     setLoading]    = useState(true);
  const [error,       setError]      = useState(null);
  const [seats,       setSeats]      = useState(1);
  const [submitting,  setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!scheduleId || isNaN(scheduleId)) {
      setError('No schedule selected.');
      setLoading(false);
      return;
    }
    bookingService.getScheduleById(scheduleId)
      .then((res) => setSchedule(res.data))
      .catch(() => setError(t('bookingNotFoundText')))
      .finally(() => setLoading(false));
  }, [scheduleId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-slate-400">{t('bookingLoadingSchedule')}</p>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('bookingNotFoundTitle')}</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6">{error || t('bookingNotFoundText')}</p>
        <Link to="/" className="btn-gradient">{t('bookingSearchTrips')}</Link>
      </div>
    );
  }

  const price      = parseFloat(schedule.price);
  const maxSeats   = Math.min(schedule.seatsAvailable, 6);
  const totalPrice = price * seats;
  const hasDeparted = new Date() >= new Date(schedule.departureTime);
  const seatsLabel = seats > 1 ? t('bookingSeats') : t('bookingSeat');

  async function handleConfirm() {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await bookingService.createBooking({ scheduleId: schedule.id, seats });
      navigate('/passenger/payment', {
        state: { booking: res.data, schedule },
      });
    } catch (err) {
      setSubmitError(err?.response?.data?.message || t('bookingNotFoundText'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('bookingTitle')}</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">{t('bookingSubtitle')}</p>
      </div>

      {/* Schedule details card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{t('bookingYourTrip')}</span>
          <span className="badge-brand">{schedule.company?.name}</span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatTime(schedule.departureTime, locale)}
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
              {formatTime(schedule.arrivalTime, locale)}
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mt-0.5">
              {schedule.route?.destination}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400 dark:text-slate-500">{t('bookingDate')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(schedule.departureTime, locale)}</p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500">{t('bookingBus')}</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {schedule.bus?.model || 'Coach'} · {schedule.bus?.plateNumber}
            </p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500">{t('bookingAvailableSeats')}</p>
            <p className={`font-medium ${schedule.seatsAvailable <= 5 ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
              {schedule.seatsAvailable}
            </p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500">{t('bookingPricePerSeat')}</p>
            <p className="font-medium text-brand-600 dark:text-brand-400">
              RWF {price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Seat count selector */}
      <div className="card mb-6">
        <label className="label mb-2">{t('bookingNumberOfSeats')}</label>
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
            {t('bookingMax', { max: maxSeats })}
          </span>
        </div>
      </div>

      {/* Price summary */}
      <div className="card mb-6 bg-[#f8f7ff] dark:bg-[#1a1035]">
        <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-2">
          <span>RWF {price.toLocaleString()} × {seats} {seatsLabel}</span>
          <span>RWF {totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white border-t border-[#e8e3ff] dark:border-[#2d1a5e] pt-3 mt-2">
          <span>{t('bookingTotal')}</span>
          <span className="text-brand-600 dark:text-brand-400">RWF {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {hasDeparted && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
          {t('bookingDepartedWarning')}
        </div>
      )}
      {submitError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {submitError}
        </div>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={submitting}
          className="btn-secondary flex-1"
        >
          {t('bookingBack')}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting || hasDeparted}
          className="btn-gradient flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitting ? t('bookingCreating') : t('bookingContinuePayment')}
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-slate-600 mt-4 text-center">
        {t('bookingSeatsNote')}
      </p>
    </div>
  );
}
