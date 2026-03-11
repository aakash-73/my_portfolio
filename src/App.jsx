import React, { useState, useCallback } from 'react';
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
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence>
        {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white">
        <Header shouldStart={splashDone} />
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
