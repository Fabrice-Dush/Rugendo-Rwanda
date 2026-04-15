import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

// Returns today's date as YYYY-MM-DD in local time
function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function SearchTripsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill from query params when arriving from route cards / RoutesPage
  const [form, setForm] = useState({
    from:       searchParams.get('from')       || '',
    to:         searchParams.get('to')         || '',
    date:       searchParams.get('date')       || todayLocal(),
    passengers: searchParams.get('passengers') || '1',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guarantee a date — fall back to today if somehow empty
    const date = form.date || todayLocal();
    const params = new URLSearchParams({ ...form, date }).toString();
    navigate(`/search?${params}`);
  };

  return (
    <div>
      {/* Page header */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page text-center">
          <span className="badge-accent mb-4">Find your ride</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Search bus trips</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Choose your route, pick a date, and see all available schedules in seconds.
          </p>
        </div>
      </section>

      {/* Search form */}
      <section className="section">
        <div className="container-page max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#1a1035] rounded-2xl shadow-brand border border-[#e8e3ff] dark:border-[#2d1a5e] p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Where are you going?</h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* From */}
              <div>
                <label className="label">From</label>
                <input
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  placeholder="Departure city (e.g. Kigali)"
                  required
                  className="input"
                />
              </div>

              {/* To */}
              <div>
                <label className="label">To</label>
                <input
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  placeholder="Destination (e.g. Musanze)"
                  required
                  className="input"
                />
              </div>

              {/* Date */}
              <div>
                <label className="label">Travel date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={todayLocal()}
                  className="input"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  Defaults to today if not changed.
                </p>
              </div>

              {/* Passengers */}
              <div>
                <label className="label">Passengers</label>
                <select
                  name="passengers"
                  value={form.passengers}
                  onChange={handleChange}
                  className="input"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} passenger{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
              <Link to="/routes" className="btn-secondary text-center">
                Browse all routes
              </Link>
              <button type="submit" className="btn-gradient px-10">
                Search buses
              </button>
            </div>
          </form>

          {/* Quick-pick popular routes */}
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">
              Popular routes — click to pre-fill:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { from: 'Kigali', to: 'Musanze'  },
                { from: 'Kigali', to: 'Butare'   },
                { from: 'Kigali', to: 'Gisenyi'  },
                { from: 'Kigali', to: 'Cyangugu' },
                { from: 'Kigali', to: 'Kibungo'  },
                { from: 'Butare',  to: 'Musanze' },
              ].map((r) => (
                <button
                  key={`${r.from}-${r.to}`}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, from: r.from, to: r.to }))
                  }
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#e8e3ff] dark:border-[#2d1a5e]
                             bg-[#f8f7ff] dark:bg-[#130d2e] text-gray-600 dark:text-slate-300
                             hover:bg-brand-50 dark:hover:bg-brand-950 hover:border-brand-400 transition-colors"
                >
                  {r.from} → {r.to}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
