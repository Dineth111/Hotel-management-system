import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Plane, Car, Compass, Navigation, Map } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Location = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/settings');
        setSettings(res.data);
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const nearbyPlaces = [
    { name: 'Negombo Golden Beach', time: '15 mins drive', desc: 'Popular beachfront shoreline with seafood restaurants.' },
    { name: 'Colombo Fort District', time: '45 mins drive', desc: 'Central capital area for shopping malls and historic sites.' },
    { name: 'Pinnawala Elephant Park', time: '1.2 hours drive', desc: 'Orphanage sanctuary offering bathing views and care tours.' },
    { name: 'Galle Face Green Park', time: '50 mins drive', desc: 'Beautiful promenade for evening walks and street food.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-primary-500">Find Us</span>
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">Our Premium Location</h1>
        <p className="text-slate-500 text-sm">Located along Galle Road, Kalagedihena. Easily reachable from Colombo city and the international airport.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Map Frame */}
        <div className="lg:col-span-2 h-[450px] rounded-3xl overflow-hidden shadow-sm border border-slate-200/50">
          <iframe
            src={settings?.googleMapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0433282245224!2d80.0544523758364!3d7.1209930160293345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2fb878b31a31d%3A0xe5a3f2d21faecf27!2sKalagedihena%20Junction!5e0!3m2!1sen!2slk!4v1718210000000!5m2!1sen!2slk"}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Resort Location Map"
          ></iframe>
        </div>

        {/* Travel Timeline Directions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center space-x-2 text-slate-800">
              <Navigation className="h-5 w-5 text-primary-500 shrink-0" />
              <span>Route Directions</span>
            </h2>

            <div className="space-y-5 text-xs font-semibold">
              <div className="flex items-start space-x-3">
                <Plane className="h-5 w-5 text-luxury-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">From Airport (BIA)</h3>
                  <p className="text-slate-500 font-medium mt-1 leading-relaxed">Take the Outer Circular highway to Kadawatha, exit towards Kandy Road to Kalagedihena (approx. 35 mins).</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t border-slate-100 pt-5">
                <Car className="h-5 w-5 text-luxury-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">From Colombo City</h3>
                  <p className="text-slate-500 font-medium mt-1 leading-relaxed">Head north along Kandy-Colombo Road directly passing Yakkala to Kalagedihena junction (approx. 45 mins).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Resort Address</span>
            <div className="flex items-start space-x-2 text-sm text-slate-700 font-semibold leading-relaxed">
              <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <span>{settings?.address || 'No 123, Galle Road, Kalagedihena, LK'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sightseeing section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold flex items-center space-x-2 text-slate-800">
          <Compass className="h-6 w-6 text-primary-500 shrink-0" />
          <span>Explore Nearby Attractions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nearbyPlaces.map((place, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-smooth space-y-2.5">
              <span className="text-[9px] font-bold text-luxury-500 bg-luxury-50 px-2.5 py-0.5 rounded-full">{place.time}</span>
              <h3 className="font-bold text-slate-800 text-sm">{place.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{place.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Location;
