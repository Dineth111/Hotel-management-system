import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, MessageCircle, Sparkles, CheckCircle2, Ticket, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatWhatsAppUrl } from '../utils/whatsapp';

const ADD_ONS_CATALOG = [
  { name: 'Airport Transfer', price: 5000, desc: 'Private airport shuttle' },
  { name: 'Half-Board Meals', price: 3500, desc: 'LKR 3,500/day premium dining', perDay: true },
  { name: 'Romantic Welcome', price: 4000, desc: 'Flowers & fruit welcome platter' }
];

const BookingSidebarCard = ({
  room,
  settings,
  user,
  bookingForm,
  setBookingForm,
  handleBookingSubmit,
  costCalculation
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validating, setValidating] = useState(false);

  const handleAddOnToggle = (name) => {
    const cur = bookingForm.addOns || [];
    setBookingForm({ ...bookingForm, addOns: cur.includes(name) ? cur.filter(a => a !== name) : [...cur, name] });
  };

  const baseRoomTotal = costCalculation ? costCalculation.totalAmount : 0;
  const nights = costCalculation ? costCalculation.nights : 0;
  const selectedAddOns = bookingForm.addOns || [];
  const addOnsTotal = selectedAddOns.reduce((total, name) => {
    const item = ADD_ONS_CATALOG.find(a => a.name === name);
    return total + (item ? (item.perDay ? item.price * nights : item.price) : 0);
  }, 0);

  const discountAmount = appliedCoupon ? Math.min(baseRoomTotal, appliedCoupon.discountType === 'percentage' ? Math.round((baseRoomTotal * appliedCoupon.discountValue) / 100) : appliedCoupon.discountValue) : 0;
  const finalTotalAmount = baseRoomTotal - discountAmount + addOnsTotal;

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setValidating(true);
    try {
      const res = await axios.post('/coupons/validate', { code: couponInput, roomPrice: baseRoomTotal });
      setAppliedCoupon(res.data);
      setBookingForm(prev => ({ ...prev, couponCode: res.data.code }));
      toast.success(`Coupon applied: LKR ${res.data.discountAmount} off!`);
    } catch (err) {
      setAppliedCoupon(null);
      setBookingForm(prev => ({ ...prev, couponCode: '' }));
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setBookingForm(prev => ({ ...prev, couponCode: '' }));
    toast.success('Coupon removed');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rate per Night</span>
          <span className="text-2xl font-extrabold text-slate-800">LKR {room.pricePerNight}</span>
        </div>

        {room.status === 'Maintenance' ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-start space-x-3 border border-red-100 text-xs font-semibold">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>Currently undergoing maintenance and bookings are disabled.</span>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-5">
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

            {costCalculation && (
              <div className="space-y-2.5 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-luxury-500" /><span>Optional Add-on Packages</span></label>
                <div className="space-y-2">
                  {ADD_ONS_CATALOG.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.name);
                    const displayPrice = addon.perDay ? addon.price * nights : addon.price;
                    return (
                      <div key={addon.name} onClick={() => handleAddOnToggle(addon.name)} className={`flex items-start justify-between p-3 rounded-2xl border text-xs cursor-pointer transition-all ${isChecked ? 'border-primary-500 bg-primary-50/20' : 'border-slate-100 hover:border-slate-200 bg-slate-50/20'}`}>
                        <div className="space-y-0.5 pr-2">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">{isChecked && <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />}<span>{addon.name}</span></p>
                          <p className="text-[10px] text-slate-400 font-semibold">{addon.desc}</p>
                        </div>
                        <span className="font-bold text-slate-800 shrink-0">LKR {displayPrice.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {costCalculation && (
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Ticket className="h-3.5 w-3.5 text-primary-500" /><span>Promo Code</span></label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-xs">
                    <span className="font-bold text-emerald-800">Code: {appliedCoupon.code} ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `LKR ${appliedCoupon.discountValue}`} off)</span>
                    <button type="button" onClick={handleRemoveCoupon} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" placeholder="ENTER CODE" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none" />
                    <button type="button" disabled={validating || !couponInput} onClick={handleApplyCoupon} className="bg-slate-900 hover:bg-primary-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-4 rounded-xl text-xs transition-smooth">{validating ? '...' : 'Apply'}</button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Name Info</label>
                <input type="text" required value={bookingForm.customerName} onChange={e => setBookingForm({ ...bookingForm, customerName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex justify-between items-center">
                  <span className="text-emerald-700">Phone Info (WhatsApp-Available Only)</span>
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold animate-pulse">Required</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ENTER ONLY WHATSAPP AVAILABLE NUMBER"
                  value={bookingForm.customerPhone}
                  onChange={e => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 placeholder:text-red-400/80 font-bold"
                />
                <p className="text-[9px] text-red-500 font-bold leading-relaxed flex items-center gap-1">
                  ⚠️ ENTER ONLY WHATSAPP AVAILABLE NUMBER (Notifications will be sent via WhatsApp)
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Info</label>
                <input type="email" required value={bookingForm.customerEmail} onChange={e => setBookingForm({ ...bookingForm, customerEmail: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
              </div>
            </div>

            {costCalculation && (
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-2.5 text-xs font-bold">
                <div className="flex justify-between text-slate-500"><span>Room Charge ({nights} nights)</span><span>LKR {baseRoomTotal.toLocaleString()}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount Applied</span><span>- LKR {discountAmount.toLocaleString()}</span></div>}
                {addOnsTotal > 0 && <div className="flex justify-between text-primary-600"><span>Add-ons Total</span><span>+ LKR {addOnsTotal.toLocaleString()}</span></div>}
                <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm text-slate-800 font-extrabold"><span>Total Amount</span><span>LKR {finalTotalAmount.toLocaleString()}</span></div>
              </div>
            )}

            <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-smooth text-xs text-center block">
              {user ? 'Request Booking (Pending)' : 'Login & Request Booking'}
            </button>
          </form>
        )}

        {settings && settings.whatsapp && (
          <div className="border-t border-slate-100 pt-4">
            <a 
              href={formatWhatsAppUrl(settings.whatsapp, `I want to book the ${room.name}`)} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full flex items-center justify-center space-x-2 border border-emerald-500 hover:bg-emerald-50 text-emerald-600 font-bold py-3.5 px-4 rounded-xl transition-smooth text-xs shadow-sm"
            >
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
