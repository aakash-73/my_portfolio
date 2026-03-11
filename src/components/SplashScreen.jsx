import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('build');

  const COLORS = {
    green: '#10B981',
    red: '#EF4444',
    white: '#FFFFFF',
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('loading'), 1500),
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const progressX = useMotionValue(-100);
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) animationRef.current.stop();

    if (phase === 'loading') {
      // Sweep right → reset → sweep right, indefinitely
      const loop = () => {
        progressX.set(-100);
        animationRef.current = animate(progressX, 100, {
          duration: 1.4,
          ease: 'linear',
          onComplete: () => {
            if (phase === 'loading') loop();
          },
        });
      };
      loop();
    } else if (phase === 'build') {
      // Initial single sweep before loading starts
      progressX.set(-100);
      animationRef.current = animate(progressX, 100, { duration: 1.5, ease: 'linear' });
    }

    return () => { if (animationRef.current) animationRef.current.stop(); };
  }, [phase]);

  const progressTranslateX = useTransform(progressX, (v) => `${v}%`);

  // Returns a closed SVG path string for a regular hexagon.
  // Using <path> instead of <polygon> so Framer Motion's pathLength
  // animation works correctly — polygon doesn't close cleanly with
  // stroke-dasharray, leaving the top-right corner visually broken.
  const hexagonPath = (radius = 50, cx = 50, cy = 50) => {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      vertices.push([
        cx + radius * Math.cos(angle),
        cy + radius * Math.sin(angle),
      ]);
    }
    const [start, ...rest] = vertices;
    return `M ${start[0]} ${start[1]} ` +
      rest.map(([x, y]) => `L ${x} ${y}`).join(' ') +
      ' Z';
  };

  // Orbital angles and their pixel offsets from center
  const orbitalItems = [
    { angle: 0, radius: 140, colorClass: 'bg-red-500' },
    { angle: 120, radius: 140, colorClass: 'bg-green-500' },
    { angle: 240, radius: 140, colorClass: 'bg-red-500' },
  ];

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Blueprint grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(to right, ${COLORS.green} 1px, transparent 1px), linear-gradient(to bottom, ${COLORS.green} 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Background rotating rings */}
          <motion.div
            className="absolute w-[500px] h-[500px] opacity-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="none" stroke={COLORS.green} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="45" fill="none" stroke={COLORS.red} strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>
          </motion.div>

          <div className="relative flex items-center justify-center">
            {/* Hexagon frame build */}
            <svg width="300" height="300" viewBox="0 0 100 100" className="relative z-20">
              {/* motion.path instead of motion.polygon — pathLength works
                  correctly on <path> with an explicit Z close command,
                  ensuring the top-right corner joins perfectly. */}
              <motion.path
                d={hexagonPath(46, 50, 50)}
                fill="none"
                stroke={COLORS.green}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
              <motion.path
                d={hexagonPath(42, 50, 50)}
                fill="none"
                stroke={COLORS.red}
                strokeWidth="1"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.3"
                initial={{ pathLength: 0, scale: 0.8 }}
                animate={{ pathLength: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.2 }}
              />
            </svg>

            {/* Logo and content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                  <span className="text-red-500">{'<'}</span>
                  AN
                  <span className="text-red-500">{'/>'}</span>
                </span>
              </motion.div>

              <motion.div
                className="mt-4 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-[10px] md:text-xs text-red-500 font-bold tracking-[0.4em] uppercase mb-4">
                  Initializing Core Identity
                </p>

                {/* FIX #10: Progress bar driven by an imperative motion
                    value that genuinely loops during 'loading' phase. */}
                <div className="w-40 h-[2px] bg-gray-900 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 via-white to-green-500"
                    style={{ x: progressTranslateX }}
                  />
                </div>
              </motion.div>
            </div>

            {/* FIX #11: Orbiting elements now use a plain `div` for
                absolute positioning and a nested `motion.div` for the
                Framer-controlled fade/scale animation. This prevents
                Framer from overriding the hand-crafted `transform` used
                for the radial placement. */}
            {orbitalItems.map(({ angle, radius, colorClass }, i) => {
              const rad = (angle * Math.PI) / 180;
              const tx = Math.cos(rad) * radius;
              const ty = Math.sin(rad) * radius;

              return (
                <div
                  key={angle}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    // Plain CSS transform for layout positioning — no Framer conflict
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.2 }}
                  >
                    <div className={`w-3 h-3 ${colorClass} rotate-45 border-2 border-white`} />
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Corner build data */}
          <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between font-mono text-[10px] text-pale-green opacity-40">
            <div className="flex justify-between">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                [ SYSTEM_STABLE ]<br />
                [ ENV_PROD ]
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                0x42_75_69_6c_64<br />
                HEX_ANIMATION_LOAD
              </motion.div>
            </div>
            <div className="flex justify-between items-end">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                v2.0.42_STABLE<br />
                ASSEMBLING_IDENTITY...
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                [ OK ] NODES_INIT<br />
                [ OK ] RENDER_READY
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;