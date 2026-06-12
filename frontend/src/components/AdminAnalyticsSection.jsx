import React from 'react';
import { TrendingUp, BedDouble } from 'lucide-react';

const AdminAnalyticsSection = ({ monthlyRevenue, todayCheckIns, totalRooms }) => {
  const revTarget = 150000;
  const revPercentage = Math.min(Math.round((monthlyRevenue / revTarget) * 100), 100);
  const occupancyPercentage = totalRooms > 0 ? Math.min(Math.round((todayCheckIns / totalRooms) * 100), 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Target Progress Card */}
      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-luxury-500" />
            <span>Revenue Target Achievement</span>
          </h3>
          <span className="text-xs font-bold text-luxury-600 bg-luxury-50 px-2.5 py-0.5 rounded-full border border-luxury-100">{revPercentage}%</span>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-luxury-400 to-luxury-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${revPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <span>LKR 0</span>
            <span>Target LKR {revTarget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Occupancy Progress Card */}
      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <BedDouble className="h-4.5 w-4.5 text-primary-500" />
            <span>Today's Room Occupancy Rate</span>
          </h3>
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">{occupancyPercentage}%</span>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${occupancyPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <span>0% occupied</span>
            <span>100% occupancy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsSection;
