import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/image';
import ResortHighlights from '../components/ResortHighlights';
import FeaturedRoomsTeaser from '../components/FeaturedRoomsTeaser';
import FeaturedExperiences from '../components/FeaturedExperiences';

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.checkIn || !search.checkOut) return toast.error('Please select Check-In and Check-Out dates');
    if (new Date(search.checkIn) >= new Date(search.checkOut)) return toast.error('Check-Out must be after Check-In');

    setLoading(true);
    try {
      const res = await axios.get('/rooms/available', { params: search });
      setAvailableRooms(res.data);
      setSearched(true);
      if (res.data.length === 0) toast.info('No available rooms matching dates');
      else toast.success(`Found ${res.data.length} available rooms!`);
    } catch (err) {
      toast.error('Availability query failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-24 pb-24 font-sans bg-slate-50/50">
      {/* Luxury Hero Banner */}
      <div className="relative min-h-[650px] flex items-center justify-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
            alt="Hotel Lanka Pro Hero"
            className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-50" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 mt-14">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-luxury-300 uppercase backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-luxury-400" />
            <span>Exclusive Beachfront Paradise</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.15]">
            Experience Sri Lankan Coastal Beauty in <span className="bg-gradient-to-r from-primary-400 via-luxury-300 to-luxury-400 bg-clip-text text-transparent">Pure Luxury</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Welcome to Hotel Lanka Pro. Experience curated ocean-facing suites, warm tropical breezes, and unparalleled island hospitality.
          </p>

          {/* Floating Availability Bar */}
          <form onSubmit={handleSearch} className="bg-white/95 text-slate-800 p-4 sm:p-5 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto border border-white/40 backdrop-blur">
            <div className="flex items-center space-x-3.5 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
              <Calendar className="h-5 w-5 text-primary-500 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Arrival</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={search.checkIn} onChange={e => setSearch({ ...search, checkIn: e.target.value })} onClick={e => e.target.showPicker?.()} className="w-full text-xs font-bold bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-slate-800 cursor-pointer mt-0.5" />
              </div>
            </div>

            <div className="flex items-center space-x-3.5 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
              <Calendar className="h-5 w-5 text-primary-500 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Departure</label>
                <input type="date" required min={search.checkIn || new Date().toISOString().split('T')[0]} value={search.checkOut} onChange={e => setSearch({ ...search, checkOut: e.target.value })} onClick={e => e.target.showPicker?.()} className="w-full text-xs font-bold bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-slate-800 cursor-pointer mt-0.5" />
              </div>
            </div>

            <div className="flex items-center space-x-3.5 w-full px-4 py-2">
              <Users className="h-5 w-5 text-primary-500 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Guests</label>
                <input type="number" required min="1" max="10" value={search.guests} onChange={e => setSearch({ ...search, guests: Number(e.target.value) })} className="w-full text-xs font-bold bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-slate-800 mt-0.5" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full md:w-auto bg-slate-900 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-[2rem] shrink-0 shadow-lg transition-smooth flex items-center justify-center space-x-2 text-xs">
              <span>{loading ? 'Searching...' : 'Explore Availability'}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </form>
        </div>
      </div>

      {/* Available Rooms grid result */}
      {searched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-primary-500">Search Results</span>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">Available Accommodations</h2>
            <p className="text-slate-500 text-sm">Luxury spaces matching your vacation dates.</p>
          </div>

          {availableRooms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-md mx-auto space-y-4">
              <p className="text-slate-500 font-bold text-sm">No available listings found for these dates.</p>
              <Link to="/rooms" className="bg-slate-900 hover:bg-primary-600 text-white text-xs font-bold px-6 py-3 rounded-xl inline-block transition-smooth">Explore All Rooms</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableRooms.map((room) => (
                <div key={room._id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-150/40 hover:border-slate-200 shadow-sm hover:shadow-xl transition-smooth flex flex-col group">
                  <div className="relative h-60 bg-slate-100 overflow-hidden">
                    <img
                      src={getImageUrl(room.images[0])}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                    <div className="absolute top-4 right-4 bg-slate-950/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10 shadow">
                      LKR {room.pricePerNight.toLocaleString()} <span className="font-normal text-slate-400">/ Night</span>
                    </div>
                  </div>
                  <div className="p-7 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="text-[9px] font-bold text-luxury-600 bg-luxury-50 px-2.5 py-0.5 rounded-full border border-luxury-100 uppercase tracking-wider">{room.type} Room</span>
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-1 leading-snug">{room.name}</h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{room.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4.5 border-t border-slate-100 text-xs font-semibold text-slate-500">
                      <span>Max Capacity: <span className="font-bold text-slate-800">{room.capacity} Guests</span></span>
                      <Link to={`/rooms/${room._id}?checkIn=${search.checkIn}&checkOut=${search.checkOut}&guests=${search.guests}`} className="flex items-center space-x-1 font-bold text-primary-600 hover:text-primary-700 transition-colors">
                        <span>Book stay</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Next-Level Resort Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-24">
        {/* Key resort features */}
        <ResortHighlights />
        
        {/* Curated suites show-off */}
        <FeaturedRoomsTeaser />
        
        {/* Luxury resort experiences */}
        <FeaturedExperiences />
      </div>
    </div>
  );
};

export default Home;
