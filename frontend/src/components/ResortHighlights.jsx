import React from 'react';
import { Wifi, Compass, Sparkles, Award } from 'lucide-react';

const ResortHighlights = () => {
  const highlights = [
    {
      title: 'Oceanfront Infinity Pool',
      desc: 'Swim right to the edge of the sky with unmatched views of the turquoise Indian Ocean.',
      icon: Compass,
      badge: 'Signature'
    },
    {
      title: 'Michelin Star Dining',
      desc: 'Experience curated island seafood and contemporary cuisine crafted by award-winning chefs.',
      icon: Sparkles,
      badge: 'Fine Cuisine'
    },
    {
      title: 'Exclusive Wellness Spa',
      desc: 'Immerse in holistic physical and spiritual healing therapies led by licensed therapists.',
      icon: Award,
      badge: 'Ayurvedic'
    },
    {
      title: 'High-Speed Resort WiFi',
      desc: 'Stay seamlessly connected across our sandy beaches, suites, and common lounges.',
      icon: Wifi,
      badge: 'Complimentary'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
      {highlights.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-white p-7 rounded-[2.2rem] border border-slate-100/80 shadow-sm hover:shadow-xl transition-smooth space-y-5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <span className="text-[9px] font-extrabold text-luxury-600 bg-luxury-50 border border-luxury-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {item.badge}
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-800 tracking-tight">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ResortHighlights;
