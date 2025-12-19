import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { personalInfo } from '../data';
import PersonalSticker from './PersonalSticker';
import GeometricBackground from "./GeometricBackground";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black border-b-2 border-pale-green shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-black text-white hover:text-pale-green transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-red-500">{'<'}</span>
              AN
              <span className="text-red-500">{'/>'}</span>
            </motion.button>
            
            <div className="hidden md:flex space-x-8">
              {['about', 'experience', 'projects', 'skills', 'education', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-white hover:text-pale-green transition-colors uppercase font-bold text-sm tracking-wider relative group"
                >
                  {section}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <motion.a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-pale-green transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-pale-green transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
              >
                <FaLinkedin size={20} />
              </motion.a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Geometric Background Pattern */}
        <GeometricBackground variant="dark" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Sticker */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <PersonalSticker size={600} />
            </motion.div>

            {/* Right Side - Info */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              
              <h1 className="text-5xl md:text-7xl font-black mb-4">
                <span className="text-white">{personalInfo.name.split(' ')[0]}</span>
                <br />
                <span className="text-red-500">{personalInfo.name.split(' ').slice(1).join(' ')}</span>
              </h1>
              
              <div className="space-y-2 mb-6">
                <p className="text-2xl md:text-3xl text-pale-green font-bold tracking-wide">
                  {'<'} {personalInfo.title} {' />'}
                </p>
                <p className="text-xl md:text-2xl text-white font-light">
                  {personalInfo.subtitle}
                </p>
              </div>
              
              <p className="text-lg text-gray-400 mb-8 max-w-xl">
                {personalInfo.tagline}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.a 
                  href={`mailto:${personalInfo.email}`}
                  className="px-8 py-4 bg-red-500 text-white font-bold uppercase tracking-wider hover:bg-red-600 transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FaEnvelope /> Get In Touch
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-pale-green"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
                
                <motion.button
                  onClick={() => scrollToSection('projects')}
                  className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Projects
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-6 text-gray-400">
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-pale-green transition-colors">
                  <FaEnvelope /> {personalInfo.email}
                </a>
              </div>
            </motion.div>
          </div>

        </div>
        <div>
          <motion.button
            onClick={() => scrollToSection('about')}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-pale-green"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaChevronDown size={32} />
          </motion.button>
        </div>
      </header>
    </>
  );
};

export default Header;
