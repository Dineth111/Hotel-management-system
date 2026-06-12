import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Calendar, User, Info, AlertOctagon, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPendingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');

  const fetchPending = async () => {
    try {
      const res = await axios.get('/admin/bookings?status=Pending');
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load pending bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`/admin/bookings/${id}/approve`);
      toast.success(res.data.message || 'Booking approved successfully!');
      fetchPending();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Approval failed';
      toast.error(errMsg);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return toast.error('Rejection reason is required');

    try {
      const res = await axios.put(`/admin/bookings/${rejectId}/reject`, { rejectionReason: reason });
      toast.success(res.data.message || 'Booking rejected successfully');
      setRejectId(null);
      setReason('');
      fetchPending();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rejection failed');
    }
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
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Pending Bookings</h1>
        <p className="text-slate-500 text-sm">Review incoming reservation requests, authorize check-ins, or manage conflicts.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Info className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-700 font-bold text-sm">No pending approvals</p>
            <p className="text-slate-400 text-xs">All room reservation requests are completely processed.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4.5">ID</th>
                  <th className="px-6 py-4.5">Customer Details</th>
                  <th className="px-6 py-4.5">Room Details</th>
                  <th className="px-6 py-4.5">Booking Window</th>
                  <th className="px-6 py-4.5">Total Fare</th>
                  <th className="px-6 py-4.5 text-center">Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-5 font-mono text-slate-400 font-bold">{booking.bookingId}</td>
                    <td className="px-6 py-5 space-y-1">
                      <p className="font-bold text-slate-800 text-sm leading-tight">{booking.customerName}</p>
                      <p className="text-slate-500 font-medium">{booking.customerEmail}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-semibold">{booking.customerPhone}</span>
                        <a
                          href={`sms:${booking.customerPhone.replace(/\D/g, '')}?body=Hello%20${encodeURIComponent(booking.customerName)}%2C%20this%20is%20Hotel%20Lanka%20Pro.%20We%20received%20your%20booking%20request%20${booking.bookingId}%20for%20the%20${encodeURIComponent(booking.roomId?.name || '')}.%20It%20is%20currently%20under%20review.`}
                          className="inline-flex items-center text-[9px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-1.5 py-0.5 rounded-md transition-smooth"
                          title="Send SMS notification"
                        >
                          <MessageSquare className="h-3 w-3 shrink-0" />
                          <span>Send SMS</span>
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-5 space-y-1">
                      <p className="font-bold text-slate-800 text-sm leading-tight">{booking.roomId?.name || 'Deleted Room'}</p>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Suite: {booking.roomId?.roomNumber || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5 space-y-1">
                      <p className="font-bold text-slate-800">{new Date(booking.checkIn).toLocaleDateString()} &rarr; {new Date(booking.checkOut).toLocaleDateString()}</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{booking.nights} nights &middot; {booking.guests} guests</p>
                    </td>
                    <td className="px-6 py-5 font-extrabold text-slate-900 text-sm">LKR {booking.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center space-x-2.5">
                        <button
                          onClick={() => handleApprove(booking._id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-smooth shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/25"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setRejectId(booking._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl transition-smooth shadow-sm shadow-red-500/10 hover:shadow-red-500/25"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejection Modal Dialog */}
      {rejectId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleRejectSubmit} className="bg-white max-w-md w-full p-7 rounded-3xl border border-slate-100 shadow-2xl border-l-4 border-l-red-500 space-y-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Decline Request</h3>
                <p className="text-slate-500 text-xs">Please provide a reason. This comment will be emailed to the client.</p>
              </div>
            </div>

            <textarea
              required
              rows="3"
              placeholder="e.g. Schedule conflicts or room maintenance check."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs font-semibold focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none transition-smooth placeholder:text-slate-400"
            ></textarea>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => { setRejectId(null); setReason(''); }}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-smooth border border-slate-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-smooth"
              >
                Reject Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPendingBookings;
