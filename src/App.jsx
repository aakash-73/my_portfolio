import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import SplashScreen from './components/SplashScreen';
import './index.css';

function App() {
  const [transitionDone, setTransitionDone] = useState(false);
  const [headerReady, setHeaderReady] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setTransitionDone(true);
  }, []);

  const handleHeaderReady = useCallback(() => {
    setHeaderReady(true);
  }, []);

  useEffect(() => {
    // Force scroll to top on initial load so splash screen is viewed properly
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (!transitionDone || !headerReady) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [transitionDone, headerReady]);

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {!transitionDone && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white">
        <Header shouldStart={transitionDone} onReady={handleHeaderReady} />
        <main>
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Contact />
        </main>
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;