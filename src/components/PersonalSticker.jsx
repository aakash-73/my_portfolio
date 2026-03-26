import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion';
import profilePic from '../assets/profilePic.png';

let _uid = 0;
const useStableId = () => {
  const id = useRef(null);
  if (id.current === null) id.current = `sticker-${++_uid}`;
  return id.current;
};

/**
 * Each layer zooms in from scale 4 → 1 with blur clearing,
 * staggered so you see the sticker assembling piece by piece —
 * mirroring how the splash deconstructed by zooming each piece outward.
 *
 * Layer order (mirrors splash deconstruct in reverse):
 *   0 — outer rings
 *   1 — triangle ring
 *   2 — corner squares
 *   3 — big red triangle
 *   4 — hex card
 *   5 — AN badge
 *   6–9 — orbital shapes
 *   10+ — floating squares
 */
const SPRING_EASE = [0.22, 1.2, 0.36, 1];
const STAGGER = 0.18;
const ZOOM_FROM = 4;
const ZOOM_BLUR = '14px';

const zoomLayer = (i, skipIntro) => {
  if (skipIntro) return { initial: false, animate: {}, transition: {} };
  const delay = i * STAGGER;
  return {
    initial: { scale: ZOOM_FROM, opacity: 0, filter: `blur(${ZOOM_BLUR})` },
    animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.75, ease: SPRING_EASE, delay },
  };
};

