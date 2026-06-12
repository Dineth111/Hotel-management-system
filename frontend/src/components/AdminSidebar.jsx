import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  CalendarRange, 
  BedDouble, 
  MailWarning, 
  Settings, 
  LogOut,
  ShieldCheck,
  Ticket,
  MessageSquare
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pending Bookings', path: '/admin/bookings/pending', icon: CalendarClock },
    { name: 'All Bookings', path: '/admin/bookings/all', icon: CalendarRange },
    { name: 'Rooms List', path: '/admin/rooms', icon: BedDouble },
    { name: 'Promo Codes', path: '/admin/coupons', icon: Ticket },
    { name: 'Guest Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Contact Messages', path: '/admin/contact-messages', icon: MailWarning },
    { name: 'Hotel Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col shrink-0 min-h-screen font-sans">
      {/* Header Panel branding */}
      <div className="h-20 px-6 border-b border-slate-900 flex items-center space-x-3 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
          <ShieldCheck className="h-5 w-5 text-primary-400" />
        </div>
        <span className="font-display font-bold text-sm tracking-widest text-white uppercase">
          Lanka Pro Admin
        </span>
      </div>

      {/* Navigation list */}
      <nav className="flex-grow py-8 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-smooth ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/15' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout action */}
      <div className="p-4 border-t border-slate-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-smooth border border-transparent hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
