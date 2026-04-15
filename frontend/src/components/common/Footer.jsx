import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  'Book travel': [
    { to: '/search',      label: 'Search trips' },
    { to: '/routes',      label: 'All routes' },
    { to: '/how-it-works',label: 'How it works' },
    { to: '/faq',         label: 'FAQ' },
  ],
  'Company': [
    { to: '/about',   label: 'About us' },
    { to: '/contact', label: 'Contact' },
  ],
  'Legal': [
    { to: '/terms',          label: 'Terms of Service' },
    { to: '/privacy',        label: 'Privacy Policy' },
    { to: '/booking-policy', label: 'Booking Policy' },
  ],
  'Account': [
    { to: '/login',    label: 'Sign in' },
    { to: '/register', label: 'Create account' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0e0a1f] text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span
              className="text-xl font-extrabold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #9b72ff 0%, #fa26ae 100%)' }}
            >
              Rugendo Rwanda
            </span>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Rwanda's online intercity bus booking platform. Search, book, and board — all digital.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">{heading}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-[#2d1a5e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rugendo Rwanda. All rights reserved.</p>
          <p>Kigali, Rwanda · support@rugendorwanda.rw</p>
        </div>
      </div>
    </footer>
  );
}
