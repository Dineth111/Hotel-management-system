import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle2, Clock, AlertTriangle, XCircle, FileText, Info, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LeaveReviewModal from '../components/LeaveReviewModal';

const STATUS_CONFIGS = {
  Pending: { badgeClass: "bg-amber-50 text-amber-700 border-amber-200/60", borderAccent: "border-l-amber-500", icon: Clock },
  Approved: { badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60", borderAccent: "border-l-emerald-500", icon: CheckCircle2 },
  Confirmed: { badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60", borderAccent: "border-l-emerald-500", icon: CheckCircle2 },
  CheckedIn: { badgeClass: "bg-blue-50 text-blue-700 border-blue-200/60", borderAccent: "border-l-blue-500", icon: Info },
  CheckedOut: { badgeClass: "bg-slate-50 text-slate-600 border-slate-200/60", borderAccent: "border-l-slate-400", icon: FileText },
  Cancelled: { badgeClass: "bg-red-50 text-red-700 border-red-200/60", borderAccent: "border-l-red-500", icon: XCircle }
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activeCount = bookings.filter(b => ['Approved', 'Confirmed', 'CheckedIn'].includes(b.status)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 font-sans">
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-primary-500">Reservation Desk</span>
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">My Booking History</h1>
        <p className="text-slate-500 text-sm">View details, track approval states, and review your previous stays with us.</p>
      </div>

      {bookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Reservations</span>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{bookings.length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Approvals</span>
              <p className="text-3xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Confirmed Stays</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-700 font-bold text-sm">No reservations found</p>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">You haven't made any booking requests yet. Discover our premium rooms and start planning your perfect stay.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const config = STATUS_CONFIGS[booking.status] || STATUS_CONFIGS.Cancelled;
            const StatusIcon = config.icon;
            return (
              <div
                key={booking._id}
                className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-l-4 ${config.borderAccent} hover:shadow-md transition-smooth`}
              >
                <div className="space-y-4 flex-grow">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 font-mono tracking-tight">{booking.bookingId}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 flex items-center gap-1 ${config.badgeClass}`}>
                      <StatusIcon className="h-3 w-3" />
                      <span>{booking.status === 'CheckedIn' ? 'Checked In' : booking.status === 'CheckedOut' ? 'Checked Out' : booking.status}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{booking.roomId?.name || 'Deleted Room Listing'}</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      Room {booking.roomId?.roomNumber || 'N/A'} &middot; {booking.roomId?.type || 'N/A'} Class
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600 pt-1">
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Check-In</span>
                      <span className="font-bold text-slate-800">{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Check-Out</span>
                      <span className="font-bold text-slate-800">{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Nights</span>
                      <span className="font-bold text-slate-800">{booking.nights}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Guests</span>
                      <span className="font-bold text-slate-800">{booking.guests}</span>
                    </div>
                  </div>

                  {booking.status === 'CheckedOut' && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowReviewModal(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-luxury-400 to-luxury-500 hover:from-luxury-500 hover:to-luxury-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-sm hover:shadow transition-smooth cursor-pointer flex items-center gap-1.5"
                      >
                        <Star className="h-3.5 w-3.5 fill-white" />
                        Leave a Review
                      </button>
                    </div>
                  )}

                  {booking.status === 'Cancelled' && booking.rejectionReason && (
                    <div className="bg-red-50/50 text-red-800 p-3.5 rounded-2xl flex items-start space-x-2.5 border border-red-100/60 text-xs">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                      <div>
                        <span className="font-bold text-red-900">Cancellation/Rejection Details:</span>
                        <p className="mt-1 text-red-700 leading-relaxed font-medium">{booking.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 md:border-t-0 md:pt-0 shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center md:h-24 min-w-[150px]">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total Charge</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-0.5">LKR {booking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-1">
                    Req: {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showReviewModal && selectedBooking && (
        <LeaveReviewModal
          booking={selectedBooking}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedBooking(null);
          }}
          onSuccess={() => {
            setShowReviewModal(false);
            setSelectedBooking(null);
            fetchMyBookings(); // refresh page data
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;
