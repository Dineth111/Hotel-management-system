import React from 'react';
import { Compass, Sparkles, MapPin } from 'lucide-react';

const FeaturedExperiences = () => {
  const experiences = [
    {
      title: 'Private Beach Dinner',
      desc: 'Savor gourmet dishes prepared by master chefs right on the beach, lit by candlelight and sea stars.',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      location: 'Main Beachfront'
    },
    {
      title: 'Ayurvedic Spa Oasis',
      desc: 'Rejuvenate your senses with ancient healing therapies, essential tropical oils, and full body scrubs.',
      img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
      location: 'Wellness Wing'
    },
    {
      title: 'Sunset Yacht Charter',
      desc: 'Sail into the gold-tinted horizons of the Indian Ocean with private caterers and custom cocktails.',
      img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
      location: 'Private Marina'
    }
  ];

  return (
    <section className="space-y-10 py-12">
      <div className="text-center max-w-xl mx-auto space-y-2.5">
        <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-widest bg-primary-50 border border-primary-100 px-3 py-1 rounded-full inline-block">
          Unmatched Indulgence
        </span>
        <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          Sensory Island Experiences
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          Immerse yourself in carefully designed tropical adventures that feed your body, mind, and spirit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative rounded-[2.5rem] overflow-hidden group shadow-md hover:shadow-2xl transition-smooth h-[26rem] border border-slate-100/50">
            <img
              src={exp.img}
              alt={exp.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
              <span className="inline-flex items-center space-x-1.5 text-[9px] font-extrabold text-luxury-300 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>{exp.location}</span>
              </span>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display tracking-tight text-white">{exp.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">{exp.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedExperiences;
