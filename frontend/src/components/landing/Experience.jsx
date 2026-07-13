import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, CalendarDays, GraduationCap } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: Math.min(i * 0.07, 0.28), duration: 0.55, ease: 'easeOut' },
  }),
};

const Experience = ({ experience = [] }) => (
  <section id="experience" className="py-24 px-6 relative overflow-hidden">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="section-tag">Journey</span>
        <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">Experience &amp; Education</h2>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto">Where I have been and what I have learned along the way.</p>
      </motion.div>

      <div className="space-y-5">
        {experience.map((item, i) => {
          const isEducation = item.type === 'education';
          const Icon = isEducation ? GraduationCap : Briefcase;

          return (
            <motion.div
              key={item.id || `${item.role}-${item.company}`}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              whileHover={{ x: 6 }}
              className="glass-card group overflow-hidden p-6 sm:p-7"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-purple-400/25 bg-purple-400/10 text-purple-300 shadow-lg shadow-purple-500/10 transition-transform duration-300 group-hover:scale-105">
                  {item.company_logo_url
                    ? <img src={item.company_logo_url} alt="" className="h-8 w-8 object-contain" />
                    : <Icon size={28} />
                  }
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs font-semibold text-slate-300">
                      {isEducation ? 'Education' : 'Work'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                      <CalendarDays size={13} />
                      {item.start} - {item.is_present ? 'Present' : item.end}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white">{item.role}</h3>
                  <span className="mt-1 flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    <Building2 size={14} /> {item.company}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Experience;
