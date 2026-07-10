import React from 'react';
import { motion } from 'framer-motion';
import { Folder, Clock, Users, Star } from 'lucide-react';

const StatsBar = ({ stats = [] }) => {
  const getIcon = (name) => {
    switch(name.toLowerCase()) {
      case 'folder': return <Folder className="text-indigo-400 mb-3" size={32} />;
      case 'clock': return <Clock className="text-purple-400 mb-3" size={32} />;
      case 'users': return <Users className="text-cyan-400 mb-3" size={32} />;
      case 'star': return <Star className="text-yellow-400 mb-3" size={32} />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-12 px-6 relative z-20 -mt-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.id} 
              variants={itemVariants}
              className="glass-card p-6 flex flex-col items-center justify-center text-center"
            >
              {getIcon(stat.icon)}
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-bold font-heading text-white">{stat.number}</span>
                <span className="text-2xl font-bold text-cyan-400">{stat.suffix}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBar;
