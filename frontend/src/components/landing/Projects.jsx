import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Eye, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { TechChip } from '../common/TechIcon';

const Modal = ({ project, onClose }) => (
  <AnimatePresence>
    {project && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <motion.div
          className="relative z-10 w-full max-w-2xl glass-card overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <img src={project.cover} alt={project.title} className="w-full h-56 object-cover" />
          <div className="p-7">
            <h3 className="text-2xl font-bold font-heading mb-3">{project.title}</h3>
            <p className="text-slate-400 mb-5 leading-relaxed">{project.desc}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <TechChip key={tag} name={tag} className="max-w-full" />
              ))}
            </div>
            <div className="flex gap-4">
              <a href={project.live_url} className="btn-primary text-sm py-2 px-5">
                <ExternalLink size={15} /> Live Demo
              </a>
              <a href={project.repo_url} className="btn-secondary text-sm py-2 px-5">
                <FaGithub size={15} /> Source Code
              </a>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Projects = ({ projects = [] }) => {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute right-[-150px] top-40 w-[400px] h-[400px] bg-cyan-700/10 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-tag">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">Featured Projects</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">A selection of work I am proud of. Click any card to learn more.</p>
        </motion.div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => setSelected(project)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={project.cover} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a href={project.live_url} onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <ExternalLink size={18} />
                    </a>
                    <a href={project.repo_url} onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <FaGithub size={18} />
                    </a>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">{project.category}</span>
                  <h3 className="text-lg font-bold font-heading mt-1 mb-3">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map(tag => (
                      <TechChip key={tag} name={tag} className="max-w-[9rem]" />
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/6 border border-white/10 text-slate-500">+{project.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Modal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Projects;
