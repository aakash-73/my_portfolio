import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </div>
  );
}

export default App;
