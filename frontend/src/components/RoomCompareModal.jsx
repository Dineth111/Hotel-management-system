import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { getImageUrl } from '../utils/image';
import { Link } from 'react-router-dom';

const RoomCompareModal = ({ rooms, onClose, onRemove, allRooms = [], onAdd }) => {
  const [showSelector, setShowSelector] = React.useState(false);
  if (rooms.length === 0) return null;
  const availableRooms = allRooms.filter(r => !rooms.some(cr => cr._id === r._id) && r.status !== 'Maintenance');

  // Gather unique amenities across all compared rooms to compare side by side
  const allAmenities = Array.from(
    new Set(rooms.flatMap((r) => r.amenities || []))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-display font-extrabold text-slate-900">Suite Comparison</h2>
            <p className="text-slate-500 text-xs mt-0.5">Compare features, specifications, and prices side-by-side.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {/* Left Specs Labels column */}
            <div className="hidden md:flex flex-col justify-end pb-24 text-[10px] font-bold text-slate-400 uppercase tracking-wider space-y-12">
              <div className="h-44 border-b border-transparent"></div> {/* Align with image */}
              <div className="py-2 border-b border-slate-100">Rate / Night</div>
              <div className="py-2 border-b border-slate-100">Suite Type</div>
              <div className="py-2 border-b border-slate-100">Bed Arrangement</div>
              <div className="py-2 border-b border-slate-100">Max Capacity</div>
              <div className="py-2 border-b border-slate-100">Room Size</div>
            </div>

            {/* Compared Rooms columns */}
            {rooms.map((room) => (
              <div
                key={room._id}
                className="md:col-span-1 bg-slate-50/40 border border-slate-100/60 p-5 rounded-[2rem] flex flex-col justify-between relative group hover:border-slate-200"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemove(room._id)}
                  className="absolute top-3 right-3 z-10 p-1.5 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="space-y-6">
                  {/* Image & Title */}
                  <div className="space-y-3">
                    <div className="h-32 rounded-2xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={getImageUrl(room.images[0])}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1">{room.name}</h3>
                  </div>

                  {/* Pricing and specs */}
                  <div className="space-y-4 text-xs font-semibold text-slate-600">
                    <div className="py-1 border-b border-slate-100 flex justify-between md:block">
                      <span className="md:hidden text-[9px] text-slate-400 font-bold uppercase tracking-wider">Rate: </span>
                      <span className="font-extrabold text-slate-900 text-sm">LKR {room.pricePerNight.toLocaleString()}</span>
                    </div>

                    <div className="py-1 border-b border-slate-100 flex justify-between md:block">
                      <span className="md:hidden text-[9px] text-slate-400 font-bold uppercase tracking-wider">Type: </span>
                      <span className="font-bold text-primary-600 uppercase tracking-wide">{room.type}</span>
                    </div>

                    <div className="py-1 border-b border-slate-100 flex justify-between md:block">
                      <span className="md:hidden text-[9px] text-slate-400 font-bold uppercase tracking-wider">Bed: </span>
                      <span>{room.bedType} Bed</span>
                    </div>

                    <div className="py-1 border-b border-slate-100 flex justify-between md:block">
                      <span className="md:hidden text-[9px] text-slate-400 font-bold uppercase tracking-wider">Capacity: </span>
                      <span>{room.capacity} Guests</span>
                    </div>

                    <div className="py-1 border-b border-slate-100 flex justify-between md:block">
                      <span className="md:hidden text-[9px] text-slate-400 font-bold uppercase tracking-wider">Size: </span>
                      <span>{room.size} SQFT</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to={`/rooms/${room._id}`}
                    onClick={onClose}
                    className="w-full bg-slate-900 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-wider text-center block transition-smooth shadow-sm"
                  >
                    Select & Book
                  </Link>
                </div>
              </div>
            ))}

            {/* Fill remaining space if comparing < 3 rooms */}
            {rooms.length < 3 &&
              Array.from({ length: 3 - rooms.length }).map((_, i) => (
                <div
                  key={i}
                  className="hidden md:flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-[2rem] p-6 text-center text-slate-400 text-xs font-bold bg-slate-50/20 min-h-[300px]"
                >
                  {!showSelector ? (
                    <div
                      onClick={() => setShowSelector(true)}
                      className="flex flex-col items-center justify-center cursor-pointer hover:text-slate-600 transition-smooth"
                    >
                      <div className="h-10 w-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-lg font-normal">+</div>
                      <p className="mt-2.5">Add another suite</p>
                    </div>
                  ) : (
                    <div className="w-full space-y-2.5">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Choose suite:</p>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                        {availableRooms.length === 0 ? (
                          <p className="text-[10px] text-slate-400 font-medium">No other suites available</p>
                        ) : (
                          availableRooms.map((room) => (
                            <button
                              key={room._id}
                              onClick={() => {
                                onAdd(room);
                                setShowSelector(false);
                              }}
                              className="w-full text-left p-2.5 hover:bg-emerald-50 rounded-xl border border-slate-100 hover:border-emerald-100 transition-smooth flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:text-emerald-700"
                            >
                              <span className="truncate max-w-[110px]">{room.name}</span>
                              <span className="text-slate-500 text-[10px] shrink-0 font-bold">LKR {room.pricePerNight}</span>
                            </button>
                          ))
                        )}
                      </div>
                      <button
                        onClick={() => setShowSelector(false)}
                        className="text-slate-400 hover:text-slate-600 text-[10px] underline font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Amenities Comparison Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compare Amenities</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="hidden md:block"></div> {/* Spacer for left labels */}
              {rooms.map((room) => (
                <div key={room._id} className="space-y-2 text-xs font-bold text-slate-600">
                  {allAmenities.map((amenity) => {
                    const hasAmenity = room.amenities?.includes(amenity);
                    return (
                      <div
                        key={amenity}
                        className={`flex items-center justify-between p-2.5 rounded-xl border ${
                          hasAmenity ? 'border-slate-100 bg-slate-50/30' : 'border-transparent opacity-40'
                        }`}
                      >
                        <span>{amenity}</span>
                        {hasAmenity ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-slate-300 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCompareModal;
