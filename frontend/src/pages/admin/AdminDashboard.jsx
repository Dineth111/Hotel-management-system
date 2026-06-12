import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BedDouble, CalendarClock, LogIn, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminAnalyticsSection from '../../components/AdminAnalyticsSection';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    pendingCount: 0,
    todayCheckIns: 0,
    monthlyRevenue: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          axios.get('/rooms'),
          axios.get('/admin/bookings/all')
        ]);

        const rooms = roomsRes.data;
        const bookings = bookingsRes.data;

        const todayStr = new Date().toDateString();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let pendingCount = 0;
        let todayCheckIns = 0;
        let monthlyRevenue = 0;

        bookings.forEach((booking) => {
          if (booking.status === 'Pending') {
            pendingCount++;
          }

          if (new Date(booking.checkIn).toDateString() === todayStr && booking.status !== 'Cancelled') {
            todayCheckIns++;
          }

          const bookingDate = new Date(booking.createdAt);
          const isActive = ['Approved', 'Confirmed', 'CheckedIn', 'CheckedOut'].includes(booking.status);
          
          if (isActive && bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
            monthlyRevenue += booking.totalAmount;
          }
        });

        setStats({
          totalRooms: rooms.length,
          pendingCount,
          todayCheckIns,
          monthlyRevenue
        });

        // Store the 3 most recent reservations
        setRecentBookings(bookings.slice(0, 3));

      } catch (err) {
        toast.error('Failed to compute dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const statCards = [
    { name: 'Total Rooms', value: stats.totalRooms, icon: BedDouble, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Pending Bookings', value: stats.pendingCount, icon: CalendarClock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: "Today's Check-Ins", value: stats.todayCheckIns, icon: LogIn, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { name: 'Monthly Revenue', value: `LKR ${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-luxury-600 bg-luxury-50 border-luxury-100' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans pb-12">
      {/* Premium Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 rounded-[2rem] border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full filter blur-3xl -z-0"></div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-luxury-300" />
            <span>Resort Console Portal</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-white leading-tight">Welcome Back, Admin</h1>
          <p className="text-slate-400 text-xs font-medium max-w-lg leading-relaxed">
            Here is your live occupancy state, revenue achievement parameters, and recent reservation queue records.
          </p>
        </div>
        <div className="shrink-0 text-left md:text-right text-xs text-slate-400 font-bold bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur">
          <p className="uppercase tracking-widest text-[9px] text-luxury-300">Live Server Time</p>
          <p className="text-white text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-smooth">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.name}</p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Admin Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Operations Shortcuts</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Manage Suites', path: '/admin/rooms', icon: BedDouble, color: 'hover:border-primary-400 hover:bg-primary-50/20 text-primary-600 bg-white' },
            { label: 'Pending Bookings', path: '/admin/bookings/pending', icon: CalendarClock, color: 'hover:border-amber-400 hover:bg-amber-50/20 text-amber-600 bg-white' },
            { label: 'Guest Messages', path: '/admin/contact-messages', icon: LogIn, color: 'hover:border-blue-400 hover:bg-blue-50/20 text-blue-600 bg-white' },
            { label: 'Resort Settings', path: '/admin/settings', icon: Sparkles, color: 'hover:border-luxury-400 hover:bg-luxury-50/20 text-luxury-600 bg-white' }
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} to={action.path} className={`flex items-center space-x-3.5 p-4.5 border border-slate-150/40 rounded-2xl shadow-sm transition-smooth ${action.color}`}>
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Target Progress Bars */}
      <AdminAnalyticsSection
        monthlyRevenue={stats.monthlyRevenue}
        todayCheckIns={stats.todayCheckIns}
        totalRooms={stats.totalRooms}
      />

      {/* Recent Reservations Activity */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Reservations Activity</h3>
          <Link to="/admin/bookings/all" className="text-[10px] font-bold text-primary-500 hover:underline uppercase tracking-wide">View All Bookings</Link>
        </div>
        
        <div className="divide-y divide-slate-100">
          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No recent bookings recorded.</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b._id} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">{b.customerName} <span className="font-medium text-slate-400">({b.bookingId})</span></p>
                  <p className="text-slate-500 text-[10px]">{new Date(b.checkIn).toLocaleDateString()} to {new Date(b.checkOut).toLocaleDateString()} | {b.guests} Guests</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0">
                  <span className="font-bold text-slate-800">LKR {b.totalAmount.toLocaleString()}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                    b.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    ['Approved', 'Confirmed', 'CheckedIn', 'CheckedOut'].includes(b.status) ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>{b.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
