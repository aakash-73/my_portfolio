import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { personalInfo } from '../data';
import PersonalSticker from './PersonalSticker';
import GeometricBackground from './GeometricBackground';
import ResumeButton from './ResumeButton';

// ── These must match PersonalSticker's constants exactly ─────────────────────
const PS_STAGGER = 0.18;   // seconds between each layer
const PS_DURATION = 0.75;   // each layer's animation duration
const PS_LAST_KEY_LAYER = 9; // last orbital (layer index 9 = 4th orbital shape)

// Total time until the sticker is fully assembled
const RECONSTRUCTION_MS =
  Math.ceil((PS_LAST_KEY_LAYER * PS_STAGGER + PS_DURATION) * 1000) + 400; // +400ms "rest" pause

const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

const Header = ({ shouldStart = true, onReady }) => {
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [introDone, setIntroDone] = useState(false);
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stickerMounted, setStickerMounted] = useState(false);

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  const bgControls = useAnimationControls();
  const stickerControls = useAnimationControls();
  const contentControls = useAnimationControls();
  const arrowControls = useAnimationControls();

  // ── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setAtTop(y === 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Arrow bounce ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!introDone) return;
    if (atTop) {
      arrowControls.start({
        opacity: 1,
        y: [0, 10, 0],
        transition: { opacity: { duration: 0.6 }, y: { duration: 2, repeat: Infinity } },
      });
    } else {
      arrowControls.start({ opacity: 0, y: -20, transition: { duration: 0.5 } });
    }
  }, [atTop, introDone, arrowControls]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMailChoice = (type) => {
    const subject = encodeURIComponent('Portfolio Contact');
    const body = encodeURIComponent('Hi,\n\n');
    const mailto = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${personalInfo.email}&su=${subject}&body=${body}`;
    const outlook = `https://outlook.live.com/mail/0/deeplink/compose?to=${personalInfo.email}&subject=${subject}&body=${body}`;
    if (type === 'gmail') window.open(gmail, '_blank');
    else if (type === 'outlook-web') window.open(outlook, '_blank');
    else window.location.href = mailto;
    setShowMailPopup(false);
  };

  // ── Main sequence ─────────────────────────────────────────────────────────
  // 1. Mount sticker → reconstruction animation plays automatically
  // 2. Wait until every layer has zoomed in (RECONSTRUCTION_MS)
  // 3. Slide sticker left + reveal content simultaneously
  useEffect(() => {
    if (!shouldStart) return;

    let cancelled = false;
    const run = async () => {
      // Step 1 — mount the sticker so its zoom-in begins immediately
      setStickerMounted(true);

      // Step 2 — wait for full reconstruction
      await new Promise(r => setTimeout(r, RECONSTRUCTION_MS));
      if (cancelled) return;

      // Step 3 — slide left and reveal content at the same time
      bgControls.set('dockLeft');
      stickerControls.start('dockLeft');
      contentControls.start('revealFromBehindSticker');
      setIntroDone(true);
      
      // Wait for all text elements to finish fading in (longest animation takes 1.9s)
      setTimeout(() => {
        if (!cancelled && onReady) onReady();
      }, 2000);
    };

    run();
    return () => { cancelled = true; };
  }, [shouldStart, bgControls, stickerControls, contentControls, onReady]);

  // ── Scroll-driven sticker position (after intro) ──────────────────────────
  useEffect(() => {
    if (!introDone) return;
    if (!atTop) {
      stickerControls.start('center');
      contentControls.start('hideBehindSticker');
    } else {
      stickerControls.start('dockLeft');
      contentControls.start('revealFromBehindSticker');
    }
  }, [atTop, introDone, isMobile, stickerControls, contentControls]);

  // ── Variants ──────────────────────────────────────────────────────────────

  const bgPanelVariants = {
    initial: { opacity: 0, scale: 0.92, x: 0, filter: 'blur(6px)' },
    build: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.0, ease: 'easeOut' } },
    dockLeft: { x: '-26vw', scale: 0.95, transition: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] } },
  };

  const stickerVariants = {
    // Sticker starts centered at full scale — reconstruction plays in-place
    initial: { opacity: 1, scale: 1, x: 0, y: 0 },
    dockLeft: {
      x: isMobile ? 0 : '-28vw',
      y: isMobile ? '-22dvh' : 0,
      scale: isMobile ? 0.35 : 0.85,
      transition: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
    },
    center: {
      x: 0,
      y: isMobile ? '-20dvh' : 0,
      scale: isMobile ? 0.4 : 1.15,
      transition: { duration: 1.0, ease: [0.34, 1.56, 0.64, 1] },
    },
  };

  const contentGroupVariants = {
    revealFromBehindSticker: {
      x: 0,
      y: isMobile ? '5dvh' : 0,
      opacity: 1,
      transition: { duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: 0.2 },
    },
    hideBehindSticker: {
      x: isMobile ? 0 : -140,
      y: isMobile ? '-15dvh' : 0,
      opacity: isMobile ? 0 : 0.98,
      transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
    },
  };

  const contentInnerVariants = {
    initial: { opacity: 0, y: 6 },
    revealFromBehindSticker: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
    },
    hideBehindSticker: {
      opacity: 0, y: 6,
      transition: { duration: 0.45, ease: 'easeIn' },
    },
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${scrolled ? 'bg-black border-b-2 border-pale-green shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-black text-white hover:text-pale-green transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            >
              <span className="text-red-500">{'<'}</span>AN<span className="text-red-500">{'/>'}</span>
            </motion.button>

            <div className="hidden md:flex space-x-8">
              {['about', 'experience', 'projects', 'skills', 'education', 'contact'].map((s) => (
                <button key={s} onClick={() => scrollToSection(s)}
                  className="text-white hover:text-pale-green transition-colors uppercase font-bold text-sm tracking-wider relative group">
                  {s}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            <div className="hidden md:flex space-x-4">
              <motion.a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-pale-green transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}>
                <FaGithub size={20} />
              </motion.a>
              <motion.a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-pale-green transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}>
                <FaLinkedin size={20} />
              </motion.a>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-pale-green transition-colors p-2"
                aria-label="Toggle mobile menu">
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
              animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
              exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[60] bg-black bg-opacity-95 backdrop-blur-xl flex flex-col justify-center items-center overflow-hidden"
            >
              <GeometricBackground variant="dark" />
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-500 opacity-10 transform rotate-12 pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-pale-green opacity-5 pointer-events-none" />
              <button onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 right-5 text-white hover:text-red-500 transition-colors p-2 z-20"
                aria-label="Close mobile menu">
                <FaTimes size={32} />
              </button>
              <div className="flex flex-col items-center space-y-6 z-10 w-full px-4">
                {['about', 'experience', 'projects', 'skills', 'education', 'contact'].map((s, i) => (
                  <motion.div key={s}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                    className="w-full text-center flex justify-center">
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => scrollToSection(s), 500); }}
                      className="text-white hover:text-pale-green transition-colors uppercase font-black text-3xl sm:text-4xl tracking-widest relative group py-2 px-6 overflow-hidden">
                      <span className="relative z-10">{s}</span>
                      <span className="absolute inset-0 w-full h-full bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 -z-10" />
                    </button>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: 0.7, duration: 0.4 }}
                  className="flex space-x-8 pt-8 mt-4 border-t-2 border-gray-800 w-2/3 justify-center">
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white hover:scale-110 transition-all p-2">
                    <FaGithub size={36} />
                  </a>
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white hover:scale-110 transition-all p-2">
                    <FaLinkedin size={36} />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[100dvh] overflow-hidden bg-black flex items-center pt-16">

        <div className="absolute inset-0 z-0">
          <GeometricBackground variant="dark" />
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden">

              <motion.div
                className="relative"
                variants={contentGroupVariants}
                initial="hideBehindSticker"
                animate={contentControls}
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="hidden md:block" />

                  <motion.div
                    variants={contentInnerVariants}
                    initial="initial"
                    animate={contentControls}
                    className="relative flex flex-col items-center text-center md:items-start md:text-left pt-[35dvh] md:pt-0 pb-16 md:pb-0"
                  >
                    <motion.h1
                      className="text-3xl sm:text-5xl md:text-7xl font-black mb-1 md:mb-4 z-10 leading-tight"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <span className="text-white">
                        {personalInfo.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <br />
                      <span className="text-red-500">
                        {personalInfo.name.split(' ').slice(2).join(' ')}
                      </span>
                    </motion.h1>

                    <motion.div
                      className="space-y-1 md:space-y-2 mb-3 md:mb-6"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      <p className="text-xl md:text-3xl text-pale-green font-bold tracking-wide">
                        {'<'} {personalInfo.title} {' />'}
                      </p>
                      <p className="text-lg md:text-2xl text-white font-light">
                        {personalInfo.subtitle}
                      </p>
                    </motion.div>

                    <motion.p
                      className="text-sm sm:text-base md:text-lg text-gray-400 mb-4 md:mb-8 max-w-xl"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      {personalInfo.tagline}
                    </motion.p>

                    <motion.div
                      className="flex flex-row flex-wrap gap-2 sm:gap-3 md:gap-4 mb-2 md:mb-8 justify-center md:justify-start"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    >
                      <motion.button
                        onClick={() => setShowMailPopup(true)}
                        className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-red-500 text-white font-bold uppercase tracking-wider hover:bg-red-600 transition-colors relative overflow-hidden group text-xs sm:text-sm md:text-base"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 flex items-center gap-1 sm:gap-2 text-white group-hover:text-black transition-colors duration-300">
                          <FaEnvelope className="text-sm md:text-base" /> Get In Touch
                        </span>
                        <motion.div className="absolute inset-0 bg-pale-green"
                          initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
                      </motion.button>

                      <motion.button
                        onClick={() => scrollToSection('projects')}
                        className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all text-xs sm:text-sm md:text-base"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">View Projects</span>
                      </motion.button>

                      <ResumeButton />
                    </motion.div>

                    <motion.div
                      className="hidden md:flex flex-wrap gap-6 text-gray-400 justify-start"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 1.1, duration: 0.8 }}
                    >
                      <a href={`mailto:${personalInfo.email}`}
                        className="flex items-center gap-2 hover:text-pale-green transition-colors">
                        <FaEnvelope /> {personalInfo.email}
                      </a>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Transparent mask (desktop) */}
              <motion.div
                className="hidden md:block absolute inset-0 z-20 pointer-events-none"
                variants={{ dockLeft: { x: '-28vw' }, center: { x: 0 }, initial: { x: 0 } }}
                initial="initial"
                animate={stickerControls}
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  WebkitMaskImage: 'radial-gradient(circle 310px at center, transparent 99%, black 100%)',
                  maskImage: 'radial-gradient(circle 310px at center, transparent 99%, black 100%)',
                  WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center', maskPosition: 'center',
                }}
              />
            </div>
          </div>
        </div>

        {/* BG panel */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          variants={bgPanelVariants} initial="initial" animate={bgControls}
        >
          <div className="relative w-[92vw] h-[92dvh] md:w-[75vw] md:h-[82dvh] rounded-3xl overflow-hidden" />
        </motion.div>

        {/*
          Sticker wrapper — starts centered at scale 1, no pre-transform.
          PersonalSticker handles its own layer-by-layer zoom-in internally.
          Once reconstruction is done, stickerVariants.dockLeft slides it left.
        */}
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
          variants={stickerVariants}
          initial="initial"
          animate={introDone ? stickerControls : undefined}
          style={{ transformOrigin: 'center center' }}
        >
          {stickerMounted && (
            <div className="pointer-events-auto">
              <PersonalSticker size={650} skipIntro={false} />
            </div>
          )}
        </motion.div>

        {/* Scroll arrow */}
        <motion.button
          onClick={() => scrollToSection('about')}
          className="absolute left-1/2 -translate-x-1/2 bottom-2 md:bottom-8 text-pale-green z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={arrowControls}
        >
          <FaChevronDown size={30} className="md:w-8 md:h-8 w-6 h-6" />
        </motion.button>

        {/* Mail popup */}
        {showMailPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center"
            onClick={() => setShowMailPopup(false)}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-black border-4 border-pale-green p-8 rounded-xl text-white w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Choose Email Method</h3>
              <div className="space-y-4">
                {[
                  { label: 'Default Mail App', type: 'default' },
                  { label: 'Gmail (Browser)', type: 'gmail' },
                  { label: 'Outlook Web', type: 'outlook-web' },
                ].map(({ label, type }) => (
                  <button key={type} onClick={() => handleMailChoice(type)}
                    className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-all">
                    {label}
                  </button>
                ))}
                <button onClick={() => setShowMailPopup(false)}
                  className="w-full py-3 text-gray-400 hover:text-white">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;