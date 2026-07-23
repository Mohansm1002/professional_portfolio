import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { getFileDownloadUrl } from '../../lib/api';

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const About = ({ about }) => {
  const cvHref = getFileDownloadUrl(about?.cv_url);
  const hasCv = cvHref && cvHref !== '#';

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex justify-center lg:justify-start"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl blur-xl opacity-30 scale-105"></div>
            <div className="relative w-80 h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={about?.photo_url} alt="About" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card px-5 py-3 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-white">Open to Work</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="section-tag">About Me</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
            {about?.heading}
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">{about?.bio}</p>

          <ul className="space-y-3">
            {(about?.highlights || []).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"></span>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <a
              href={cvHref}
              download
              onClick={(event) => {
                if (!hasCv) event.preventDefault();
              }}
              className={`btn-primary ${hasCv ? '' : 'pointer-events-none opacity-60'}`}
            >
              <Download size={18} />
              Download CV
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
