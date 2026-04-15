import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

// Placeholder schedule data — replace with bookingService.searchSchedules(params) call
const MOCK_SCHEDULES = [
  {
    id: 'sch-1',
    operator: 'Volcano Express',
    from: 'Kigali',
    to: 'Musanze',
    departure: '06:00',
    arrival: '08:00',
    duration: '2h',
    busClass: 'Express',
    seats: 12,
    price: 3000,
  },
  {
    id: 'sch-2',
    operator: 'Horizon Express',
    from: 'Kigali',
    to: 'Musanze',
    departure: '08:30',
    arrival: '10:30',
    duration: '2h',
    busClass: 'Standard',
    seats: 24,
    price: 2500,
  },
  {
    id: 'sch-3',
    operator: 'Royal Express',
    from: 'Kigali',
    to: 'Musanze',
    departure: '12:00',
    arrival: '14:00',
    duration: '2h',
    busClass: 'Luxury',
    seats: 6,
    price: 5000,
  },
  {
    id: 'sch-4',
    operator: 'Volcano Express',
    from: 'Kigali',
    to: 'Musanze',
    departure: '14:30',
    arrival: '16:30',
    duration: '2h',
    busClass: 'Standard',
    seats: 18,
    price: 2500,
  },
  {
    id: 'sch-5',
    operator: 'Horizon Express',
    from: 'Kigali',
    to: 'Musanze',
    departure: '17:00',
    arrival: '19:00',
    duration: '2h',
    busClass: 'Express',
    seats: 0,
    price: 3000,
  },
];

const CLASS_COLORS = {
  Standard: 'badge-brand',
  Express:  'badge-accent',
  Luxury:   'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 badge',
};

function ScheduleCard({ schedule }) {
  const isFull = schedule.seats === 0;
  return (
    <div className={`card flex flex-col sm:flex-row sm:items-center gap-4 ${isFull ? 'opacity-60' : ''}`}>
      {/* Operator + class */}
      <div className="sm:w-44 shrink-0">
        <p className="font-semibold text-gray-900 dark:text-white">{schedule.operator}</p>
        <span className={CLASS_COLORS[schedule.busClass] || 'badge-brand'}>{schedule.busClass}</span>
      </div>

      {/* Times */}
      <div className="flex items-center gap-3 flex-1">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{schedule.departure}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{schedule.from}</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-xs text-gray-400 dark:text-slate-500">{schedule.duration}</p>
          <div className="w-full h-px bg-[#e8e3ff] dark:bg-[#2d1a5e] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-600" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{schedule.arrival}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{schedule.to}</p>
        </div>
      </div>

      {/* Seats + price + action */}
      <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
        <div>
          <p className="text-xl font-bold text-brand-600 dark:text-brand-400">
            RWF {schedule.price.toLocaleString()}
          </p>
          <p className={`text-xs mt-0.5 ${isFull ? 'text-red-500' : 'text-gray-400 dark:text-slate-500'}`}>
            {isFull ? 'Sold out' : `${schedule.seats} seats left`}
          </p>
        </div>
        {isFull ? (
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Unavailable</span>
        ) : (
          <Link to={`/passenger/book?scheduleId=${schedule.id}`} className="btn-primary text-sm px-4 py-2">
            Book seat
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const from       = searchParams.get('from') || '';
  const to         = searchParams.get('to') || '';
  const date       = searchParams.get('date') || '';
  const passengers = searchParams.get('passengers') || '1';

  // Filter mock data by route (placeholder — real implementation calls API)
  const results = MOCK_SCHEDULES.filter(
    (s) =>
      (!from || s.from.toLowerCase().includes(from.toLowerCase())) &&
      (!to   || s.to.toLowerCase().includes(to.toLowerCase()))
  );

  const [sortBy, setSortBy] = useState('departure');

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'price')     return a.price - b.price;
    if (sortBy === 'departure') return a.departure.localeCompare(b.departure);
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
                {passengers > 1 && <span className="text-sm font-normal text-gray-400 dark:text-slate-500 ml-1">· {passengers} passengers</span>}
              </h1>
            ) : (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Search results</h1>
            )}
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {sorted.length} trip{sorted.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Link to="/" className="btn-secondary text-sm">Modify search</Link>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Sort */}
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

        {/* Results */}
        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🚌</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No trips found</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              No buses are scheduled for this route and date. Try a different date or route.
            </p>
            <Link to="/" className="btn-gradient">Search again</Link>
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
      </div>
    </div>
  );
}
