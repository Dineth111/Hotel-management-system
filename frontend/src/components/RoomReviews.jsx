import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, Award } from 'lucide-react';

const RoomReviews = ({ roomId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/reviews/room/${roomId}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load room reviews', err);
      } finally {
        setLoading(false);
      }
    };
    if (roomId) fetchReviews();
  }, [roomId]);

  if (loading) {
    return <div className="text-slate-400 text-xs animate-pulse">Loading guest feedback...</div>;
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 pt-4 border-t border-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Guest Experiences</h2>
          <p className="text-slate-500 text-xs">Real experiences shared by our valued guests.</p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
            <div className="text-center">
              <span className="block text-xl font-extrabold text-slate-800 leading-none">{averageRating}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Out of 5</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`h-3.5 w-3.5 ${
                      s <= Math.round(Number(averageRating))
                        ? 'fill-luxury-400 text-luxury-400' 
                        : 'text-slate-200'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500">{reviews.length} Verified Reviews</span>
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 text-center space-y-3">
          <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-slate-700 font-bold text-xs">No reviews yet</p>
            <p className="text-slate-400 text-[10px] max-w-xs mx-auto">Be the first to share your experience with us after your check-out.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((r) => (
            <div 
              key={r._id} 
              className="bg-white border border-slate-100/80 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow transition-smooth"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{r.customerName}</span>
                    <span className="text-[9px] font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                      <Award className="h-2.5 w-2.5" /> Verified Stay
                    </span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Stayed {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`h-3.5 w-3.5 ${
                        s <= r.rating 
                          ? 'fill-luxury-400 text-luxury-400' 
                          : 'text-slate-200'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed italic">
                "{r.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomReviews;
