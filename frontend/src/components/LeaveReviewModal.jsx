import React, { useState } from 'react';
import axios from 'axios';
import { Star, X, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeaveReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post('/reviews', {
        bookingId: booking._id,
        rating,
        comment
      });
      toast.success(res.data.message || 'Review submitted successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 border border-slate-100 rounded-3xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden font-sans">
        
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary-100/40 blur-2xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-smooth cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Guest Feedback</span>
            <h2 className="text-2xl font-display font-bold text-slate-900">Share Your Experience</h2>
            <p className="text-slate-500 text-xs">
              Reviewing your stay in the <span className="font-semibold text-slate-700">{booking.roomId?.name}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Rating Selector */}
            <div className="space-y-2 text-center bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Your Rating</label>
              <div className="flex justify-center items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isActive = (hoverRating || rating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-smooth cursor-pointer"
                    >
                      <Star 
                        className={`h-8 w-8 transition-colors ${
                          isActive 
                            ? 'fill-luxury-400 text-luxury-400 scale-110' 
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] font-semibold text-luxury-600 mt-1">
                {rating === 5 && 'Excellent - Unmatched Luxury'}
                {rating === 4 && 'Very Good - Highly Recommended'}
                {rating === 3 && 'Good - Comfortable Stay'}
                {rating === 2 && 'Fair - Could Be Improved'}
                {rating === 1 && 'Poor - Dissatisfying'}
              </p>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Write Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you loved, or what we can improve to make your next stay next-level..."
                rows="4"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm resize-none bg-slate-50/20 font-medium"
                maxLength="500"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold px-1">
                <span>All reviews are moderated by hotel admin.</span>
                <span>{comment.length}/500</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-smooth disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Review...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewModal;
