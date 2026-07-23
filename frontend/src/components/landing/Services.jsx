import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Code2, Cpu, Globe, Layers, Monitor, MonitorSmartphone, Palette, Server, ShieldCheck, Smartphone } from 'lucide-react';

const iconMap = {
  code: Code2,
  monitor: Monitor,
  web: Monitor,
  webdevelopment: Monitor,
  frontend: MonitorSmartphone,
  frontenddevelopment: MonitorSmartphone,
  frontenddeveloper: MonitorSmartphone,
  responsive: MonitorSmartphone,
  responsivedevelopment: MonitorSmartphone,
  fullstack: Layers,
  fullstackdevelopment: Layers,
  fullstackdeveloper: Layers,
  stack: Layers,
  server: Server,
  backend: Server,
  database: Server,
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
  cpu: Cpu,
  ml: Cpu,
  machinelearning: Cpu,
};

const cardVariants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: Math.min(i * 0.07, 0.28), duration: 0.55, ease: 'easeOut' },
  }),
};

const Services = ({ services = [] }) => (
  <section id="services" className="py-24 px-6 relative overflow-hidden">
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

      <div className="mx-auto max-w-4xl space-y-5">
        {services.map((service, i) => {
          const iconKey = (service.icon || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const Icon = iconMap[iconKey] || Code2;
          return (
            <motion.div
              key={service.id || service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              whileHover={{ x: 6 }}
              className="glass-card group cursor-default overflow-hidden p-6 sm:p-7"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10 transition-transform duration-300 group-hover:scale-105">
                  <Icon size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-600">0{i + 1}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/35 to-transparent" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{service.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;
