import React from 'react';
import { Link } from 'react-router-dom';

const VALUES = [
  {
    icon: '🚌',
    title: 'Connecting Rwanda',
    desc: 'Every Rwandan deserves a simple, dignified way to travel between cities — without long queues or uncertainty.',
  },
  {
    icon: '📲',
    title: 'Digital-first convenience',
    desc: 'From booking to boarding, everything is digital. No paper tickets, no cash lines, no guessing.',
  },
  {
    icon: '🔒',
    title: 'Trust & transparency',
    desc: 'Clear pricing, confirmed bookings, and secure payments. No hidden fees, no surprises.',
  },
  {
    icon: '🤝',
    title: 'Supporting local operators',
    desc: 'We work with Rwandan bus companies to help them reach more passengers and operate better.',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="badge-accent mb-4">About us</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
              We're building Rwanda's modern transport platform
            </h1>
            <p className="text-slate-300 text-lg">
              Rugendo Rwanda is an online intercity bus booking platform designed for Rwandan travellers —
              simple to use, reliable, and built for how people actually travel today.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-brand mb-3">Our mission</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Making intercity travel as easy as sending a message
              </h2>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                Every day, thousands of Rwandans travel between cities for work, family, and opportunity.
                The process of finding a bus, booking a seat, and confirming your journey should not be complicated.
              </p>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed">
                Rugendo Rwanda brings scheduling, seat booking, and digital boarding together in one platform —
                accessible from any phone, at any time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Routes covered',   value: '50+' },
                { label: 'Daily departures',  value: '200+' },
                { label: 'Cities connected',  value: '15+' },
                { label: 'Partner operators', value: '8+' },
              ].map((s) => (
                <div key={s.label} className="card text-center py-8">
                  <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{s.value}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-muted">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What we stand for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="card">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Join thousands of Rwandan travellers
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">
            Book your next intercity trip online — fast, safe, and simple.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-gradient">Create account</Link>
            <Link to="/contact" className="btn-secondary">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
