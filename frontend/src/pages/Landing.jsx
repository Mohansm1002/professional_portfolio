import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import StatsBar from '../components/landing/StatsBar';
import About from '../components/landing/About';
import Skills from '../components/landing/Skills';
import Services from '../components/landing/Services';
import Projects from '../components/landing/Projects';
import Experience from '../components/landing/Experience';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import { addPortfolioUpdateListeners, fallbackPortfolioData, loadPortfolioData } from '../lib/api';

const Landing = () => {
  const [portfolio, setPortfolio] = useState(fallbackPortfolioData);
  const [status, setStatus] = useState('loading');

  const refreshData = useCallback(async () => {
    try {
      const data = await loadPortfolioData();
      setPortfolio(data);
      setStatus('live');
    } catch (error) {
      console.error('Could not load portfolio API data:', error);
      setStatus('offline');
    }
  }, []);

  useEffect(() => {
    refreshData();
    return addPortfolioUpdateListeners(refreshData);
  }, [refreshData]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0A0A12', color: '#cbd5e1' }}>
      {/* Background ambient blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/25 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-cyan-600/25 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-600/25 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {status === 'offline' && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-200 backdrop-blur">
          Backend offline. Showing cached demo data.
        </div>
      )}

      <Navbar hero={portfolio.hero} />

      <main>
        <Hero hero={portfolio.hero} socialLinks={portfolio.socialLinks} />
        <StatsBar stats={portfolio.stats} />
        <About about={portfolio.about} />
        <Skills skills={portfolio.skills} />
        <Services services={portfolio.services} />
        <Projects projects={portfolio.projects} />
        <Experience experience={portfolio.experience} />
        <Contact socialLinks={portfolio.socialLinks} />
      </main>

      <Footer hero={portfolio.hero} socialLinks={portfolio.socialLinks} settings={portfolio.settings} />
    </div>
  );
};

export default Landing;
