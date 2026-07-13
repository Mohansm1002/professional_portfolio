import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, FolderOpen, Inbox, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminDashboard, getAdminMessages } from '../../lib/api';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const DashboardHome = () => {
  const [dashboard, setDashboard] = useState({
    total_projects: 0,
    total_skills: 0,
    unread_messages: 0,
    total_messages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAdminMessages()])
      .then(([dashboardData, messages]) => {
        setDashboard(dashboardData);
        setRecentMessages(messages.slice(0, 3));
      })
      .catch(loadError => setError(loadError.message || 'Could not load dashboard.'));
  }, []);

  const stats = [
    { label: 'Total Projects', value: dashboard.total_projects, icon: FolderOpen, color: 'from-indigo-500 to-purple-600' },
    { label: 'Total Skills', value: dashboard.total_skills, icon: Zap, color: 'from-purple-500 to-pink-500' },
    { label: 'Unread Messages', value: dashboard.unread_messages, icon: Inbox, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Messages', value: dashboard.total_messages, icon: Star, color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-heading text-white">Dashboard</h2>
        <p className="text-slate-500 mt-1">Welcome back. Here is what is going on.</p>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i} variants={cardVariants} initial="hidden" animate="visible"
            className="glass-card p-5"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="text-white" size={20} />
            </div>
            <p className="text-3xl font-bold font-heading text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold font-heading text-white">Recent Messages</h3>
            <Link to="/admin/messages" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-500">No messages yet.</p>
            ) : recentMessages.map(msg => (
              <div key={msg.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/4 border border-white/8 hover:border-white/15 transition-all cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{msg.name}</p>
                  <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-600">{msg.date}</span>
                  {!msg.is_read && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="font-bold font-heading text-white mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Edit Hero Section', href: '/admin/hero', desc: 'Update name, photo, and roles' },
              { label: 'Manage Projects', href: '/admin/projects', desc: 'Add, edit, or remove projects' },
              { label: 'View Messages', href: '/admin/messages', desc: `${dashboard.unread_messages} unread contact submissions` },
            ].map(action => (
              <Link
                key={action.label}
                to={action.href}
                className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8 hover:border-purple-500/40 hover:bg-white/6 transition-all group"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white">{action.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
              </Link>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8 hover:border-cyan-500/40 hover:bg-white/6 transition-all group"
            >
              <div>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white">Live Preview</p>
                <p className="text-xs text-slate-500 mt-0.5">Open the public portfolio site</p>
              </div>
              <ExternalLink size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
