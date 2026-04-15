import React, { useState } from 'react';

const CONTACT_INFO = [
  { icon: '📍', label: 'Address',      value: 'KN 5 Road, Kigali, Rwanda' },
  { icon: '📧', label: 'Email',        value: 'support@rugendorwanda.rw' },
  { icon: '📞', label: 'Phone',        value: '+250 788 000 000' },
  { icon: '🕒', label: 'Support hours',value: 'Mon–Sat, 7:00 AM – 8:00 PM' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to contact API endpoint
    setSubmitted(true);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-page text-center">
          <span className="badge-accent mb-4">Get in touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact us</h1>
          <p className="text-slate-300 text-lg max-w-lg mx-auto">
            Have a question about your booking? Need help with a trip? We're here.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid md:grid-cols-5 gap-10">

            {/* Contact info */}
            <div className="md:col-span-2 space-y-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reach us directly</h2>
              {CONTACT_INFO.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-xl shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wide">{c.label}</p>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-[#e8e3ff] dark:border-[#2d1a5e]">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  For booking issues, please have your booking reference number ready when contacting support.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3">
              <div className="card">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message sent</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="btn-secondary mt-6"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Send a message</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Your name</label>
                        <input name="name" value={form.name} onChange={handleChange} required placeholder="Jean-Pierre Nkurunziza" className="input" />
                      </div>
                      <div>
                        <label className="label">Email address</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="input" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} required className="input">
                        <option value="">Select a topic…</option>
                        <option value="booking">Booking issue</option>
                        <option value="payment">Payment problem</option>
                        <option value="refund">Refund request</option>
                        <option value="schedule">Schedule inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Message</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe your issue or question in detail…"
                        className="input resize-none"
                      />
                    </div>
                    <button type="submit" className="btn-gradient w-full">Send message</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
