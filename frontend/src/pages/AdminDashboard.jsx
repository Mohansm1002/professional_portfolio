import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Zap, Wrench, FolderOpen, Briefcase,
  MessageSquareQuote, Inbox, Palette, Settings, Image, LogOut,
  Menu, X, ExternalLink,
} from 'lucide-react';
import DashboardHome from '../components/admin/DashboardHome';
import HeroEditor from '../components/admin/HeroEditor';
import ProjectsManager from '../components/admin/ProjectsManager';
import SkillsManager from '../components/admin/SkillsManager';
import MessagesInbox from '../components/admin/MessagesInbox';
import { addAdminSessionExpiredListener, getStoredToken, logout } from '../lib/api';

const navItems = [
  { path: '/admin',           label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { path: '/admin/hero',      label: 'Hero',         icon: User },
  { path: '/admin/projects',  label: 'Projects',     icon: FolderOpen },
  { path: '/admin/skills',    label: 'Skills',       icon: Zap },
  { path: '/admin/services',  label: 'Services',     icon: Wrench },
  { path: '/admin/experience',label: 'Experience',   icon: Briefcase },
  { path: '/admin/testimonials',label:'Testimonials',icon: MessageSquareQuote },
  { path: '/admin/messages',  label: 'Messages',     icon: Inbox },
  { path: '/admin/theme',     label: 'Theme',        icon: Palette },
  { path: '/admin/settings',  label: 'SEO & Settings',icon: Settings },
  { path: '/admin/media',     label: 'Media Library',icon: Image },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getStoredToken()) {
      const redirect = `${location.pathname}${location.search}`;
      navigate(`/admin/login?redirect=${encodeURIComponent(redirect)}`, { replace: true });
      return;
    }

    setAuthChecked(true);
  }, [location.pathname, location.search, navigate]);

  useEffect(() => addAdminSessionExpiredListener(() => {
    setAuthChecked(false);
    navigate('/admin/login', { replace: true });
  }), [navigate]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0A0A12] px-6 py-10 text-slate-400">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A12', color: '#cbd5e1' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 border-r border-white/8
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: 'rgba(10,10,22,0.97)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <span className="text-xl font-bold font-heading text-white">
            Admin<span className="text-cyan-400">.</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-400/10 border border-purple-500/30 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/8 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-all"
          >
            <ExternalLink size={18} /> Live Preview
          </a>
          <button
            onClick={() => { logout(); navigate('/admin/login', { replace: true }); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/8"
          style={{ background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(16px)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-base font-semibold text-slate-300">Portfolio Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="hero" element={<HeroEditor />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="messages" element={<MessagesInbox />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
      <Settings className="text-slate-500" size={36} />
    </div>
    <h2 className="text-2xl font-bold font-heading text-white mb-2">Coming Soon</h2>
    <p className="text-slate-500">This section is being built. Check back shortly.</p>
  </div>
);

export default AdminDashboard;
