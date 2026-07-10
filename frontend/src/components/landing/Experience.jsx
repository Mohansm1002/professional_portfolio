import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';

const Experience = ({ experience = [] }) => (
  <section id="experience" className="py-24 px-6 relative overflow-hidden">
    <div className="absolute left-0 top-1/3 w-[400px] h-[400px] bg-indigo-700/10 rounded-full filter blur-[120px] pointer-events-none"></div>

    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="section-tag">Journey</span>
        <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">Experience &amp; Education</h2>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto">Where I have been and what I have learned along the way.</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent opacity-40 md:-translate-x-px"></div>

        <div className="space-y-10">
          {experience.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-0`}
            >
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-purple-500 bg-background flex items-center justify-center z-10 shadow-lg shadow-purple-500/20">
                {item.type === 'education'
                  ? <GraduationCap size={18} className="text-cyan-400" />
                  : <Briefcase size={18} className="text-purple-400" />
                }
              </div>

              <div className={`ml-20 md:ml-0 md:w-[45%] ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-[55%]'}`}>
                <div className="glass-card p-6 group hover:border-purple-500/40">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                    {item.start} - {item.is_present ? 'Present' : item.end}
                  </span>
                  <h3 className="text-lg font-bold font-heading mt-1">{item.role}</h3>
                  <span className="text-sm font-semibold text-cyan-400 block mt-0.5 mb-3">{item.company}</span>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Experience;