const PersonalSticker = ({ size = 650, skipIntro = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const stickerId = useStableId();
  const hexClipId = `${stickerId}-hexClip`;
  const containerRef = useRef(null);

  // ── Mouse tracking ─────────────────────────────────────────────────────
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const xSpring = useSpring(0, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(ySpring, [-1, 1], [20, -20]);
  const rotateY = useTransform(xSpring, [-1, 1], [-20, 20]);

  const layer1X = useTransform(rawMouseX, (v) => v * 15);
  const layer1Y = useTransform(rawMouseY, (v) => v * 15);
  const layer2X = useTransform(rawMouseX, (v) => v * 20);
  const layer2Y = useTransform(rawMouseY, (v) => v * 20);
  const layer3X = useTransform(rawMouseX, (v) => v * 25);
  const layer3Y = useTransform(rawMouseY, (v) => v * 25);
  const layer4X = useTransform(rawMouseX, (v) => v * 35);
  const layer4Y = useTransform(rawMouseY, (v) => v * 35 - 20);
  const layer5X = useTransform(rawMouseX, (v) => v * 30);
  const layer5Y = useTransform(rawMouseY, (v) => v * 30);
  const initialsX = useTransform(rawMouseX, (v) => v * 45);
  const orbitBaseX = useTransform(rawMouseX, (v) => v * 50);
  const orbitBaseY = useTransform(rawMouseY, (v) => v * 50);

  // Floating parallax — no hooks in loops
  const f0 = useTransform(rawMouseX, (v) => v * 10);
  const f1 = useTransform(rawMouseX, (v) => v * 12);
  const f2 = useTransform(rawMouseX, (v) => v * 14);
  const f3 = useTransform(rawMouseX, (v) => v * 16);
  const f4 = useTransform(rawMouseX, (v) => v * 18);
  const f5 = useTransform(rawMouseX, (v) => v * 20);
  const f6 = useTransform(rawMouseX, (v) => v * 22);
  const f7 = useTransform(rawMouseX, (v) => v * 24);
  const floatXValues = [f0, f1, f2, f3, f4, f5, f6, f7];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rawMouseX.set(x); rawMouseY.set(y);
    xSpring.set(x); ySpring.set(y);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0); rawMouseY.set(0);
    xSpring.set(0); ySpring.set(0);
  };

  // ── Auto-flip ─────────────────────────────────────────────────────────
  const isVisibleRef = useRef(true);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (isVisibleRef.current) setIsFlipped((p) => !p);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Geometry ─────────────────────────────────────────────────────────────
  const hexagonPoints = (r = 50, cx = 50, cy = 50) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(' ');
  };

  const orbitingItems = [
    { shape: 'triangle', angle: 0, triColor: '#10B981', invert: false, color: 'bg-green-500' },
    { shape: 'square', angle: 90, triColor: '#EF4444', color: 'bg-red-500' },
    { shape: 'triangle', angle: 180, triColor: '#10B981', invert: true, color: 'bg-green-500' },
    { shape: 'square', angle: 270, triColor: '#EF4444', color: 'bg-red-500' },
  ];

  const ORBIT_RADIUS = size / 2.2;

  // ── Pre-compute layer anim objects ────────────────────────────────────
  const L = Array.from({ length: 18 }, (_, i) => zoomLayer(i, skipIntro));

  return (
    <motion.div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, perspective: 1200, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >

        {/* ── Layer 0: outer rotating rings ─────────────────────────────── */}
        <motion.div
          className="absolute w-full h-full"
          style={{ transform: 'translateZ(-50px)', x: layer1X, y: layer1Y }}
          initial={L[0].initial}
          animate={{ ...L[0].animate, rotate: 360 }}
          transition={{ ...L[0].transition, rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.4" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          </svg>
        </motion.div>

        {/* ── Layer 1: rotating triangle ring ───────────────────────────── */}
        <motion.div
          className="absolute w-full h-full"
          style={{ transform: 'translateZ(-20px)', x: layer2X, y: layer2Y }}
          initial={L[1].initial}
          animate={{ ...L[1].animate, rotate: -360 }}
          transition={{ ...L[1].transition, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute"
              style={{
                left: '50%', top: '50%',
                transform: `rotate(${angle}deg) translateX(${size * 0.42}px) translateY(-50%)`,
              }}
            >
              <div
                className="w-0 h-0 opacity-30"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '12px solid #10B981',
                  filter: 'drop-shadow(0 0 3px rgba(16,185,129,0.5))',
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* ── Layer 2: corner squares ────────────────────────────────────── */}
        <motion.div
          className="absolute w-4/5 h-4/5"
          style={{ transform: 'translateZ(20px)', x: layer3X, y: layer3Y }}
          initial={L[2].initial}
          animate={{ ...L[2].animate, rotate: [0, 5, -5, 0] }}
          transition={{ ...L[2].transition, rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0     w-6 h-6 bg-red-500   border-2 border-white" />
            <div className="absolute top-0 right-0    w-6 h-6 bg-green-500 border-2 border-white" />
            <div className="absolute bottom-0 left-0  w-6 h-6 bg-green-500 border-2 border-white" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-500   border-2 border-white" />
          </div>
        </motion.div>

        {/* ── Layer 3: big red triangle ──────────────────────────────────── */}
        <motion.div
          className="absolute w-full h-full"
          style={{ transform: 'translateZ(40px)', x: layer4X, y: layer4Y }}
          initial={L[3].initial}
          animate={L[3].animate}
          transition={L[3].transition}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,11 88,72 12,72" fill="rgba(239,68,68,0.3)" stroke="#EF4444" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* ── Layer 4: flipping hex card ─────────────────────────────────── */}
        <motion.div
          className="absolute w-5/6 h-5/6 cursor-pointer overflow-hidden"
          style={{
            perspective: 1000,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(80px)',
            WebkitTransformStyle: 'preserve-3d',
            isolation: 'isolate',
            x: layer5X,
            y: layer5Y,
          }}
          initial={L[4].initial}
          animate={L[4].animate}
          transition={L[4].transition}
          onClick={() => setIsFlipped((v) => !v)}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0.1px)' }}
            >
              <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <clipPath id={hexClipId}>
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
                  href={profilePic}
                  x="-5" y="-5" width="110" height="110"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#${hexClipId})`}
                />
              </svg>
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(0.1px)' }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className="absolute top-1/2 left-1/2 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-2xl flex items-center justify-center overflow-hidden"
                  style={{
                    width: '80%', height: '80%',
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

        {/* ── Layer 5: AN badge ──────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 bg-black border-4 border-[#10B981] px-5 py-3"
          style={{ transform: 'translateZ(120px)', x: initialsX }}
          initial={skipIntro ? false : { ...L[5].initial, y: 40 }}
          animate={{ ...L[5].animate, y: [0, -5, 0] }}
          transition={{
            ...L[5].transition,
            y: {
              duration: 2,
              repeat: Infinity,
              delay: skipIntro ? 0 : (L[5].transition.delay ?? 0) + 0.6,
            },
          }}
        >
          <div className="text-white font-black text-3xl tracking-widest">AN</div>
        </motion.div>

        {/* ── Layers 6–9: orbital shapes ─────────────────────────────────── */}
        {orbitingItems.map((item, i) => {
          const startRad = (item.angle * Math.PI) / 180;
          const orb = L[6 + i];
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{ transform: 'translateZ(60px)' }}
              initial={orb.initial}
              animate={{
                ...orb.animate,
                x: [
                  Math.cos(startRad) * ORBIT_RADIUS,
                  Math.cos(startRad + Math.PI * 2) * ORBIT_RADIUS,
                ],
                y: [
                  Math.sin(startRad) * ORBIT_RADIUS,
                  Math.sin(startRad + Math.PI * 2) * ORBIT_RADIUS,
                ],
              }}
              transition={{
                ...orb.transition,
                x: { duration: 6, repeat: Infinity, ease: 'linear', delay: i * 0.4 },
                y: { duration: 6, repeat: Infinity, ease: 'linear', delay: i * 0.4 },
              }}
            >
              <motion.div style={{ x: orbitBaseX, y: orbitBaseY }}>
                {item.shape === 'square' && (
                  <div className={`w-4 h-4 ${item.color}`} />
                )}
                {item.shape === 'triangle' && (
                  <div
                    className="w-0 h-0"
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      ...(item.invert
                        ? { borderTop: `8px solid ${item.triColor}` }
                        : { borderBottom: `8px solid ${item.triColor}` }),
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* ── Layers 10+: floating squares ───────────────────────────────── */}
        {floatXValues.map((floatX, i) => {
          const fl = L[10 + i];
          return (
            <motion.div
              key={`float-${i}`}
              className={`absolute w-2 h-2 ${i % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + (i % 4) * 20}%`,
                transform: 'translateZ(10px)',
                x: floatX,
              }}
              initial={fl.initial}
              animate={{ ...fl.animate, scale: [1, 1.5, 1], y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{
                ...fl.transition,
                scale: { duration: 3, repeat: Infinity, delay: skipIntro ? i * 0.1 : (fl.transition.delay ?? 0) + 0.3 },
                y: { duration: 3, repeat: Infinity, delay: skipIntro ? i * 0.1 : (fl.transition.delay ?? 0) + 0.3 },
                opacity: { duration: 3, repeat: Infinity, delay: skipIntro ? i * 0.1 : (fl.transition.delay ?? 0) + 0.3 },
              }}
            />
          );
        })}

      </motion.div>
    </motion.div>
  );
};

export default PersonalSticker;