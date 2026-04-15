import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Create your account',
    desc: 'Register with your email and phone number. It takes less than a minute. Your account stores your trips and personal details securely.',
    detail: 'No booking is required to create an account. You can search and view schedules without registering.',
    icon: '👤',
  },
  {
    step: '02',
    title: 'Search your route',
    desc: 'Enter your departure city, destination, and travel date. Select how many passengers are travelling.',
    detail: 'You can search routes like Kigali → Butare, Kigali → Musanze, Butare → Gisenyi, and many more. Schedules are updated in real time.',
    icon: '🔍',
  },
  {
    step: '03',
    title: 'Choose a schedule',
    desc: 'View all available buses for your route and date. Compare departure times, operators, bus class, available seats, and price.',
    detail: 'Each listing shows the bus company, bus type (standard / express / luxury), and remaining seats. Select the one that fits you best.',
    icon: '🗓️',
  },
  {
    step: '04',
    title: 'Select your seat',
    desc: 'Pick a specific seat from the bus seat map, or let the system assign you the next available one.',
    detail: 'Window seats, aisle seats, and rows near the front are all selectable where available.',
    icon: '💺',
  },
  {
    step: '05',
    title: 'Pay securely',
    desc: 'Pay using MTN Mobile Money, Airtel Money, or a bank card. The payment is confirmed instantly.',
    detail: 'You will receive a payment confirmation on your phone immediately after the transaction completes.',
    icon: '💳',
  },
  {
    step: '06',
    title: 'Receive your booking token',
    desc: 'Your booking is confirmed. You receive a unique booking reference number (token) by SMS and in your account dashboard.',
    detail: 'Present this reference at the bus park — the operator scans or checks it to validate your boarding. No printing needed.',
    icon: '🎫',
  },
];

const FAQS = [
  {
    q: 'Can I book for someone else?',
    a: 'Yes. When booking, you can enter a different passenger name. You manage the booking through your own account.',
  },
  {
    q: 'What if I miss my bus?',
    a: 'Contact the operator directly or reach our support team. Rebooking policies depend on the operator and how much time remains before departure.',
  },
  {
    q: 'How early should I arrive at the bus park?',
    a: 'We recommend arriving at least 20 minutes before departure for boarding verification.',
  },
  {
    q: 'What if the bus is cancelled?',
    a: 'If an operator cancels a schedule, you will be notified and a refund will be processed back to your payment method.',
  },
  {
    q: 'Is my booking guaranteed?',
    a: 'Yes. Once payment is confirmed, your seat is reserved. The booking token is your proof of seat reservation.',
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page text-center">
          <span className="badge-accent mb-4">Simple & clear</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">How Rugendo Rwanda works</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            From searching a route to boarding your bus — here's exactly how the booking process works.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section">
        <div className="container-page max-w-4xl">
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="card flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient text-white text-sm font-bold flex items-center justify-center shadow-brand shrink-0">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{s.title}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-slate-300 mb-2">{s.desc}</p>
                  <p className="text-sm text-gray-400 dark:text-slate-500">{s.detail}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block text-2xl text-brand-300 shrink-0">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-muted">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Common questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="card">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">{f.q}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready to book your trip?</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">Create an account in under a minute.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-gradient">Create account</Link>
            <Link to="/search" className="btn-secondary">Search schedules</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
