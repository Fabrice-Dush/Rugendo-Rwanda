import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder route data — replace with API call
const ROUTES = [
  { from: 'Kigali',   to: 'Butare',    distance: '136 km', duration: '2h 30min', minPrice: 3500,  departures: 12, popular: true  },
  { from: 'Kigali',   to: 'Musanze',   distance: '111 km', duration: '2h',       minPrice: 3000,  departures: 10, popular: true  },
  { from: 'Kigali',   to: 'Gisenyi',   distance: '157 km', duration: '2h 45min', minPrice: 4000,  departures: 8,  popular: true  },
  { from: 'Kigali',   to: 'Cyangugu',  distance: '218 km', duration: '3h 30min', minPrice: 5500,  departures: 6,  popular: false },
  { from: 'Kigali',   to: 'Kibungo',   distance: '114 km', duration: '2h',       minPrice: 3200,  departures: 8,  popular: false },
  { from: 'Kigali',   to: 'Nyagatare', distance: '131 km', duration: '2h 15min', minPrice: 3500,  departures: 6,  popular: false },
  { from: 'Kigali',   to: 'Ruhango',   distance: '78 km',  duration: '1h 30min', minPrice: 2000,  departures: 10, popular: false },
  { from: 'Butare',   to: 'Musanze',   distance: '195 km', duration: '3h 15min', minPrice: 5000,  departures: 4,  popular: false },
  { from: 'Butare',   to: 'Cyangugu',  distance: '98 km',  duration: '1h 45min', minPrice: 2500,  departures: 6,  popular: false },
  { from: 'Musanze',  to: 'Gisenyi',   distance: '49 km',  duration: '55min',    minPrice: 1500,  departures: 8,  popular: false },
  { from: 'Gisenyi',  to: 'Cyangugu',  distance: '121 km', duration: '2h 15min', minPrice: 3000,  departures: 4,  popular: false },
  { from: 'Kigali',   to: 'Kayonza',   distance: '82 km',  duration: '1h 20min', minPrice: 2000,  departures: 8,  popular: false },
];

const CITIES = [...new Set(ROUTES.flatMap((r) => [r.from, r.to]))].sort();

export default function RoutesPage() {
  const navigate = useNavigate();
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const filtered = ROUTES.filter((r) => {
    const fromMatch = !filterFrom || r.from.toLowerCase().includes(filterFrom.toLowerCase());
    const toMatch   = !filterTo   || r.to.toLowerCase().includes(filterTo.toLowerCase());
    return fromMatch && toMatch;
  });

  const popular = ROUTES.filter((r) => r.popular);

  return (
    <div>
      {/* Header */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page text-center">
          <span className="badge-accent mb-4">All destinations</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Routes & destinations</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Browse all intercity routes covered by Rugendo Rwanda — from short city hops to full cross-country journeys.
          </p>
        </div>
      </section>

      {/* Popular */}
      <section className="section-muted">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Most popular routes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popular.map((r) => (
              <RouteCard key={`${r.from}-${r.to}`} route={r} onBook={(from, to) => navigate(`/search?from=${from}&to=${to}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* All routes with filter */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              placeholder="Filter by departure city"
              className="input max-w-xs"
            />
            <input
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              placeholder="Filter by destination"
              className="input max-w-xs"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No routes match your search.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e3ff] dark:border-[#2d1a5e] text-left text-gray-500 dark:text-slate-400">
                    <th className="pb-3 font-medium">Route</th>
                    <th className="pb-3 font-medium">Distance</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">Daily departures</th>
                    <th className="pb-3 font-medium">From</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e3ff] dark:divide-[#2d1a5e]">
                  {filtered.map((r) => (
                    <tr key={`${r.from}-${r.to}`} className="hover:bg-[#f8f7ff] dark:hover:bg-[#130d2e] transition-colors">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {r.from} <span className="text-accent-500">→</span> {r.to}
                        {r.popular && <span className="badge-accent ml-2">Popular</span>}
                      </td>
                      <td className="py-3 text-gray-500 dark:text-slate-400">{r.distance}</td>
                      <td className="py-3 text-gray-500 dark:text-slate-400">{r.duration}</td>
                      <td className="py-3 text-gray-500 dark:text-slate-400">{r.departures}/day</td>
                      <td className="py-3 font-semibold text-brand-600 dark:text-brand-400">
                        RWF {r.minPrice.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => navigate(`/search?from=${r.from}&to=${r.to}`)}
                          className="btn-secondary text-xs px-3 py-1.5"
                        >
                          View schedules
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function RouteCard({ route: r, onBook }) {
  return (
    <div className="card-hover">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-bold text-gray-900 dark:text-white">{r.from}</span>
        <span className="text-accent-500">→</span>
        <span className="font-bold text-gray-900 dark:text-white">{r.to}</span>
        {r.popular && <span className="badge-accent ml-auto">Popular</span>}
      </div>
      <div className="flex gap-4 text-sm text-gray-500 dark:text-slate-400 mb-4">
        <span>{r.distance}</span>·<span>{r.duration}</span>·<span>{r.departures} trips/day</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-brand-600 dark:text-brand-400 font-bold">from RWF {r.minPrice.toLocaleString()}</span>
        <button onClick={() => onBook(r.from, r.to)} className="btn-primary text-xs px-4 py-2">
          Book now
        </button>
      </div>
    </div>
  );
}
