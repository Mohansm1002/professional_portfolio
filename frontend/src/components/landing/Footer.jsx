import React from 'react';
import { ArrowUp, Heart, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  gmail: Mail,
  mail: Mail,
  email: Mail,
  twitter: Mail,
};

const Footer = ({ hero, socialLinks = [], settings }) => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const firstName = (hero?.name || settings?.site_title || 'Alex').split(' ')[0];

  return (
    <footer className="relative border-t border-white/8 py-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <a href="#" className="text-2xl font-heading font-bold text-white">
              {firstName}<span className="text-cyan-400">.</span>
            </a>
            <p className="text-slate-500 text-sm mt-3 max-w-xs leading-relaxed">
              {settings?.meta_description || hero?.bio}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map(link => (
                <li key={link}>
                  <a href={link === 'Home' ? '#' : `#${link.toLowerCase()}`} className="text-slate-500 hover:text-purple-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map(({ icon, platform, url }) => {
                const Icon = socialIconMap[(icon || platform || '').toLowerCase()] || FaGithub;
                return (
                  <a
                    key={platform || icon}
                    href={url}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} {hero?.name || firstName}. Made with <Heart size={13} className="text-pink-500 fill-pink-500" /> All rights reserved.
          </p>
          <button
            onClick={scrollTop}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/50 transition-all"
            title="Back to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
