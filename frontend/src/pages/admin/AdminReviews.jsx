import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Check, Trash2, Clock, MessageSquare, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/reviews/admin');
      setReviews(res.data);
    } catch (err) {
      toast.error('Failed to load guest reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`/reviews/admin/${id}/approve`);
      toast.success(res.data.message || 'Review approved successfully!');
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this guest review?')) return;
    try {
      await axios.delete(`/reviews/admin/${id}`);
      toast.success('Review removed successfully');
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => !r.isApproved);
  const approvedReviews = reviews.filter(r => r.isApproved);

  return (
    <div className="space-y-8 font-sans pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Guest Feedback Moderation</h1>
        <p className="text-slate-500 text-xs">Moderate reviews left by checked-out guests before they display on room pages.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Reviews</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{reviews.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Awaiting Approval</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingReviews.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Approved & Active</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedReviews.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Check className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-700 font-bold text-sm">No reviews found</p>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">No feedback has been submitted by customers yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div 
              key={review._id} 
              className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-smooth relative overflow-hidden ${
                !review.isApproved ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-emerald-500'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight">{review.customerName}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      Reviewed: {review.roomId?.name || 'Deleted Room'}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                    review.isApproved 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {review.isApproved ? <Check className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                    <span>{review.isApproved ? 'Approved' : 'Pending'}</span>
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`h-4.5 w-4.5 ${
                        s <= review.rating 
                          ? 'fill-luxury-400 text-luxury-400' 
                          : 'text-slate-200'
                      }`} 
                    />
                  ))}
                </div>

                <p className="text-slate-600 text-xs leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 mt-5 pt-4">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Submitted: {new Date(review.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex items-center gap-2">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-smooth flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3 w-3" />
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-smooth cursor-pointer"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
