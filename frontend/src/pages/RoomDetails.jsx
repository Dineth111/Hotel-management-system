import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, ArrowLeft, Maximize, Bed, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/image';
import BookingSidebarCard from '../components/BookingSidebarCard';
import RoomReviews from '../components/RoomReviews';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [room, setRoom] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    customerName: user ? user.name : '',
    customerPhone: user ? user.phone : '',
    customerEmail: user ? user.email : '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: Number(searchParams.get('guests')) || 1
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [roomRes, settingsRes] = await Promise.all([
          axios.get(`/rooms/${id}`),
          axios.get('/settings')
        ]);
        setRoom(roomRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        toast.error('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        customerName: user.name,
        customerPhone: user.phone,
        customerEmail: user.email
      }));
    }
  }, [user]);

  const calculateBookingDetails = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut || !room) return null;
    const reqIn = new Date(bookingForm.checkIn);
    const reqOut = new Date(bookingForm.checkOut);
    if (reqIn >= reqOut) return null;
    
    const timeDiff = reqOut.getTime() - reqIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return { nights, totalAmount: nights * room.pricePerNight };
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: `/rooms/${id}` } });
    if (bookingForm.guests > room.capacity) return toast.error(`Max capacity is ${room.capacity}`);

    try {
      const res = await axios.post('/bookings', { roomId: room._id, ...bookingForm });
      toast.success(res.data.message || 'Booking requested successfully!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request booking');
    }
  };

  const costCalculation = calculateBookingDetails();
  if (loading) return <div className="text-center py-20 font-semibold">Loading details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      <Link to="/rooms" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to listings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Details Gallery */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-primary-500">{room.type} Escape</span>
            <h1 className="text-4xl font-display font-extrabold text-slate-900 leading-tight">{room.name}</h1>
          </div>

          <div className="h-[450px] rounded-3xl overflow-hidden bg-slate-100 shadow-md">
            <img src={getImageUrl(room.images[0])} alt={room.name} className="w-full h-full object-cover" />
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-slate-700">
            {[
              { label: 'Room Size', value: `${room.size} sqft`, icon: Maximize },
              { label: 'Bed Type', value: `${room.bedType} Bed`, icon: Bed },
              { label: 'Max Guests', value: `${room.capacity} Guests`, icon: Users }
            ].map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5">
                  <Icon className="h-5 w-5 text-primary-500 shrink-0" />
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{spec.label}</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5">{spec.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Room Overview</h2>
            <p className="text-slate-600 leading-relaxed text-sm">{room.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Amenities Included</h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2 bg-slate-100/80 text-slate-700 px-4 py-2 rounded-full text-xs font-bold border border-slate-200/20">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <RoomReviews roomId={room._id} />
        </div>

        <BookingSidebarCard
          room={room}
          settings={settings}
          user={user}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          handleBookingSubmit={handleBookingSubmit}
          costCalculation={costCalculation}
        />

      </div>
    </div>
  );
};

export default RoomDetails;
