import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Quote,
  FileEdit,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminLayout = () => {
  const { admin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner fullScreen message="Verifying administrative session..." />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout error: ' + err.message);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Layers },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Quote },
    { name: 'Site Content', path: '/admin/content', icon: FileEdit },
    { name: 'Contact Enquiries', path: '/admin/contacts', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A101D] border-r border-white/10 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base">NexaTech</span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer & Logout */}
        <div className="p-4 border-t border-white/10 bg-slate-900/40">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
              {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{admin.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{admin.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-xs text-rose-300 hover:text-rose-200 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A101D] border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span className="font-heading font-bold text-white text-sm">NexaTech Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden bg-[#0A101D] border-b border-white/10 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-800 flex justify-between">
            <Link to="/" className="text-xs text-cyan-400">
              Return to Website
            </Link>
            <button type="button" onClick={handleLogout} className="text-xs text-rose-400">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
