import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

// Customer Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import About from './pages/About';
import Location from './pages/Location';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPendingBookings from './pages/admin/AdminPendingBookings';
import AdminAllBookings from './pages/admin/AdminAllBookings';
import AdminRooms from './pages/admin/AdminRooms';
import AdminRoomsEdit from './pages/admin/AdminRoomsEdit';
import AdminContactMessages from './pages/admin/AdminContactMessages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';

// Route Guards
const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 font-semibold">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 font-semibold">Loading session...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

// Admin Unified Panel Layout Wrapper
const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f4f7f5] w-full">
      <AdminSidebar />
      <main className="flex-grow p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

// Layout orchestrator to toggle Navbar & Footer based on path
const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f5] text-slate-800">
      {!isAdminPath && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          <Route path="/my-bookings" element={<CustomerRoute><MyBookings /></CustomerRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/bookings/pending" element={<AdminRoute><AdminLayout><AdminPendingBookings /></AdminLayout></AdminRoute>} />
          <Route path="/admin/bookings/all" element={<AdminRoute><AdminLayout><AdminAllBookings /></AdminLayout></AdminRoute>} />
          <Route path="/admin/rooms" element={<AdminRoute><AdminLayout><AdminRooms /></AdminLayout></AdminRoute>} />
          <Route path="/admin/rooms/edit/:id" element={<AdminRoute><AdminLayout><AdminRoomsEdit /></AdminLayout></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminLayout><AdminReviews /></AdminLayout></AdminRoute>} />
          <Route path="/admin/contact-messages" element={<AdminRoute><AdminLayout><AdminContactMessages /></AdminLayout></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
    </AuthProvider>
  );
}

export default App;
