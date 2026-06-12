import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, UserPlus, Hotel, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/login');
    } catch (err) {
      // toast is already fired inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-slate-50 via-white to-primary-50/20 relative overflow-hidden font-sans">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary-100/40 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-luxury-100/30 rounded-full filter blur-3xl -z-10"></div>

      <div className="max-w-md w-full bg-white/85 backdrop-blur-md p-10 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/80 transition-smooth hover:shadow-2xl hover:shadow-slate-200/50">
        
        {/* Branding header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20 mb-2">
            <Hotel className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Join Hotel Lanka Pro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-smooth placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-smooth placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="+94 71 142 4377"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-smooth placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-smooth placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-primary-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-primary-600/20 transition-smooth flex items-center justify-center space-x-2 text-sm mt-2"
          >
            <UserPlus className="h-4.5 w-4.5 shrink-0" />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs font-semibold text-slate-500 flex items-center justify-center space-x-1">
          <span>Already registered?</span>
          <Link to="/login" className="text-primary-500 hover:text-primary-600 flex items-center gap-0.5 font-bold transition-colors">
            <span>Sign in here</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
