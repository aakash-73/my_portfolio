import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const TiltCard = ({
  children,
  className = '',
  maxTilt = 15,
  perspective = 1000,
  scaleOnHover = 1.02,
  glareEnabled = true,
  // When true, disables 3D tilt so it doesn't interfere with
  // layout/height animations on the child card.
  disabled = false,
  ...props
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
  );

  const handleMouseMove = (e) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relX);
    y.set(relY);
  };

  const handleMouseEnter = () => { if (!disabled) setIsHovered(true); };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // When disabled (e.g. card is expanded), render a plain wrapper with
  // no 3D transforms so height changes are measured correctly.
  if (disabled) {
    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{ scale: { duration: 0.2 } }}
        className="relative w-full h-full"
      >
        {children}

        {glareEnabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />
        )}

        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              boxShadow:
                '0 20px 60px rgba(16, 185, 129, 0.15), 0 0 30px rgba(16, 185, 129, 0.05)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltCard;