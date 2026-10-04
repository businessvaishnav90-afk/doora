import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Wrench, LogOut, Banknote, ShieldAlert, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Workers & KYC', path: '/workers', icon: UserCheck },
    { name: 'Bookings & Disputes', path: '/bookings', icon: ClipboardList },
    { name: 'Finance & Commission', path: '/finance', icon: Banknote },
    { name: 'Categories & Marketing', path: '/settings', icon: Wrench },
    { name: 'Staff & Audit Logs', path: '/roles', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 bg-slate-950 border-b border-slate-800">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-brand-500/20">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        <h1 className="text-white text-xl font-bold tracking-wide">Doora Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-brand-500/10 text-brand-400' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-brand-400' : 'text-slate-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
