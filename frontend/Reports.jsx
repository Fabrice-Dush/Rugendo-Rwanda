import React, { useState, useEffect } from 'react';
import { API } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const LINKS = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/companies', icon: '🏢', label: 'Companies' },
  { to: '/admin/bookings', icon: '🎫', label: 'Bookings' },
  { to: '/admin/reports', icon: '📈', label: 'Reports' },
];

const COLORS = ['#00A1DE', '#008751', '#FAD201', '#E53935', '#673AB7', '#FF9800'];

// Mock chart data (replace with real API data)
const REVENUE_DATA = [
  { month: 'Jan', revenue: 850000, bookings: 142 },
  { month: 'Feb', revenue: 1200000, bookings: 198 },
  { month: 'Mar', revenue: 980000, bookings: 167 },
  { month: 'Apr', revenue: 1450000, bookings: 234 },
  { month: 'May', revenue: 1680000, bookings: 278 },
  { month: 'Jun', revenue: 2100000, bookings: 342 },
];

const ROUTE_DATA = [
  { route: 'Kigali→Musanze', bookings: 340 },
  { route: 'Kigali→Rubavu', bookings: 280 },
  { route: 'Kigali→Huye', bookings: 220 },
  { route: 'Kigali→Rwamagana', bookings: 180 },
  { route: 'Kigali→Rusizi', bookings: 150 },
  { route: 'Kigali→Ngoma', bookings: 120 },
];

const PAYMENT_DATA = [
  { name: 'MTN MoMo', value: 52 },
  { name: 'Airtel Money', value: 28 },
  { name: 'Bank Card', value: 12 },
  { name: 'Cash', value: 8 },
];

export default function AdminReports() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout-sidebar">
      <Sidebar links={LINKS} subtitle="Admin Panel" />
      <div className="sidebar-main">
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid var(--border)', padding: '0 28px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>📈 Reports & Analytics</div>
          <button className="btn btn-primary btn-sm">⬇️ Export CSV</button>
        </div>
        <div className="sidebar-main-content">
          {/* Summary stats */}
          <div className="grid-4" style={{ marginBottom: 28 }}>
            {[
              { label: 'Revenue (This Month)', value: '2,100,000 RWF', icon: '💰', color: 'rgba(0,135,81,0.12)' },
              { label: 'Bookings (This Month)', value: '342', icon: '🎫', color: 'rgba(0,161,222,0.12)' },
              { label: 'Avg. Booking Value', value: '6,140 RWF', icon: '📊', color: 'rgba(250,210,1,0.18)' },
              { label: 'Growth Rate', value: '+25%', icon: '📈', color: 'rgba(103,58,183,0.10)' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: s.color, fontSize: 22 }}>{s.icon}</div>
                <div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ fontSize: '1.1rem' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 20 }}>📊 Monthly Revenue & Bookings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={v => (v/1000000).toFixed(1) + 'M'} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val, name) => name === 'revenue' ? [val.toLocaleString() + ' RWF', 'Revenue'] : [val, 'Bookings']} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#00A1DE" radius={[6, 6, 0, 0]} name="Revenue (RWF)" />
                <Bar yAxisId="right" dataKey="bookings" fill="#008751" radius={[6, 6, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid-2" style={{ gap: 24 }}>
            {/* Top routes */}
            <div className="card">
              <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 20 }}>🗺️ Top Routes by Bookings</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ROUTE_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="route" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#FAD201" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payment methods pie */}
            <div className="card">
              <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 20 }}>💳 Payment Methods Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={PAYMENT_DATA} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine>
                    {PAYMENT_DATA.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={val => [`${val}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                {PAYMENT_DATA.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i] }} />
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}