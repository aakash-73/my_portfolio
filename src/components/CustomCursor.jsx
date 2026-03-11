import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });
  const ringX = useSpring(0, { stiffness: 200, damping: 20 });
  const ringY = useSpring(0, { stiffness: 200, damping: 20 });

  useEffect(() => {
    // Check for touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    // Detect element types for cursor morphing
    const handleMouseOver = (e) => {
      const target = e.target;
      const closest = target.closest('a, button, [role="button"]');
      const projectCard = target.closest('[data-cursor="project"]');
      const contactSection = target.closest('#contact');

      if (projectCard) {
        setCursorVariant('project');
      } else if (closest) {
        setCursorVariant('interactive');
      } else if (contactSection) {
        setCursorVariant('contact');
      } else {
        setCursorVariant('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, ringX, ringY, visible]);

  if (isTouchDevice) return null;

  const ringVariants = {
    default: {
      width: 40,
      height: 40,
      borderColor: '#10B981',
      borderWidth: 2,
      backgroundColor: 'transparent',
      scale: 1,
    },
    interactive: {
      width: 56,
      height: 56,
      borderColor: '#EF4444',
      borderWidth: 2,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      scale: 1.2,
    },
    project: {
      width: 64,
      height: 64,
      borderColor: '#10B981',
      borderWidth: 2,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      scale: 1.3,
    },
    contact: {
      width: 52,
      height: 52,
      borderColor: '#EF4444',
      borderWidth: 2,
      backgroundColor: 'rgba(239, 68, 68, 0.06)',
      scale: 1.1,
    },
  };

  const dotVariants = {
    default: { width: 6, height: 6, backgroundColor: '#ffffff' },
    interactive: { width: 4, height: 4, backgroundColor: '#EF4444' },
    project: { width: 0, height: 0, backgroundColor: 'transparent' },
    contact: { width: 5, height: 5, backgroundColor: '#EF4444' },
  };

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={dotVariants[cursorVariant]}
        transition={{ duration: 0.15 }}
        initial={false}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-solid flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          borderRadius: '9999px !important',
        }}
        animate={ringVariants[cursorVariant]}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        initial={false}
      >
        {/* Project mode text */}
        {cursorVariant === 'project' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-pale-green text-xs font-bold"
            style={{ fontSize: '9px', letterSpacing: '0.05em' }}
          >
            {'</>'}
          </motion.span>
        )}

        {/* Contact mode icon */}
        {cursorVariant === 'contact' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-xs"
          >
            ✉
          </motion.span>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
