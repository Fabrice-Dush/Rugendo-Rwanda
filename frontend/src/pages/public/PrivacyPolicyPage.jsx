import React from 'react';

const SECTIONS = [
  {
    title: '1. Who we are',
    body: `Rugendo Rwanda operates the online bus booking platform accessible at rugendorwanda.rw. We are responsible for the personal data we collect when you use our platform.`,
  },
  {
    title: '2. What data we collect',
    body: `We collect the following categories of personal data:\n\n• Account data: name, email address, phone number, and password (stored as a hash).\n• Booking data: origin, destination, travel date, passenger name, and booking reference.\n• Payment data: transaction reference and status — we do not store full card numbers or mobile money PINs.\n• Usage data: pages visited, search queries, and device/browser information for analytics and security.`,
  },
  {
    title: '3. How we use your data',
    body: `Your data is used to: create and manage your account; process and confirm bookings; send booking confirmations and status updates via SMS or email; improve the platform experience; and comply with legal obligations. We do not sell your personal data to third parties.`,
  },
  {
    title: '4. Data sharing',
    body: `We share your name and booking reference with the bus operator for your confirmed trip, solely to validate boarding. We use third-party payment processors who handle transaction data under their own privacy policies. We may share data with law enforcement if required by Rwandan law.`,
  },
  {
    title: '5. Data retention',
    body: `We retain your account data for as long as your account is active. Booking records are retained for 3 years for legal and financial compliance. You may request deletion of your account; some data may be retained for legal obligations.`,
  },
  {
    title: '6. Your rights',
    body: `You have the right to access, correct, or request deletion of your personal data. You may also request a copy of the data we hold about you. To exercise any of these rights, contact us at privacy@rugendorwanda.rw.`,
  },
  {
    title: '7. Security',
    body: `We apply industry-standard security measures including encryption in transit (TLS), hashed passwords, and access controls. No system is perfectly secure; in the event of a data breach we will notify affected users as required by applicable law.`,
  },
  {
    title: '8. Cookies',
    body: `We use session cookies necessary for authentication and functionality. We may use analytics cookies to understand platform usage. You can disable cookies in your browser settings, though some features may not function correctly.`,
  },
  {
    title: '9. Changes to this policy',
    body: `We may update this policy from time to time. We will notify you of significant changes by email or in-platform notice. Continued use after changes constitutes acceptance.`,
  },
  {
    title: '10. Contact',
    body: `For privacy enquiries, contact privacy@rugendorwanda.rw or write to: Rugendo Rwanda, KN 5 Road, Kigali, Rwanda.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div>
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page">
          <span className="badge-accent mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-slate-300">Last updated: April 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
