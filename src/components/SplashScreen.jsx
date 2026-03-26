import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';

/**
 * SplashScreen — geometric deconstruction variant
 *
 * Phases:
 *   'build'          (0 → 1500ms)   hex draws, progress sweeps once
 *   'loading'        (1500 → 3500ms) progress loops
 *   'deconstructing' (3500 → 5200ms) every geometric piece breaks apart:
 *                                    – outer rings expand & fade
 *                                    – orbital shapes scatter along their angle
 *                                    – hex border strokes dash-offset outward
 *                                    – inner red hex collapses inward
 *                                    – AN logotype & bar fly away
 *                                    – HUD corners slide to edges
 *
 *
 * onDeconstruct(splashHexRect) fires at t=3500ms so PersonalSticker
 * can begin its reconstruction while SplashScreen is zooming out.
 *
 * onComplete() fires at t=5200ms, and then the wrapper is unmounted.
 */

const GREEN = '#10B981';
const RED = '#EF4444';

// 650px sticker → ORBIT_R = 650/2.2 ≈ 295  (must match PersonalSticker)
const ORBIT_R = 295;

const SplashScreen = ({ onComplete, onDeconstruct }) => {
  const [phase, setPhase] = useState('build');
  const phaseRef = useRef('build');
  const hexSvgRef = useRef(null);
  const progressAnimRef = useRef(null);

  const setPhaseSync = useCallback((p) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // ── Timing ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setPhaseSync('loading'), 1500);
    const t2 = setTimeout(() => {
      setPhaseSync('deconstructing');
      if (onDeconstruct) {
        const rect = hexSvgRef.current?.getBoundingClientRect() ?? null;
        onDeconstruct(rect);
      }
    }, 3500);
    const t3 = setTimeout(() => {
      onComplete();
    }, 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete, onDeconstruct, setPhaseSync]);

  // ── Progress bar ─────────────────────────────────────────────────────────
  const progressX = useMotionValue(-100);

  useEffect(() => {
    progressAnimRef.current?.stop();

    if (phase === 'build') {
      progressX.set(-100);
      progressAnimRef.current = animate(progressX, 100, { duration: 1.5, ease: 'linear' });
    }

    if (phase === 'loading') {
      const loop = () => {
        if (phaseRef.current !== 'loading') return;
        progressX.set(-100);
        progressAnimRef.current = animate(progressX, 100, {
          duration: 1.4,
          ease: 'linear',
          onComplete: loop,
        });
      };
      loop();
    }

    return () => progressAnimRef.current?.stop();
  }, [phase, progressX]);

  const progressTranslateX = useTransform(progressX, (v) => `${v}%`);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hexPath = (r = 50, cx = 50, cy = 50) => {
    const v = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      v.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    const [s, ...rest] = v;
    return `M ${s[0]} ${s[1]} ` + rest.map(([x, y]) => `L ${x} ${y}`).join(' ') + ' Z';
  };

  const isD = phase === 'deconstructing';

  // ── Orbital items (4 shapes at 0/90/180/270°) ────────────────────────────
  const orbitals = [
    { angle: 0, isSquare: false, color: GREEN },
    { angle: 90, isSquare: true, color: RED },
    { angle: 180, isSquare: false, color: GREEN },
    { angle: 270, isSquare: true, color: RED },
  ];

  return (
    // Wrapper now has NO background — so PersonalSticker can be seen zooming in underneath
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden pointer-events-none">

      {/* ── Blueprint grid ── */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${GREEN} 1px, transparent 1px),
            linear-gradient(to bottom, ${GREEN} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Outer rotating rings ─────────────────────────────────────────── */}
      {/* During deconstruct: expand outwards to camera to create fly-through + fade */}
      <motion.div
        className="absolute w-[650px] h-[650px]"
        animate={
          isD
            ? { rotate: 0, scale: 5, opacity: 0 }
            : { rotate: 360, scale: 1, opacity: 0.4 }
        }
        transition={
          isD
            ? { duration: 1.5, ease: [0.2, 0, 0.8, 1] }
            : {
              rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0 },
              opacity: { duration: 0 },
            }
        }
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke={GREEN} strokeWidth="2" opacity="0.4" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={RED} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Second ring layer — offset timing for staggered burst */}
      <motion.div
        className="absolute w-[650px] h-[650px] opacity-0"
        animate={isD ? { scale: 6, opacity: [0, 0.25, 0] } : {}}
        transition={isD ? { duration: 1.3, ease: 'easeOut', delay: 0.15 } : {}}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke={GREEN} strokeWidth="1" />
        </svg>
      </motion.div>

      {/* ── Centre content (hex + text + orbitals) ── */}
      <div className="relative flex items-center justify-center">

        {/* ── Hex SVG ──────────────────────────────────────────────────── */}
        <svg
          ref={hexSvgRef}
          width="542"
          height="542"
          viewBox="0 0 100 100"
          className="relative z-20"
          style={{ overflow: 'visible' }}
        >
          {/* Outer green hex — shatters: zoom past camera */}
          <motion.path
            d={hexPath(46, 50, 50)}
            fill="none"
            stroke={GREEN}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isD
                ? { pathLength: 0, opacity: 0, scale: 4 }
                : { pathLength: 1, opacity: 1, scale: 1 }
            }
            transition={
              isD
                ? { duration: 1.0, ease: 'easeIn' }
                : { duration: 1.5, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Inner red hex — implodes: zoom past camera */}
          <motion.path
            d={hexPath(42, 50, 50)}
            fill="none"
            stroke={RED}
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
            animate={
              isD
                ? { pathLength: 0, opacity: 0, scale: 4 }
                : { pathLength: 1, opacity: 0.3, scale: 1 }
            }
            transition={
              isD
                ? { duration: 0.7, ease: 'easeIn' }
                : { delay: 0.5, duration: 1.2 }
            }
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Fragment shards — only visible during deconstruct */}
          {isD && [0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const px = 50 + 46 * Math.cos(rad);
            const py = 50 + 46 * Math.sin(rad);
            const ex = 50 + 80 * Math.cos(rad);
            const ey = 50 + 80 * Math.sin(rad);
            return (
              <motion.line
                key={`shard-${angle}`}
                x1={px} y1={py} x2={px} y2={py}
                stroke={i % 2 === 0 ? GREEN : RED}
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ x2: px, y2: py, opacity: 0.8 }}
                animate={{ x2: ex, y2: ey, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.04 }}
              />
            );
          })}
        </svg>

        {/* ── Chrome: AN logotype + progress bar ────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">

          {/* AN logotype — zooms past camera */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={
              isD
                ? { opacity: 0, scale: 5, filter: 'blur(10px)' }
                : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            }
            transition={
              isD
                ? { duration: 0.8, ease: 'easeIn' }
                : { delay: 0.8, duration: 0.6 }
            }
          >
            <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
              <span className="text-red-500">{'<'}</span>
              AN
              <span className="text-red-500">{'/>'}</span>
            </span>
          </motion.div>

          {/* Progress bar — zooms past camera */}
          <motion.div
            className="mt-4 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={
              isD
                ? { opacity: 0, scale: 5 }
                : { opacity: 1, y: 0 }
            }
            transition={
              isD
                ? { duration: 0.7, ease: 'easeIn' }
                : { delay: 1.2 }
            }
          >
            <p className="text-[10px] md:text-xs text-red-500 font-bold tracking-[0.4em] uppercase mb-4">
              Initializing Core Identity
            </p>
            <div className="w-40 h-[2px] bg-gray-900 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-white to-green-500"
                style={{ x: progressTranslateX }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Orbital shapes ────────────────────────────────────────────── */}
        {orbitals.map(({ angle, isSquare, color }, i) => {
          const rad = (angle * Math.PI) / 180;
          const tx = Math.cos(rad) * ORBIT_R;
          const ty = Math.sin(rad) * ORBIT_R;

          // Scatter: fly out 2× further along the same angle
          const scatterX = Math.cos(rad) * ORBIT_R * 1.8;
          const scatterY = Math.sin(rad) * ORBIT_R * 1.8;

          return (
            <div
              key={angle}
              className="absolute"
              style={{
                left: '50%', top: '50%',
                transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
                zIndex: 25,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={
                  isD
                    ? {
                      opacity: 0,
                      scale: 1.5,
                      x: scatterX * 0.8,
                      y: scatterY * 0.8,
                      rotate: angle * 2 + 180,
                    }
                    : { opacity: 0.4, scale: 1, x: 0, y: 0, rotate: 0 }
                }
                transition={
                  isD
                    ? { duration: 1.4, ease: [0.4, 0, 1, 1], delay: i * 0.06 }
                    : { delay: 1.4 + i * 0.1, duration: 0.4 }
                }
              >
                {isSquare ? (
                  <div className="w-4 h-4" style={{ backgroundColor: color }} />
                ) : (
                  <div
                    className="w-0 h-0"
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: `8px solid ${color}`,
                    }}
                  />
                )}
              </motion.div>
            </div>
          );
        })}

        {/* Mini floating squares — scatter randomly during deconstruct */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const dist = 120 + i * 20;
          return (
            <motion.div
              key={`float-${i}`}
              className={`absolute w-2 h-2 ${i % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + (i % 4) * 20}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isD
                  ? {
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: 0,
                    opacity: 0,
                    rotate: 360,
                  }
                  : {
                    scale: [1, 1.5, 1],
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }
              }
              transition={
                isD
                  ? { duration: 1.2, ease: 'easeIn', delay: 0.1 + i * 0.05 }
                  : {
                    scale: { duration: 3, repeat: Infinity, delay: 1.8 + i * 0.1 },
                    y: { duration: 3, repeat: Infinity, delay: 1.8 + i * 0.1 },
                    opacity: { duration: 3, repeat: Infinity, delay: 1.8 + i * 0.1 },
                  }
              }
            />
          );
        })}
      </div>

      {/* ── Corner HUD data — each corner slides to its corner ── */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between font-mono text-[10px] text-green-500">
        <div className="flex justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isD
                ? { opacity: 0, x: -50, y: -50 }
                : { opacity: 0.4, x: 0, y: 0 }
            }
            transition={isD ? { duration: 0.9, ease: 'easeIn' } : { delay: 0.2 }}
          >
            [ SYSTEM_STABLE ]<br />[ ENV_PROD ]
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isD
                ? { opacity: 0, x: 50, y: -50 }
                : { opacity: 0.4, x: 0, y: 0 }
            }
            transition={isD ? { duration: 0.9, ease: 'easeIn', delay: 0.05 } : { delay: 0.4 }}
          >
            0x42_75_69_6c_64<br />HEX_ANIMATION_LOAD
          </motion.div>
        </div>
        <div className="flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isD
                ? { opacity: 0, x: -50, y: 50 }
                : { opacity: 0.4, x: 0, y: 0 }
            }
            transition={isD ? { duration: 0.9, ease: 'easeIn', delay: 0.08 } : { delay: 0.6 }}
          >
            v2.0.42_STABLE<br />ASSEMBLING_IDENTITY...
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isD
                ? { opacity: 0, x: 50, y: 50 }
                : { opacity: 0.4, x: 0, y: 0 }
            }
            transition={isD ? { duration: 0.9, ease: 'easeIn', delay: 0.12 } : { delay: 0.8 }}
          >
            [ OK ] NODES_INIT<br />[ OK ] RENDER_READY
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;