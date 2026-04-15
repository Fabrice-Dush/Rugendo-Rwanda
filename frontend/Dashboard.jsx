import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, API } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const LINKS = [
  { to: '/company', icon: '📊', label: 'Dashboard' },
  { to: '/company/routes', icon: '🗺️', label: 'My Routes' },
  { to: '/company/schedules', icon: '📅', label: 'Schedules' },
  { to: '/company/buses', icon: '🚌', label: 'My Buses' },
  { to: '/company/bookings', icon: '🎫', label: 'Bookings' },
];

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_bookings: 0, confirmed_bookings: 0, total_revenue: 0, total_routes: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/bookings/company/all').catch(() => ({ data: [] })),
    ]).then(([bRes]) => {
      setBookings(bRes.data);
      setStats({
        total_bookings: bRes.data.length,
        confirmed_bookings: bRes.data.filter(b => b.status === 'confirmed').length,
        pending_bookings: bRes.data.filter(b => b.status === 'pending').length,
        total_revenue: bRes.data.filter(b => b.status === 'confirmed').reduce((s, b) => s + parseFloat(b.total_fare || 0), 0),
      });
    }).finally(() => setLoading(false));
  }, []);

  const statusMap = { confirmed: 'badge-green', pending: 'badge-yellow', cancelled: 'badge-red' };

  return (
    <div className="layout-sidebar">
      <Sidebar links={LINKS} subtitle="Company Panel" />
      <div className="sidebar-main">
        {/* Top bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid var(--border)', padding: '0 28px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Company Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{user?.full_name}</span>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary-light),var(--primary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {user?.full_name?.charAt(0)}
            </div>
          </div>
        </div>

        <div className="sidebar-main-content">
          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: 28 }}>
            {[
              { icon: '🎫', label: 'Total Bookings', value: stats.total_bookings, color: 'rgba(0,161,222,0.12)' },
              { icon: '✅', label: 'Confirmed', value: stats.confirmed_bookings, color: 'rgba(0,135,81,0.12)' },
              { icon: '⏳', label: 'Pending', value: stats.pending_bookings || 0, color: 'rgba(250,210,1,0.18)' },
              { icon: '💰', label: 'Revenue', value: stats.total_revenue.toLocaleString() + ' RWF', color: 'rgba(103,58,183,0.10)', small: true },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: s.color, fontSize: 22 }}>{s.icon}</div>
                <div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={s.small ? { fontSize: '1rem' } : {}}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent bookings table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Recent Bookings</h3>
              <Link to="/company/bookings" className="btn btn-sm btn-outline">View All</Link>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 30 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Passenger</th>
                      <th>Route</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 8).length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No bookings yet</td></tr>
                    ) : bookings.slice(0, 8).map(b => (
                      <tr key={b.id}>
                        <td><code style={{ color: 'var(--primary)', fontWeight: 700 }}>{b.booking_reference}</code></td>
                        <td>{b.passenger_name}</td>
                        <td style={{ fontSize: 13 }}>{b.origin} → {b.destination}</td>
                        <td>{b.travel_date}</td>
                        <td style={{ fontWeight: 700 }}>{parseInt(b.total_fare).toLocaleString()} RWF</td>
                        <td><span className={`badge ${statusMap[b.status] || 'badge-gray'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}