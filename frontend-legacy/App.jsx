import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PassengerDashboard from './pages/passenger/Dashboard';
import SearchRoutes from './pages/passenger/SearchRoutes';
import BookingPage from './pages/passenger/BookingPage';
import MyBookings from './pages/passenger/MyBookings';
import SchedulerPage from './pages/passenger/SchedulerPage';
import CompaniesPage from './pages/passenger/CompaniesPage';
import PaymentPage from './pages/passenger/PaymentPage';
import BookingConfirmation from './pages/passenger/BookingConfirmation';
import CompanyDashboard from './pages/company/Dashboard';
import CompanyRoutes from './pages/company/Routes';
import CompanySchedules from './pages/company/Schedules';
import CompanyBookings from './pages/company/Bookings';
import CompanyBuses from './pages/company/Buses';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCompanies from './pages/admin/Companies';
import AdminBookings from './pages/admin/Bookings';
import AdminReports from './pages/admin/Reports';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<><Navbar /><LandingPage /><Footer /></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/routes" element={<><Navbar /><SearchRoutes /><Footer /></>} />
          <Route path="/companies" element={<><Navbar /><CompaniesPage /><Footer /></>} />
          <Route path="/schedule" element={<><Navbar /><SchedulerPage /><Footer /></>} />
          <Route path="/booking/confirm/:ref" element={<><Navbar /><BookingConfirmation /><Footer /></>} />

          {/* Passenger */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['passenger']}>
              <><Navbar /><PassengerDashboard /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/book/:scheduleId" element={
            <ProtectedRoute roles={['passenger']}>
              <><Navbar /><BookingPage /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute roles={['passenger']}>
              <><Navbar /><MyBookings /><Footer /></>
            </ProtectedRoute>
          } />
          <Route path="/payment/:bookingId" element={
            <ProtectedRoute roles={['passenger']}>
              <><Navbar /><PaymentPage /><Footer /></>
            </ProtectedRoute>
          } />

          {/* Company */}
          <Route path="/company/*" element={
            <ProtectedRoute roles={['company']}>
              <CompanyLayout />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

const CompanyLayout = () => (
  <Routes>
    <Route path="/" element={<CompanyDashboard />} />
    <Route path="/routes" element={<CompanyRoutes />} />
    <Route path="/schedules" element={<CompanySchedules />} />
    <Route path="/bookings" element={<CompanyBookings />} />
    <Route path="/buses" element={<CompanyBuses />} />
  </Routes>
);

const AdminLayout = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/users" element={<AdminUsers />} />
    <Route path="/companies" element={<AdminCompanies />} />
    <Route path="/bookings" element={<AdminBookings />} />
    <Route path="/reports" element={<AdminReports />} />
  </Routes>
);

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}