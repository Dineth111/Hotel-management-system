import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Plus, Trash2, Calendar, DollarSign, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiresAt: ''
  });

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/coupons/admin');
      setCoupons(res.data);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue || !form.expiresAt) {
      return toast.error('Please fill in all coupon fields');
    }

    try {
      await axios.post('/coupons/admin', form);
      toast.success('Coupon created successfully!');
      setForm({ code: '', discountType: 'percentage', discountValue: '', expiresAt: '' });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await axios.delete(`/coupons/admin/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
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
    <div className="space-y-8 font-sans pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Promo Codes Manager</h1>
        <p className="text-slate-500 text-xs">Create, inspect, or delete discount coupon codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-primary-500" />
            <span>Create Promo Code</span>
          </h2>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Coupon Code</label>
            <input type="text" placeholder="SUMMER20" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Type</label>
              <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat LKR</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Value</label>
              <input type="number" min="1" placeholder={form.discountType === 'percentage' ? '20' : '2000'} value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Expiration Date</label>
            <input type="date" min={new Date().toISOString().split('T')[0]} value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none" required />
          </div>

          <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl shadow text-xs transition-smooth">
            Create Code
          </button>
        </form>

        {/* Coupon Code List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="h-4 w-4 text-primary-500" />
            <span>Active Coupons List</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3">Code</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Discount</th>
                  <th className="py-3">Expires</th>
                  <th className="py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-bold">No coupons listed.</td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/20">
                      <td className="py-3.5 font-bold text-slate-800 tracking-wider uppercase">{c.code}</td>
                      <td className="py-3.5 uppercase">{c.discountType}</td>
                      <td className="py-3.5 font-bold text-slate-800 flex items-center gap-0.5 mt-1">
                        {c.discountType === 'percentage' ? <Percent className="h-3.5 w-3.5 text-slate-400" /> : <DollarSign className="h-3.5 w-3.5 text-slate-400" />}
                        <span>{c.discountValue.toLocaleString()}</span>
                      </td>
                      <td className="py-3.5 flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{new Date(c.expiresAt).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3.5 text-center">
                        <button type="button" onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-xl">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
