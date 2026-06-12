import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Compass, HeartHandshake, BadgeDollarSign, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../utils/image';

const About = () => {
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

  const features = [
    { title: 'Prime Location', desc: 'Coastal views, beachfront access, and local cultural tour coordinates.', icon: Compass },
    { title: 'Personalized Care', desc: 'Attentive, friendly service specialists waiting to assist your stay.', icon: HeartHandshake },
    { title: 'Secure Bookings', desc: 'Automated double-booking prevention and transparent reservations status.', icon: ShieldCheck },
    { title: 'Best Value Guarantee', desc: 'Transparent direct prices, premium features, and no third-party markups.', icon: BadgeDollarSign }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 font-sans">
      
      {/* Intro section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Premium Hospitality</span>
          </div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 leading-[1.15]">
            About <span className="bg-gradient-to-r from-primary-600 via-luxury-500 to-luxury-600 bg-clip-text text-transparent">{settings?.hotelName || 'Hotel Lanka Pro'}</span>
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm">
            {settings?.aboutText || 'Welcome to Hotel Lanka Pro, your premium tropical getaway nestled along the beautiful coastline of Sri Lanka. We offer standard, deluxe, and suite rooms equipped with all modern amenities for a relaxing stay.'}
          </p>
        </div>

        {/* Dynamic Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          {settings?.aboutImages && settings.aboutImages.length > 0 ? (
            settings.aboutImages.map((img, idx) => (
              <div key={idx} className={`rounded-3xl overflow-hidden shadow-sm h-64 border border-slate-100 ${idx === 0 ? 'mt-8' : ''}`}>
                <img src={getImageUrl(img)} alt={`Resort View ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-smooth" />
              </div>
            ))
          ) : (
            <>
              <div className="rounded-3xl overflow-hidden shadow-sm h-64 mt-8 border border-slate-100">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" alt="Resort View 1" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-sm h-64 border border-slate-100">
                <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80" alt="Resort View 2" className="w-full h-full object-cover" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Why Choose Us features */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-slate-800">Why Choose Us</h2>
          <p className="text-slate-500 text-sm">We provide an elevated stay experience matching international luxury standards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-smooth space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default About;
