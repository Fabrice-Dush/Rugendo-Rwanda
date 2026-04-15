import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: 'Booking',
    items: [
      {
        q: 'How do I book a bus ticket?',
        a: 'Search for your route on the homepage or the Search Trips page, choose a schedule, select your seat, pay, and receive your booking token. The whole process takes under 2 minutes.',
      },
      {
        q: 'Do I need an account to book?',
        a: 'Yes. You need a free Rugendo Rwanda account to complete a booking. This lets us store your booking reference and send you confirmations.',
      },
      {
        q: 'Can I book for another person?',
        a: 'Yes. When completing your booking you can enter a different passenger name. You manage the booking through your own account.',
      },
      {
        q: 'How far in advance can I book?',
        a: 'You can book up to 30 days in advance. Same-day bookings are available while seats remain.',
      },
      {
        q: 'Can I book multiple seats at once?',
        a: 'Yes. Select the number of passengers when searching, and you can book multiple seats in a single transaction.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'What payment methods are accepted?',
        a: 'MTN Mobile Money, Airtel Money, and major bank cards are accepted.',
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Yes. Payments are processed through encrypted, trusted channels. Rugendo Rwanda does not store your card or mobile money credentials.',
      },
      {
        q: 'When is my card or mobile money charged?',
        a: 'Payment is processed immediately at the time of booking. Your seat is only confirmed once payment is successful.',
      },
      {
        q: "I was charged but didn't receive a booking confirmation. What do I do?",
        a: 'Contact our support team with your phone number and payment details. We will trace the transaction and confirm your booking or issue a refund within 24 hours.',
      },
    ],
  },
  {
    category: 'Boarding & tickets',
    items: [
      {
        q: 'What is a booking token?',
        a: 'A booking token (reference number) is a unique code you receive after a successful booking. You present this at the bus park so the operator can verify your reservation.',
      },
      {
        q: 'Do I need to print my ticket?',
        a: 'No. Show your booking reference on your phone. A digital display is all that is needed.',
      },
      {
        q: 'How early should I arrive at the bus park?',
        a: 'We recommend arriving at least 20 minutes before your scheduled departure for boarding verification.',
      },
    ],
  },
  {
    category: 'Changes & cancellations',
    items: [
      {
        q: 'Can I cancel my booking?',
        a: 'Cancellation policies vary by operator. Check the booking details in your account or contact support. Cancellations made more than 2 hours before departure are generally eligible for a refund.',
      },
      {
        q: 'Can I change my travel date?',
        a: 'Rescheduling depends on the operator\'s policy. Contact our support team with your booking reference and the preferred new date.',
      },
      {
        q: 'What if the operator cancels the bus?',
        a: 'If an operator cancels a scheduled departure, all affected passengers are notified and receive a full refund.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e8e3ff] dark:border-[#2d1a5e] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-start justify-between gap-4 group"
      >
        <span className="font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {q}
        </span>
        <span className={`shrink-0 text-brand-600 dark:text-brand-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page text-center">
          <span className="badge-accent mb-4">Help center</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Frequently asked questions</h1>
          <p className="text-slate-300 text-lg max-w-lg mx-auto">
            Answers to the most common questions about booking, payment, and boarding.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="space-y-10">
            {FAQS.map((section) => (
              <div key={section.category}>
                <h2 className="text-lg font-bold text-brand-600 dark:text-brand-400 mb-2">{section.category}</h2>
                <div className="card divide-y divide-[#e8e3ff] dark:divide-[#2d1a5e] p-0 overflow-hidden">
                  {section.items.map((item) => (
                    <div key={item.q} className="px-6">
                      <FAQItem {...item} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 card text-center py-10">
            <p className="text-gray-500 dark:text-slate-400 mb-4">
              Didn't find what you were looking for?
            </p>
            <Link to="/contact" className="btn-gradient">Contact support</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
