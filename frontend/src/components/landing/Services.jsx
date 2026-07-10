import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Code2, Globe, Monitor, Palette, ShieldCheck, Smartphone } from 'lucide-react';

const iconMap = {
  monitor: Monitor,
  web: Monitor,
  smartphone: Smartphone,
  mobile: Smartphone,
  palette: Palette,
  'pen-tool': Palette,
  design: Palette,
  globe: Globe,
  api: Globe,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
  analytics: BarChart,
  chart: BarChart,
};

const colors = [
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-pink-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-cyan-500',
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' } }),
};

const Services = ({ services = [] }) => (
  <section id="services" className="py-24 px-6 relative overflow-hidden">
    <div className="absolute left-[-200px] bottom-0 w-[500px] h-[500px] bg-purple-700/10 rounded-full filter blur-[120px] pointer-events-none"></div>

    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="section-tag">What I Do</span>
        <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">Services I Offer</h2>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto">End-to-end solutions from concept to deployment.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => {
          const iconKey = (service.icon || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const Icon = iconMap[iconKey] || Code2;
          const color = colors[i % colors.length];
          return (
            <motion.div
              key={service.id || service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="glass-card p-7 group cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} p-3 mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3 text-white">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">{service.description}</p>

              <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-sm font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  Learn more
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;
