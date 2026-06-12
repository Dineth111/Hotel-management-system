import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Maximize, Bed, Users, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/image';
import RoomCompareModal from '../components/RoomCompareModal';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareRooms, setCompareRooms] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    axios.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(() => toast.error('Failed to load rooms'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleCompare = (room) => {
    const isCompared = compareRooms.some(r => r._id === room._id);
    if (isCompared) return setCompareRooms(compareRooms.filter(r => r._id !== room._id));
    if (compareRooms.length >= 3) return toast.error('You can compare a maximum of 3 suites at once');
    setCompareRooms([...compareRooms, room]);
  };

  const handleRemoveCompare = (id) => setCompareRooms(compareRooms.filter(r => r._id !== id));

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
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {room.status === 'Maintenance' ? (
                    <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                      Maintenance
                    </span>
                  ) : (
                    <>
                      <span className="bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                        Available
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleCompare(room);
                        }}
                        className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow backdrop-blur transition-all flex items-center gap-1 ${
                          compareRooms.some(r => r._id === room._id)
                            ? 'bg-primary-500 text-white border border-primary-400'
                            : 'bg-slate-900/80 text-slate-200 hover:text-white border border-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={compareRooms.some(r => r._id === room._id)}
                          onChange={() => {}}
                          className="h-3 w-3 rounded accent-primary-500 border-none pointer-events-none"
                        />
                        <span>Compare</span>
                      </button>
                    </>
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

      {/* Floating Compare Bar */}
      {compareRooms.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 text-white py-4 px-6 rounded-full shadow-2xl flex items-center space-x-6 border border-white/10 backdrop-blur">
          <span className="text-xs font-bold tracking-wide">
            {compareRooms.length} suite{compareRooms.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCompareModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-5 rounded-full text-xs transition-smooth shadow-lg"
            >
              Compare Now
            </button>
            <button
              onClick={() => setCompareRooms([])}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal overlay */}
      {showCompareModal && (
        <RoomCompareModal
          rooms={compareRooms}
          onClose={() => setShowCompareModal(false)}
          onRemove={handleRemoveCompare}
          allRooms={rooms}
          onAdd={handleToggleCompare}
        />
      )}
    </div>
  );
};

export default Rooms;
