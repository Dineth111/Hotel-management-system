import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Phone, Mail, MapPin, Compass, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2.5 text-white">
              <div className="h-9 w-9 rounded-lg bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                <Hotel className="h-4.5 w-4.5 text-primary-400" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-primary-400 to-luxury-400 bg-clip-text text-transparent">
                Hotel Lanka Pro
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Nestled along the pristine coastline of Sri Lanka, we combine tropical luxury with warm hospitality to create your ultimate holiday sanctuary.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 tracking-widest uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'Rooms', 'About', 'Location', 'Contact', 'FAQ', 'Terms of Service', 'Privacy Policy', 'Admin Login'].map((item) => {
                let path = '/';
                if (item === 'Home') path = '/';
                else if (item === 'Terms of Service') path = '/terms';
                else if (item === 'Privacy Policy') path = '/privacy';
                else if (item === 'Admin Login') path = '/admin/login';
                else path = `/${item.toLowerCase()}`;
                
                return (
                  <li key={item}>
                    <Link
                      to={path}
                      className="hover:text-primary-400 hover:pl-1 transition-all duration-200 block"
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Details Card */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 tracking-widest uppercase mb-4">Get In Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-luxury-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">No 123, Galle Road, Kalagedihena, LK</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4.5 w-4.5 text-luxury-400 shrink-0" />
                <span className="text-slate-300 font-semibold">+94 71 142 4377</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4.5 w-4.5 text-luxury-400 shrink-0" />
                <span className="text-slate-300">dinethsanjula647@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator & Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p>&copy; {currentYear} Hotel Lanka Pro. Crafted for luxury getaways.</p>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>&middot;</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
