import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Hotel, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const from = location.state?.from || '/';
        navigate(from);
      }
    } catch (err) {
      // toast is already fired inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-slate-50 via-white to-primary-50/20 relative overflow-hidden font-sans">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-100/40 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-luxury-100/30 rounded-full filter blur-3xl -z-10"></div>

      <div className="max-w-md w-full bg-white/85 backdrop-blur-md p-10 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/80 transition-smooth hover:shadow-2xl hover:shadow-slate-200/50">
        
        {/* Branding header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20 mb-2">
            <Hotel className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Hotel Lanka Pro Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-2">
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
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-smooth placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
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
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-smooth placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-primary-600/20 transition-smooth flex items-center justify-center space-x-2 text-sm"
          >
            <LogIn className="h-4.5 w-4.5 shrink-0" />
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs font-semibold text-slate-500 flex items-center justify-center space-x-1">
          <span>New guest?</span>
          <Link to="/register" className="text-primary-500 hover:text-primary-600 flex items-center gap-0.5 font-bold transition-colors">
            <span>Create account</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
