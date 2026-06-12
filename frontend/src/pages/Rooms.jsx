import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Maximize, Bed, Users, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/image';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        toast.error('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-primary-500">Resort Sanctuary</span>
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">Our Premium Rooms & Suites</h1>
        <p className="text-slate-500 text-sm">Discover our elegant beachside spaces designed with high-end furniture, ocean breezes, and modern facilities.</p>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm space-y-2 max-w-md mx-auto">
          <Info className="h-8 w-8 text-slate-400 mx-auto" />
          <p className="text-slate-500 font-semibold">No accommodations listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-smooth flex flex-col justify-between group"
            >
              {/* Header Image Gallery display */}
              <div className="relative h-60 bg-slate-100 overflow-hidden">
                <img
                  src={getImageUrl(room.images[0])}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
                
                {/* Status indicator badges */}
                <div className="absolute top-4 left-4">
                  {room.status === 'Maintenance' ? (
                    <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                      Maintenance
                    </span>
                  ) : (
                    <span className="bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                      Available
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white text-sm font-semibold px-3 py-1.5 rounded-xl border border-white/10 shadow backdrop-blur-sm">
                  LKR {room.pricePerNight} <span className="text-xs text-slate-400 font-normal">/ Night</span>
                </div>
              </div>

              {/* Specs & description */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-luxury-500 bg-luxury-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{room.type} Room</span>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mt-2">{room.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{room.description}</p>
                  
                  {/* Grid details */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 text-xs text-slate-600 font-semibold">
                    <div className="flex items-center space-x-1.5 justify-center">
                      <Maximize className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{room.size} sqft</span>
                    </div>
                    <div className="flex items-center space-x-1.5 justify-center border-x border-slate-100">
                      <Bed className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{room.bedType}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 justify-center">
                      <Users className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{room.capacity} Max</span>
                    </div>
                  </div>
                </div>

                <div>
                  {room.status === 'Maintenance' ? (
                    <button
                      disabled
                      className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed text-xs text-center border border-slate-200/50"
                    >
                      Currently Unavailable
                    </button>
                  ) : (
                    <Link
                      to={`/rooms/${room._id}`}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 text-xs text-center block transition-smooth"
                    >
                      View Details & Book
                    </Link>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
