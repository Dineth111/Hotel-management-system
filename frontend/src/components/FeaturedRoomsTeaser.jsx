import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Maximize, Bed, Users, ArrowRight, Star } from 'lucide-react';
import { getImageUrl } from '../utils/image';

const FeaturedRoomsTeaser = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('/rooms');
        // Grab top 3 rooms to showcase
        setRooms(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch teaser rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading || rooms.length === 0) return null;

  return (
    <section className="space-y-10 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2.5">
          <span className="text-[10px] font-extrabold text-luxury-500 uppercase tracking-widest bg-luxury-50 border border-luxury-100 px-3 py-1 rounded-full">
            Curated Stays
          </span>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Our Luxury Suites
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Indulge in spaces designed for absolute relaxation, featuring breathtaking views and top-tier comforts.
          </p>
        </div>
        <Link
          to="/rooms"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider shrink-0"
        >
          <span>View All Accommodations</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-2xl transition-smooth flex flex-col group"
          >
            <div className="relative h-64 bg-slate-50 overflow-hidden">
              <img
                src={getImageUrl(room.images[0])}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              />
              <div className="absolute top-4 right-4 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10 shadow">
                LKR {room.pricePerNight.toLocaleString()} <span className="font-normal text-slate-400">/ Night</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full shadow flex items-center space-x-1">
                <Star className="h-3.5 w-3.5 text-luxury-500 fill-luxury-500 shrink-0" />
                <span>5.0 Exceptional</span>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {room.type} Suite
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{room.bedType} Bed</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{room.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{room.description}</p>
                
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-bold uppercase">
                  <div className="flex items-center space-x-1.5">
                    <Maximize className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{room.size} SQFT Space</span>
                  </div>
                  <div className="flex items-center space-x-1.5 justify-end">
                    <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Up to {room.capacity} Guests</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/rooms/${room._id}`}
                className="w-full bg-slate-900 hover:bg-primary-500 text-white font-bold py-3.5 rounded-2xl text-xs text-center block transition-smooth shadow-sm group-hover:shadow"
              >
                Book This Suite
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRoomsTeaser;
