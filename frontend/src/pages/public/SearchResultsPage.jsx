import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(isoString) {
  if (!isoString) return '--:--';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDuration(durationMin) {
  if (!durationMin) return null;
  const h = Math.floor(durationMin / 60);
  const m = durationMin % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

// ── ScheduleCard ──────────────────────────────────────────────────────────────

function ScheduleCard({ schedule }) {
  const navigate = useNavigate();
  const isFull = schedule.seatsAvailable === 0;
  const departure = formatTime(schedule.departureTime);
  const arrival   = formatTime(schedule.arrivalTime);
  const duration  = formatDuration(schedule.route?.durationMin);
  const price     = parseFloat(schedule.price);

  function handleSelect() {
    navigate(`/passenger/book?scheduleId=${schedule.id}`);
  }

  return (
    <div className={`card flex flex-col sm:flex-row sm:items-center gap-4 ${isFull ? 'opacity-60' : ''}`}>
      {/* Company + bus model */}
      <div className="sm:w-44 shrink-0">
        <p className="font-semibold text-gray-900 dark:text-white">{schedule.company?.name}</p>
        {schedule.bus?.model && (
          <span className="badge-brand text-xs">{schedule.bus.model}</span>
        )}
      </div>

      {/* Times */}
      <div className="flex items-center gap-3 flex-1">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{departure}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{schedule.route?.origin}</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          {duration && (
            <p className="text-xs text-gray-400 dark:text-slate-500">{duration}</p>
          )}
          <div className="w-full h-px bg-[#e8e3ff] dark:bg-[#2d1a5e] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-600" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{arrival}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{schedule.route?.destination}</p>
        </div>
      </div>

      {/* Seats + price + action */}
      <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
        <div>
          <p className="text-xl font-bold text-brand-600 dark:text-brand-400">
            RWF {price.toLocaleString()}
          </p>
          <p className={`text-xs mt-0.5 ${isFull ? 'text-red-500' : 'text-gray-400 dark:text-slate-500'}`}>
            {isFull ? 'Sold out' : `${schedule.seatsAvailable} seat${schedule.seatsAvailable !== 1 ? 's' : ''} left`}
          </p>
        </div>
        {isFull ? (
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Unavailable</span>
        ) : (
          <button onClick={handleSelect} className="btn-primary text-sm px-4 py-2">
            Select
          </button>
        )}
      </div>
    </div>
  );
}

// ── SearchResultsPage ─────────────────────────────────────────────────────────

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const from       = searchParams.get('from') || '';
  const to         = searchParams.get('to') || '';
  // Default date to today when absent — keeps the results page working even
  // when navigated via a route card or bare /search link.
  const date       = searchParams.get('date') || todayLocal();
  const passengers = searchParams.get('passengers') || '1';

  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [sortBy,   setSortBy]   = useState('departure');

  const fetchSchedules = useCallback(async () => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.searchSchedules({
        from,
        to,
        date,
        seats: parseInt(passengers, 10) || 1,
      });
      setResults(res.data || []);
    } catch (err) {
      const errData = err?.response?.data;
      const msg = errData?.errors
        ? Object.values(errData.errors).flat().join('. ')
        : errData?.message || 'Failed to load schedules. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [from, to, date, passengers]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'price')     return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'departure') return new Date(a.departureTime) - new Date(b.departureTime);
    return 0;
  });

  return (
    <div>
      {/* Search summary bar */}
      <div className="bg-[#f8f7ff] dark:bg-[#130d2e] border-b border-[#e8e3ff] dark:border-[#2d1a5e] py-5">
        <div className="container-page flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            {from && to ? (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {from} <span className="text-accent-500">→</span> {to}
                {date && <span className="text-sm font-normal text-gray-400 dark:text-slate-500 ml-2">{date}</span>}
                {parseInt(passengers) > 1 && (
                  <span className="text-sm font-normal text-gray-400 dark:text-slate-500 ml-1">
                    · {passengers} passengers
                  </span>
                )}
              </h1>
            ) : (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Search results</h1>
            )}
            {!loading && !error && (
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                {sorted.length} trip{sorted.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <Link
            to={`/search-trips?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&passengers=${encodeURIComponent(passengers)}`}
            className="btn-secondary text-sm"
          >
            Modify search
          </Link>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-slate-400">Searching for available buses…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-6">{error}</p>
            <button onClick={fetchSchedules} className="btn-gradient">Try again</button>
          </div>
        )}

        {/* Missing origin/destination */}
        {!loading && !error && (!from || !to) && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enter your search</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Please choose an origin and destination to search for buses.
            </p>
            <Link to="/search-trips" className="btn-gradient">Search trips</Link>
          </div>
        )}

        {/* Results */}
        {!loading && !error && from && to && (
          <>
            {/* Sort controls */}
            {sorted.length > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm text-gray-500 dark:text-slate-400">Sort by:</span>
                {['departure', 'price'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      sortBy === opt
                        ? 'bg-brand-600 text-white'
                        : 'bg-[#f8f7ff] dark:bg-[#1a1035] text-gray-600 dark:text-slate-400 hover:bg-brand-50 dark:hover:bg-brand-950'
                    }`}
                  >
                    {opt === 'departure' ? 'Departure time' : 'Price'}
                  </button>
                ))}
              </div>
            )}

            {sorted.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🚌</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No trips found</h2>
                <p className="text-gray-500 dark:text-slate-400 mb-6">
                  No buses are scheduled for this route on {date}. Try a different date or route.
                </p>
                <Link to="/search-trips" className="btn-gradient">Search again</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sorted.map((s) => (
                  <ScheduleCard key={s.id} schedule={s} />
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 dark:text-slate-600 mt-8 text-center">
              Prices shown are per passenger. Seats are not reserved until payment is complete.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
