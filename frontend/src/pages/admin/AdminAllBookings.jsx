import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, LogIn, LogOut, SlidersHorizontal, Info, Download, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { exportBookingsToPDF } from '../../utils/pdfExport';

const AdminAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = async () => {
    try {
      const url = statusFilter ? `/admin/bookings?status=${statusFilter}` : '/admin/bookings/all';
      const res = await axios.get(url);
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleCheckIn = async (id) => {
    try {
      await axios.put(`/admin/bookings/${id}/checkin`);
      toast.success('Guest checked in successfully');
      fetchBookings();
    } catch (err) {
      toast.error('Check-in failed');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.put(`/admin/bookings/${id}/checkout`);
      toast.success('Guest checked out successfully');
      fetchBookings();
    } catch (err) {
      toast.error('Check-out failed');
    }
  };

  const getStatusBadgeClass = (status) => {
    const base = "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ";
    if (status === 'Pending') return base + "bg-amber-50 text-amber-700 border-amber-100";
    if (['Approved', 'Confirmed'].includes(status)) return base + "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === 'CheckedIn') return base + "bg-blue-50 text-blue-700 border-blue-100";
    if (status === 'CheckedOut') return base + "bg-slate-50 text-slate-600 border-slate-200/60";
    return base + "bg-red-50 text-red-700 border-red-100"; // Cancelled
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Reservation Ledger</h1>
          <p className="text-slate-500 text-sm">Browse, filter, and track check-in or checkout states across all bookings.</p>
        </div>
        
        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportBookingsToPDF(bookings)}
            disabled={bookings.length === 0}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-smooth cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          
          <div className="relative flex items-center gap-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-smooth"
            >
              <option value="">All Bookings</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="CheckedIn">Checked In</option>
              <option value="CheckedOut">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Info className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-700 font-bold text-sm">No reservations found</p>
            <p className="text-slate-400 text-xs">There are no records matching the selected filter.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4.5">ID</th>
                  <th className="px-6 py-4.5">Customer details</th>
                  <th className="px-6 py-4.5">Room listing</th>
                  <th className="px-6 py-4.5">Dates / billing</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5 text-center">Lifecycle actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-5 font-mono text-slate-400 font-bold">{booking.bookingId}</td>
                    <td className="px-6 py-5 space-y-1">
                      <p className="font-bold text-slate-800 text-sm leading-tight">{booking.customerName}</p>
                      <p className="text-slate-500 font-medium">{booking.customerEmail}</p>
                      {booking.customerPhone && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold">{booking.customerPhone}</span>
                          <a
                            href={`sms:${booking.customerPhone.replace(/\D/g, '')}?body=Hello%20${encodeURIComponent(booking.customerName)}%2C%20this%20is%20Hotel%20Lanka%20Pro.%20Your%20booking%20${booking.bookingId}%20status%2520is%2520now%2520${booking.status}.`}
                            className="inline-flex items-center text-[9px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-1.5 py-0.5 rounded-md transition-smooth"
                            title="Send SMS notification"
                          >
                            <MessageSquare className="h-3 w-3 shrink-0" />
                            <span>Send SMS</span>
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 space-y-1">
                      <p className="font-bold text-slate-800 text-sm leading-tight">{booking.roomId?.name || 'Deleted Room'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suite: {booking.roomId?.roomNumber || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5 space-y-1">
                      <p className="font-bold text-slate-800">{new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LKR {booking.totalAmount.toLocaleString()} &middot; {booking.nights} nights</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={getStatusBadgeClass(booking.status)}>{booking.status === 'CheckedIn' ? 'Checked In' : booking.status === 'CheckedOut' ? 'Checked Out' : booking.status}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {booking.status === 'Approved' && (
                        <button
                          onClick={() => handleCheckIn(booking._id)}
                          className="bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm hover:shadow flex items-center space-x-1 mx-auto transition-smooth"
                        >
                          <LogIn className="h-3.5 w-3.5 shrink-0" />
                          <span>Check In</span>
                        </button>
                      )}
                      {booking.status === 'CheckedIn' && (
                        <button
                          onClick={() => handleCheckOut(booking._id)}
                          className="bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm hover:shadow flex items-center space-x-1 mx-auto transition-smooth"
                        >
                          <LogOut className="h-3.5 w-3.5 shrink-0" />
                          <span>Check Out</span>
                        </button>
                      )}
                      {!['Approved', 'CheckedIn'].includes(booking.status) && (
                        <span className="text-xs text-slate-350 font-bold">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllBookings;
