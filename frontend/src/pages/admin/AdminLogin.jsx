import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      if (loggedUser.role === 'admin') {
        toast.success('Welcome to the admin portal');
        navigate('/admin/dashboard');
      } else {
        toast.error('Access denied. Admin access only.');
      }
    } catch (err) {
      // toast already fired inside Context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex font-sans bg-slate-950 relative overflow-hidden">
      
      {/* Right Image Section for Admin (reversed from User) */}
      <div className="hidden lg:block lg:w-1/2 relative order-2">
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Resort Administration" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-12 right-12 z-20 text-white max-w-md text-right">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-luxury-500/20 backdrop-blur-md mb-6 border border-luxury-500/30 shadow-xl ml-auto flex">
            <ShieldAlert className="h-6 w-6 text-luxury-400" />
          </div>
          <h2 className="text-4xl font-display font-extrabold mb-4 leading-tight drop-shadow-md">Secure Administration</h2>
          <p className="text-lg text-slate-300 font-medium drop-shadow-sm">Manage bookings, oversee operations, and maintain the exceptional standards of Hotel Lanka.</p>
        </div>
      </div>

      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative order-1">
        {/* Decorative premium ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-900/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-luxury-900/10 rounded-full filter blur-3xl -z-10"></div>

        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl border border-slate-800/80 shadow-2xl shadow-black/80 transition-smooth hover:border-slate-700/80">
        
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-luxury-500 to-luxury-600 text-white shadow-lg shadow-luxury-500/20 mb-2">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Admin Console</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hotel Lanka Pro Administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-luxury-400 transition-colors">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:border-luxury-500 focus:ring-2 focus:ring-luxury-950/50 focus:outline-none transition-smooth font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-luxury-400 transition-colors">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:border-luxury-500 focus:ring-2 focus:ring-luxury-950/50 focus:outline-none transition-smooth font-medium"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-luxury-500 to-luxury-600 hover:from-luxury-600 hover:to-luxury-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-luxury-500/10 hover:shadow-luxury-600/20 transition-smooth flex items-center justify-center space-x-2 text-sm"
          >
            <LogIn className="h-4.5 w-4.5 shrink-0" />
            <span>{loading ? 'Authenticating...' : 'Secure Access'}</span>
          </button>
        </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
