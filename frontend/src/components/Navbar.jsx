import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Hotel, User, LogOut, LayoutDashboard, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'About', path: '/about' },
    { name: 'Location', path: '/location' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 group-hover:bg-primary-500 group-hover:border-primary-500 transition-smooth">
                <Hotel className="h-5 w-5 text-primary-500 group-hover:text-white transition-colors" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-luxury-600 bg-clip-text text-transparent group-hover:from-primary-600 transition-smooth">
                Hotel Lanka Pro
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-smooth hover:text-primary-500 relative py-2 ${
                    isActive 
                      ? 'text-primary-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-500 after:rounded-full' 
                      : 'text-slate-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {user && user.role === 'customer' && (
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-smooth hover:text-primary-500 relative py-2 ${
                    isActive 
                      ? 'text-primary-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-500 after:rounded-full' 
                      : 'text-slate-600'
                  }`
                }
              >
                My Bookings
              </NavLink>
            )}

            <span className="h-5 w-px bg-slate-200" aria-hidden="true" />

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1.5 bg-luxury-500 hover:bg-luxury-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-luxury-500/10 hover:shadow-lg hover:shadow-luxury-500/20 transition-smooth"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 bg-slate-100/80 px-3.5 py-2 rounded-xl text-slate-700 border border-slate-200/30">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold max-w-[100px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-xl text-xs font-semibold transition-smooth border border-red-200/10 hover:border-red-200"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 transition-smooth"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 border border-slate-200/20 transition-smooth"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white/95 border-b border-slate-200 px-4 pt-3 pb-5 space-y-2.5 animate-slide-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-100 hover:text-primary-500 transition-smooth"
            >
              {link.name}
            </Link>
          ))}

          {user && user.role === 'customer' && (
            <Link
              to="/my-bookings"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-100 hover:text-primary-500 transition-smooth"
            >
              My Bookings
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-3 px-3">
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 bg-luxury-500 text-white px-4 py-2.5 rounded-xl text-base font-bold shadow transition-smooth"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logged in: {user.name}</div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-500 py-2.5 rounded-xl font-bold transition-smooth"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-primary-500 text-white px-4 py-2.5 rounded-xl text-base font-bold shadow transition-smooth"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
