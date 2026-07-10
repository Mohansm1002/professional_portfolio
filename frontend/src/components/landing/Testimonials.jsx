import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = ({ testimonials = [] }) => {
  const [current, setCurrent] = useState(0);
  const safeTestimonials = testimonials.length ? testimonials : [];

  useEffect(() => {
    if (!safeTestimonials.length) return undefined;
    const timer = setInterval(() => {
      setCurrent(index => (index + 1) % safeTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [safeTestimonials.length]);

  if (!safeTestimonials.length) return null;

  const prev = () => setCurrent(index => (index - 1 + safeTestimonials.length) % safeTestimonials.length);
  const next = () => setCurrent(index => (index + 1) % safeTestimonials.length);
  const testimonial = safeTestimonials[current % safeTestimonials.length];

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute right-[-150px] bottom-0 w-[500px] h-[500px] bg-purple-700/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-tag">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mt-2">What Clients Say</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Real words from people I have worked with.</p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id || current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-10 text-center relative overflow-hidden"
            >
              <span className="absolute top-4 left-8 text-9xl font-serif text-purple-500/10 leading-none select-none">"</span>

              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>

              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8 italic relative z-10">
                "{testimonial.quote}"
              </p>

              <div className="flex flex-col items-center gap-3">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/50 shadow-lg shadow-purple-500/20"
                />
                <div>
                  <p className="font-bold font-heading text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.designation} @ {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/15 text-slate-400 hover:border-purple-500 hover:text-purple-400 transition-all flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {safeTestimonials.map((item, i) => (
                <button
                  key={item.id || i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 h-2.5 bg-purple-500' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/15 text-slate-400 hover:border-purple-500 hover:text-purple-400 transition-all flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
