import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const PersonalSticker = ({ size = 300 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

  // Smooth springs for 3D rotation to prevent jitter
  const xSpring = useSpring(0, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(0, { stiffness: 150, damping: 20 });

  // Map mouse position to degrees of rotation (tilt)
  const rotateX = useTransform(ySpring, [-1, 1], [20, -20]);
  const rotateY = useTransform(xSpring, [-1, 1], [-20, 20]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x, y });
    xSpring.set(x);
    ySpring.set(y);
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    xSpring.set(0);
    ySpring.set(0);
  };

  const handleClick = () => setIsFlipped((v) => !v);

  // Auto-flip every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper to generate regular hexagon points
  const hexagonPoints = (radius = 50, cx = 50, cy = 50) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i - Math.PI / 6;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  // --- Orbiting items config (angles unchanged) ---
  const orbitingItems = [
    { shape: 'triangle', angle: 0, color: 'bg-green-500', invert: false },
    { shape: 'square', angle: 90, color: 'bg-red-500' },
    { shape: 'triangle', angle: 180, color: 'bg-green-500', invert: true }, // inverted
    { shape: 'square', angle: 270, color: 'bg-red-500' },
  ];

  // ✅ Add MORE distance between the two triangles without changing angles:
  // Move triangles closer to center (smaller radius) OR push squares outward (bigger radius)
  // Here we do BOTH slightly for a clearer separation.
  const TRIANGLE_RADIUS = size / 2.2; // was 2.8 (smaller => triangles move inward)
  const SQUARE_RADIUS = size / 2.2;  // was 2.2 (bigger => squares move outward)

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Container that tilts based on mouse */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer rotating circles */}
        <motion.div
          className="absolute w-full h-full"
          style={{ transform: 'translateZ(-50px)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 360,
            x: mousePosition.x * 15,
            y: mousePosition.y * 15,
          }}
          transition={{
            scale: { delay: 0, duration: 0.6 },
            opacity: { delay: 0, duration: 0.6 },
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
            x: { duration: 0 },
            y: { duration: 0 },
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.4" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.3"
            />
          </svg>
        </motion.div>

        {/* Rotating triangles around */}
        <motion.div
          className="absolute w-full h-full"
          style={{ transform: 'translateZ(-20px)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: -360,
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{
            scale: { delay: 0.2, duration: 0.6 },
            opacity: { delay: 0.2, duration: 0.6 },
            rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
            x: { duration: 0 },
            y: { duration: 0 },
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${angle}deg) translateX(${size * 0.42}px) translateY(-50%)`,
              }}
            >
              <div
                className="w-0 h-0 opacity-30"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '12px solid #10B981',
                  filter: 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.5))',
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Middle geometric layer - squares */}
        <motion.div
          className="absolute w-4/5 h-4/5"
          style={{ transform: 'translateZ(20px)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: [0, 5, -5, 0],
            x: mousePosition.x * 25,
            y: mousePosition.y * 25,
          }}
          transition={{
            scale: { delay: 0.4, duration: 0.6 },
            opacity: { delay: 0.4, duration: 0.6 },
            rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 0 },
            y: { duration: 0 },
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-6 h-6 bg-red-500 border-2 border-white" />
            <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 border-2 border-white" />
            <div className="absolute bottom-0 left-0 w-6 h-6 bg-green-500 border-2 border-white" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-500 border-2 border-white" />
          </div>
        </motion.div>

        {/* Big triangle behind center */}
        <motion.div
          className="absolute w-100 h-100"
          style={{ transform: 'translateZ(40px)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: mousePosition.x * 35,
            y: mousePosition.y * 35 - 20,
          }}
          transition={{
            scale: { delay: 0.6, duration: 0.6 },
            opacity: { delay: 0.6, duration: 0.6 },
            x: { duration: 0 },
            y: { duration: 0 },
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 90,85 10,85" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* Flipping card */}
        <motion.div
          className="absolute w-5/6 h-5/6 cursor-pointer overflow-hidden"
          style={{
            perspective: 1000,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(80px)',
            WebkitTransformStyle: 'preserve-3d',
            isolation: 'isolate',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: mousePosition.x * 30,
            y: mousePosition.y * 30,
          }}
          transition={{
            scale: { delay: 0.8, duration: 0.6 },
            opacity: { delay: 0.8, duration: 0.6 },
            x: { duration: 0 },
            y: { duration: 0 },
          }}
          onClick={handleClick}
        >
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
            }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* Front - Regular Hexagon */}
            <div
              className="absolute w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0.1px)',
              }}
            >
              <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <clipPath id="hexClip">
                    <polygon points={hexagonPoints(46, 50, 50)} />
                  </clipPath>
                </defs>

                <polygon
                  points={hexagonPoints(46, 50, 50)}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                <image
                  href="./assets/profilePic.png"
                  x="-5"
                  y="-5"
                  width="110"
                  height="110"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#hexClip)"
                />
              </svg>
            </div>

            {/* Back - Face sticker */}
            <div
              className="absolute w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(0.1px)',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className="absolute top-1/2 left-1/2 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-2xl flex items-center justify-center overflow-hidden"
                  style={{
                    width: '80%',
                    height: '80%',
                    transform: 'translate(-50%, -50%)',
                    border: `${size * 0.013}px solid #10B981`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-400 to-orange-600" />

                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <rect x="20" y="35" width="25" height="18" fill="rgba(0,0,0,0.7)" stroke="#000" strokeWidth="3" />
                    <rect x="55" y="35" width="25" height="18" fill="rgba(0,0,0,0.7)" stroke="#000" strokeWidth="3" />
                    <line x1="45" y1="44" x2="55" y2="44" stroke="#000" strokeWidth="3" />
                    <rect x="24" y="38" width="6" height="4" fill="white" opacity="0.6" />
                    <rect x="59" y="38" width="6" height="4" fill="white" opacity="0.6" />
                  </svg>

                  <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path d="M 30 60 Q 50 75 70 60" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                    <rect x="45" y="62" width="3" height="5" fill="white" />
                    <rect x="49" y="62" width="3" height="5" fill="white" />
                    <rect x="53" y="62" width="3" height="5" fill="white" />
                  </motion.svg>

                  <div className="absolute -top-2 left-0 right-0">
                    <svg viewBox="0 0 100 30" className="w-full">
                      <path d="M 0 20 Q 25 5, 50 15 Q 75 25, 100 10 L 100 30 L 0 30 Z" fill="#1a1a1a" />
                    </svg>
                  </div>

                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-white font-black text-xs tracking-wider">{'</>'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Initials overlay */}
        <motion.div
          className="absolute bottom-8 bg-black border-4 border-[#10B981] px-5 py-3"
          style={{ transform: 'translateZ(120px)' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: [0, -5, 0],
            opacity: 1,
            x: mousePosition.x * 45,
          }}
          transition={{
            y: { duration: 2, repeat: Infinity, delay: 1.2 },
            opacity: { delay: 1.2, duration: 0.6 },
            x: { duration: 0 },
          }}
        >
          <div className="text-white font-black text-3xl tracking-widest">AN</div>
        </motion.div>

        {/* Orbiting geometric shapes (fixed syntax + more separation between triangles) */}
        {orbitingItems.map((item, i) => {
          const baseRadius = item.shape === 'square' ? SQUARE_RADIUS : TRIANGLE_RADIUS;
          const triColor = item.color === 'bg-red-500' ? '#EF4444' : '#10B981';

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{ transform: 'translateZ(60px)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: [
                  Math.cos((item.angle * Math.PI) / 180) * baseRadius + mousePosition.x * 50,
                  Math.cos(((item.angle + 360) * Math.PI) / 180) * baseRadius + mousePosition.x * 50,
                ],
                y: [
                  Math.sin((item.angle * Math.PI) / 180) * baseRadius + mousePosition.y * 50,
                  Math.sin(((item.angle + 360) * Math.PI) / 180) * baseRadius + mousePosition.y * 50,
                ],
              }}
              transition={{
                scale: { delay: 1.4 + i * 0.1, duration: 0.4 },
                opacity: { delay: 1.4 + i * 0.1, duration: 0.4 },
                x: { duration: 6, repeat: Infinity, ease: 'linear', delay: i * 0.4 },
                y: { duration: 6, repeat: Infinity, ease: 'linear', delay: i * 0.4 },
              }}
            >
              {item.shape === 'square' && <div className={`w-4 h-4 ${item.color}`} />}

              {item.shape === 'triangle' && (
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    ...(item.invert
                      ? { borderTop: `8px solid ${triColor}` }
                      : { borderBottom: `8px solid ${triColor}` }),
                  }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Floating small geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`float-${i}`}
            className={`absolute w-2 h-2 ${i % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{
              left: `${20 + i * 10}%`,
              top: `${10 + (i % 4) * 20}%`,
              transform: 'translateZ(10px)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.5, 1],
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              x: mousePosition.x * (10 + i * 2),
            }}
            transition={{
              scale: { duration: 3, repeat: Infinity, delay: 1.8 + i * 0.1 },
              y: { duration: 3, repeat: Infinity, delay: 1.8 + i * 0.1 },
              opacity: { duration: 3, repeat: Infinity, delay: 1.8 + i * 0.1 },
              x: { duration: 0 },
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PersonalSticker;
