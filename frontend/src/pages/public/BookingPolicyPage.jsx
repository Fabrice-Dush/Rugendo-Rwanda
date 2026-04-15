import React from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Booking confirmation',
    icon: '🎫',
    body: `A booking is only confirmed after payment is successfully processed. Upon confirmation you receive a unique booking token (reference number) by SMS and in your account dashboard. This token is your proof of reserved seat and must be presented at boarding.`,
  },
  {
    title: 'Seat reservation',
    icon: '💺',
    body: `Your seat is reserved under your booking reference from the moment payment is confirmed. If you selected a specific seat on the seat map, that seat is held for you. Rugendo Rwanda guarantees the seat number or class booked; exact physical seat assignment may occasionally be adjusted by the operator without notice for operational reasons.`,
  },
  {
    title: 'Passenger name',
    icon: '👤',
    body: `The name on the booking must match the passenger who boards. Operators may verify identity at boarding. Bookings are non-transferable once issued.`,
  },
  {
    title: 'Cancellation policy',
    icon: '❌',
    body: `Cancellations made more than 4 hours before the scheduled departure are eligible for a full refund minus a processing fee of RWF 300. Cancellations made within 4 hours of departure are not eligible for a refund. No-shows are treated as used bookings and are not refundable.`,
  },
  {
    title: 'Refund processing',
    icon: '💰',
    body: `Approved refunds are returned to the original payment method. Refunds to mobile money wallets are typically processed within 24 hours. Refunds to bank cards may take 3–5 business days depending on your bank.`,
  },
  {
    title: 'Rescheduling',
    icon: '📅',
    body: `Rescheduling to a different departure date or time may be possible for some operators. Contact support at least 4 hours before your original departure with your booking reference. A rescheduling fee may apply and is subject to seat availability on the new schedule.`,
  },
  {
    title: 'Operator cancellations',
    icon: '🚌',
    body: `If an operator cancels a scheduled departure, all passengers with confirmed bookings on that schedule will be notified by SMS and in their account. A full refund is automatically issued. Rugendo Rwanda is not liable for costs incurred due to the cancellation beyond the value of the booking.`,
  },
  {
    title: 'Boarding',
    icon: '✅',
    body: `Arrive at the designated bus park at least 20 minutes before departure. Present your booking token (phone display or SMS) to the operator. Failure to arrive on time may result in forfeiture of your seat and no refund.`,
  },
  {
    title: 'Luggage',
    icon: '🧳',
    body: `Standard luggage allowance is 1 piece (max 20 kg) per passenger. Additional or oversized luggage is subject to the operator's own policies and may incur extra charges payable directly to the operator.`,
  },
];

export default function BookingPolicyPage() {
  return (
    <div>
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page">
          <span className="badge-accent mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Booking Policy</h1>
          <p className="text-slate-300 max-w-xl">
            Please read this policy before booking. By completing a booking on Rugendo Rwanda you agree to these terms.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="space-y-5">
            {SECTIONS.map((s) => (
              <div key={s.title} className="card flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-xl shrink-0">
                  {s.icon}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white mb-1">{s.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400 dark:text-slate-500 mb-4">
              Questions about a booking?
            </p>
            <Link to="/contact" className="btn-secondary">Contact support</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
