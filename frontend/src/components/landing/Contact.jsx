import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { sendContactMessage } from '../../lib/api';

const contactInfo = {
  email: 'mohansm1002@gmail.com',
  phone: '+91 6380751915',
  location: 'Tirunelveli, Tamil Nadu',
};

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  gmail: Mail,
  mail: Mail,
  email: Mail,
  twitter: Mail,
};

const Contact = ({ socialLinks = [] }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(current => ({ ...current, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendContactMessage(form);
      setSent(true);
    } catch (submitError) {
      setError(submitError.message || 'Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute left-[-100px] top-1/4 w-[400px] h-[400px] bg-cyan-700/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-tag">Contact</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">Let's Work Together</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Have a project in mind? Drop me a message and let's build something great.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card p-7 space-y-6">
              <h3 className="text-xl font-bold font-heading">Contact Info</h3>
              {[
                { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
                { icon: Phone, label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
                { icon: MapPin, label: 'Location', value: contactInfo.location, href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all">
                    <Icon size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{label}</p>
                    <p className="text-slate-200 mt-0.5 font-medium">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="glass-card p-6">
              <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">Find me on</p>
              <div className="flex gap-4">
                {socialLinks.map(({ icon, url, platform }) => {
                  const Icon = socialIconMap[(icon || platform || '').toLowerCase()] || FaGithub;
                  return (
                    <a
                      key={platform || icon}
                      href={url}
                      className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="text-green-400" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading">Message Sent!</h3>
                  <p className="text-slate-400">Thanks for reaching out. I will get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="btn-secondary mt-4"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {['name', 'email'].map(field => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          name={field}
                          value={form[field]}
                          onChange={handleChange}
                          required
                          placeholder={field === 'name' ? 'John Doe' : 'john@example.com'}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="Project Enquiry"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell me about your project..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all text-sm resize-none"
                    />
                  </div>
                  {error && <p className="text-sm text-red-300">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
                  >
                    {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
