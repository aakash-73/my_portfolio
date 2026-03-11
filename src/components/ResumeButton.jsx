import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileDownload, FaCheck } from 'react-icons/fa';

const ResumeButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {

    // Trigger download
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Aakash_Reddy_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show confirmation
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <motion.button
      onClick={handleDownload}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-pale-green text-black font-bold uppercase tracking-wider overflow-hidden group text-xs sm:text-sm md:text-base"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background slide animation */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
      />

      {/* Paper unfold layers on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              className="absolute top-0 right-0 w-6 h-6 bg-black opacity-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-1 sm:gap-2">
        <AnimatePresence mode="wait">
          {downloaded ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              className="flex items-center gap-2 text-pale-green"
            >
              <FaCheck /> Downloaded!
            </motion.span>
          ) : (
            <motion.span
              key="download"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={isHovered ? { y: [0, -3, 0] } : { y: 0 }}
                transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
              >
                <FaFileDownload className="text-sm md:text-base" />
              </motion.span>
              Resume
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
};

export default ResumeButton;
