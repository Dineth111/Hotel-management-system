import React from 'react';
import { ShieldAlert, MessageCircle } from 'lucide-react';

const BookingSidebarCard = ({
  room,
  settings,
  user,
  bookingForm,
  setBookingForm,
  handleBookingSubmit,
  costCalculation
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rate per Night</span>
          <span className="text-2xl font-extrabold text-slate-800">LKR {room.pricePerNight}</span>
        </div>

        {room.status === 'Maintenance' ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-start space-x-3 border border-red-100 text-xs leading-relaxed font-semibold">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>Currently undergoing maintenance and bookings are disabled.</span>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Check-In</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={bookingForm.checkIn} onChange={e => setBookingForm({ ...bookingForm, checkIn: e.target.value })} onClick={e => e.target.showPicker?.()} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Check-Out</label>
                <input type="date" required min={bookingForm.checkIn || new Date().toISOString().split('T')[0]} value={bookingForm.checkOut} onChange={e => setBookingForm({ ...bookingForm, checkOut: e.target.value })} onClick={e => e.target.showPicker?.()} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Guests count</label>
              <input type="number" required min="1" max={room.capacity} value={bookingForm.guests} onChange={e => setBookingForm({ ...bookingForm, guests: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none" />
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              {['customerName', 'customerPhone', 'customerEmail'].map(field => (
                <div key={field} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{field.replace('customer', '')} Info</label>
                  <input type={field === 'customerEmail' ? 'email' : 'text'} required value={bookingForm[field]} onChange={e => setBookingForm({ ...bookingForm, [field]: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
              ))}
            </div>

            {costCalculation && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs font-bold">
                <div className="flex justify-between text-slate-500">
                  <span>LKR {room.pricePerNight} x {costCalculation.nights} nights</span>
                  <span>LKR {costCalculation.totalAmount}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm text-slate-800 font-extrabold">
                  <span>Total Amount</span>
                  <span>LKR {costCalculation.totalAmount}</span>
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-smooth text-xs text-center block">
              {user ? 'Request Booking (Pending)' : 'Login & Request Booking'}
            </button>
          </form>
        )}

        {settings && settings.whatsapp && (
          <div className="border-t border-slate-100 pt-4">
            <a href={`https://wa.me/${settings.whatsapp.replace('+', '')}?text=I%20want%20to%20book%20the%20${encodeURIComponent(room.name)}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center space-x-2 border border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-bold py-3.5 px-4 rounded-xl transition-smooth text-xs shadow-sm">
              <MessageCircle className="h-4.5 w-4.5" />
              <span>Book on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSidebarCard;
