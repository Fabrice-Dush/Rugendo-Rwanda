import React from 'react';

const SECTIONS = [
  {
    title: '1. Acceptance of terms',
    body: `By accessing or using the Rugendo Rwanda platform (website and mobile applications), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform. We reserve the right to update these terms at any time; continued use after changes constitutes acceptance.`,
  },
  {
    title: '2. Use of the platform',
    body: `Rugendo Rwanda provides an online interface for searching intercity bus schedules, booking seats, and managing travel bookings. You agree to use the platform only for lawful purposes and in compliance with these terms. You must not misuse the platform, attempt to access it by any means other than the interface we provide, or engage in any behaviour that could damage, disable, or impair the platform.`,
  },
  {
    title: '3. Account registration',
    body: `To make a booking you must register an account with accurate, complete information. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. Notify us immediately if you suspect unauthorised access to your account.`,
  },
  {
    title: '4. Bookings and seat reservations',
    body: `A booking is confirmed only upon successful payment. Your booking reference (token) is proof of your confirmed reservation. Rugendo Rwanda acts as an intermediary between passengers and bus operators. We do not operate the buses and are not responsible for the conduct of operators or for delays, cancellations, or incidents during travel.`,
  },
  {
    title: '5. Payments',
    body: `All payments are processed through authorised payment processors. Prices are shown in Rwandan Francs (RWF). By completing payment you authorise the charge to your selected payment method. Rugendo Rwanda does not store full card numbers or mobile money PINs.`,
  },
  {
    title: '6. Cancellations and refunds',
    body: `Cancellation and refund eligibility depends on the operator's policy and the time remaining before departure. Rugendo Rwanda will facilitate refunds as described in the Booking Policy. We are not liable for refund delays caused by payment processors or operators.`,
  },
  {
    title: '7. Limitation of liability',
    body: `To the maximum extent permitted by applicable law, Rugendo Rwanda and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of the platform or from travel on a booked bus. Our total liability to you for any claim shall not exceed the amount paid for the booking giving rise to the claim.`,
  },
  {
    title: '8. Intellectual property',
    body: `All content on the Rugendo Rwanda platform — including text, graphics, logos, and software — is owned by or licensed to Rugendo Rwanda. You may not reproduce, distribute, or create derivative works without our express written consent.`,
  },
  {
    title: '9. Governing law',
    body: `These terms are governed by and construed in accordance with the laws of the Republic of Rwanda. Any disputes shall be resolved in the courts of Rwanda.`,
  },
  {
    title: '10. Contact',
    body: `For questions about these terms, contact us at legal@rugendorwanda.rw.`,
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page">
          <span className="badge-accent mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Terms of Service</h1>
          <p className="text-slate-300">Last updated: April 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
