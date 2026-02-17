import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { personalInfo } from '../data';
import PersonalSticker from './PersonalSticker';
import GeometricBackground from './GeometricBackground';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [introDone, setIntroDone] = useState(false);
  const [showMailPopup, setShowMailPopup] = useState(false);
  // Sequencing controls
  const bgControls = useAnimationControls();
  const stickerControls = useAnimationControls();
  const contentControls = useAnimationControls();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 50);
      setAtTop(y === 0);
    };

    handleScroll(); // init
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMailChoice = (type) => {
    const subject = encodeURIComponent("Portfolio Contact");
    const body = encodeURIComponent("Hi,\n\n");

    const mailtoLink = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${personalInfo.email}&su=${subject}&body=${body}`;
    const outlookWebLink = `https://outlook.live.com/mail/0/deeplink/compose?to=${personalInfo.email}&subject=${subject}&body=${body}`;

    switch (type) {
      case "gmail":
        window.open(gmailLink, "_blank");
        break;
      case "outlook-web":
        window.open(outlookWebLink, "_blank");
        break;
      default:
        window.location.href = mailtoLink;
    }

    setShowMailPopup(false);
  };

  // Enhanced intro sequence with sticker build time
  useEffect(() => {
    const runSequence = async () => {
      // Step 1: Build background
      await bgControls.start('build');
      await bgControls.start('spread');

      // Step 2: Build sticker at center (wait for sticker to complete its 3s build animation)
      await stickerControls.start('buildCenter');

      // Give the sticker animation time to complete (3.3 seconds total for all 8 steps)
      await new Promise(resolve => setTimeout(resolve, 3300));

      // Step 3: After sticker is fully built, dock everything left and reveal content
      bgControls.start('dockLeft');
      stickerControls.start('dockLeft');
      contentControls.start('revealFromBehindSticker');

      setIntroDone(true);
    };

    runSequence();
  }, [bgControls, stickerControls, contentControls]);

  /**
   * Scroll interaction (AFTER intro):
   * - If NOT at top (any scrollY > 0): sticker stays CENTER and content stays hidden behind it
   * - ONLY when completely at top (scrollY === 0): sticker moves LEFT and content reveals from behind it
   */
  useEffect(() => {
    if (!introDone) return;

    if (!atTop) {
      // Any amount of scroll down OR scrolling back up but not fully at top
      stickerControls.start('center');
      contentControls.start('hideBehindSticker');
    } else {
      // Fully at top -> now move sticker left AND reveal content from behind
      stickerControls.start('dockLeft');
      contentControls.start('revealFromBehindSticker');
    }
  }, [atTop, introDone, stickerControls, contentControls]);

  // ---------------- Variants ----------------

  const bgPanelVariants = {
    initial: { opacity: 0, scale: 0.92, x: 0, filter: 'blur(6px)' },
    build: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 1.0, ease: 'easeOut' },
    },
    spread: {
      scale: [1, 1.03, 1],
      transition: { duration: 1.1, ease: 'easeInOut' },
    },
    dockLeft: {
      x: '-26vw',
      scale: 0.95,
      transition: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }, // Enhanced easing
    },
  };

  const stickerVariants = {
    initial: { opacity: 0, scale: 0.85, y: 14, x: 0 },

    buildCenter: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },

    dockLeft: {
      x: '-28vw',
      scale: 0.85,
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1], // Bouncy easing to match sticker animations
      },
    },

    // Center state on scroll (larger and more dramatic)
    center: {
      x: 0,
      scale: 1.15, // Slightly larger when centered
      transition: {
        duration: 1.0,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  // Content: slides behind sticker + hides, then reveals from behind when sticker moves left
  const contentGroupVariants = {
    revealFromBehindSticker: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1.0,
        ease: [0.19, 1, 0.22, 1], // Smooth reveal
        delay: 0.2, // Slight delay for dramatic effect
      },
    },
    hideBehindSticker: {
      x: -140,
      opacity: 0.98,
      transition: {
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1],
      },
    },
  };

  const contentInnerVariants = {
    initial: { opacity: 0, y: 6 },
    revealFromBehindSticker: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.4, // Cascade after group movement
      },
    },
    hideBehindSticker: {
      opacity: 0,
      y: 6,
      transition: { duration: 0.45, ease: 'easeIn' },
    },
  };

  // ---------------- Render ----------------

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black border-b-2 border-pale-green shadow-lg' : 'bg-transparent'
          }`}
      >
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
      <header className="relative min-h-screen overflow-hidden bg-black flex items-center">
        {/* Base background */}
        <div className="absolute inset-0 z-0">
          <GeometricBackground variant="dark" />
        </div>

        {/* Content layer (below sticker but above base bg) */}
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
                    className="relative"
                  >
                    <motion.h1
                      className="text-5xl md:text-7xl font-black mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 4.8, duration: 0.8 }}
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
                      className="space-y-2 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 5.0, duration: 0.8 }}
                    >
                      <p className="text-2xl md:text-3xl text-pale-green font-bold tracking-wide">
                        {'<'} {personalInfo.title} {' />'}
                      </p>
                      <p className="text-xl md:text-2xl text-white font-light">
                        {personalInfo.subtitle}
                      </p>
                    </motion.div>

                    <motion.p
                      className="text-lg text-gray-400 mb-8 max-w-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 5.2, duration: 0.8 }}
                    >
                      {personalInfo.tagline}
                    </motion.p>

                    <motion.div
                      className="flex flex-wrap gap-4 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 5.4, duration: 0.8 }}
                    >
                      <motion.button
                        onClick={() => setShowMailPopup(true)}
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
                      </motion.button>
                      <motion.button
                        onClick={() => scrollToSection('projects')}
                        className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Projects
                      </motion.button>
                    </motion.div>

                    <motion.div
                      className="flex flex-wrap gap-6 text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 5.6, duration: 0.8 }}
                    >
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="flex items-center gap-2 hover:text-pale-green transition-colors"
                      >
                        <FaEnvelope /> {personalInfo.email}
                      </a>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Sticker mask (moves exactly with sticker) */}
              {/* Transparent Mask Layer */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                variants={{
                  dockLeft: { x: '-28vw' },
                  center: { x: 0 },
                  buildCenter: { x: 0 },
                  initial: { x: 0 },
                }}
                initial="initial"
                animate={stickerControls}
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  WebkitMaskImage: 'radial-gradient(circle 310px at center, transparent 99%, black 100%)',
                  maskImage: 'radial-gradient(circle 310px at center, transparent 99%, black 100%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
            </div>
          </div>
        </div>

        {/* Center panel BG build/spread -> dock left */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          variants={bgPanelVariants}
          initial="initial"
          animate={bgControls}
        >
          <div className="relative w-[92vw] h-[92vh] md:w-[75vw] md:h-[82vh] rounded-3xl overflow-hidden">
          </div>
        </motion.div>

        {/* Sticker top layer */}
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
          variants={stickerVariants}
          initial="initial"
          animate={stickerControls}
          style={{ transformOrigin: 'center center' }}
        >
          <div className="pointer-events-auto">
            <PersonalSticker size={600} />
          </div>
        </motion.div>

        {/* Scroll Down Indicator - appears after intro */}
        <motion.button
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-pale-green z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: introDone ? 1 : 0,
            y: introDone ? [0, 10, 0] : -20
          }}
          transition={{
            opacity: { delay: 5.8, duration: 0.5 },
            y: { duration: 2, repeat: Infinity, delay: 5.8 }
          }}
        >
          <FaChevronDown size={32} />
        </motion.button>
        {showMailPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black border-4 border-pale-green p-8 rounded-xl text-white w-[90%] max-w-md"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                Choose Email Method
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => handleMailChoice("default")}
                  className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-all"
                >
                  Default Mail App
                </button>

                <button
                  onClick={() => handleMailChoice("gmail")}
                  className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-all"
                >
                  Gmail (Browser)
                </button>

                <button
                  onClick={() => handleMailChoice("outlook-web")}
                  className="w-full py-3 border-2 border-white hover:bg-white hover:text-black transition-all"
                >
                  Outlook Web
                </button>

                <button
                  onClick={() => setShowMailPopup(false)}
                  className="w-full py-3 text-gray-400 hover:text-white"
                >
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