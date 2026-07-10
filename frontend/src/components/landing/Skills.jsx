import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TechLogo } from '../common/TechIcon';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

const Skills = ({ skills = [] }) => {
  const [active, setActive] = useState('All');
  const categories = ['All', ...Array.from(new Set(skills.map(skill => skill.category).filter(Boolean)))];
  const filtered = active === 'All' ? skills : skills.filter(skill => skill.category === active);

  return (
    <section id="skills" className="py-24 px-6 relative">
      <div className="absolute right-[-200px] top-20 w-[500px] h-[500px] bg-indigo-700/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-tag">My Toolkit</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">Tech Stack &amp; Skills</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Tools and technologies I use to bring ideas to life.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                active === cat
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 border-transparent text-white shadow-lg shadow-purple-500/30'
                  : 'border-white/15 text-slate-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((skill, i) => {
            return (
              <motion.div
                key={skill.id || skill.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="glass-card min-h-44 p-5 flex flex-col items-center justify-between gap-3 text-center cursor-default"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
                  <TechLogo name={skill.icon_url || skill.name} size="lg" />
                </div>
                <span className="text-sm font-semibold text-slate-200 leading-snug break-words">{skill.name}</span>
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${skill.proficiency}%`, background: 'linear-gradient(90deg,#6366f1,#a855f7,#22d3ee)' }}
                  ></div>
                </div>
                <span className="text-xs text-slate-500">{skill.proficiency}%</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
