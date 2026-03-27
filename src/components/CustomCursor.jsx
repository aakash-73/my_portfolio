import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { FaUser, FaBriefcase, FaBolt, FaGraduationCap, FaEnvelope } from 'react-icons/fa';

/**
 * CustomCursor — fully aligned with PersonalSticker design language
 *
 * Visual elements mirrored from the sticker:
 *   • Two concentric circles (solid green outer + dashed red inner) → Layer 0
 *   • Small green triangles around the ring                         → Layer 1
 *   • Tiny red/green corner squares                                 → Layer 2
 *   • Red triangle at center                                        → Layer 3
 *   • Orbiting red square + green triangle                          → Layers 6–9
 *
 * Variants:
 *   default     — base sticker look, slow spin, red triangle center
 *   interactive — outer ring turns red, orbits speed up
 *   project     — fast spin, shows </> badge (mirrors AN badge), wide orbit
 *   contact     — shows ✉ in green, calm spin
 */

const GREEN = '#10B981';
const RED = '#EF4444';

// ── Orbiting dot (rAF-driven, zero Framer overhead) ──────────────────────────
const OrbitalDot = ({ orbitR, speed, shape, color, angleOffset = 0, visible }) => {
  const domRef = useRef(null);
  const angleRef = useRef(angleOffset);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!visible) { cancelAnimationFrame(rafRef.current); return; }
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      angleRef.current += dt * speed;
      const x = Math.cos(angleRef.current) * orbitR;
      const y = Math.sin(angleRef.current) * orbitR;
      if (domRef.current)
        domRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, orbitR, speed]);

  if (!visible) return null;

  return (
    <div
      ref={domRef}
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{ willChange: 'transform' }}
    >
      {shape === 'square' ? (
        <div style={{ width: 5, height: 5, backgroundColor: color }} />
      ) : (
        <div style={{
          width: 0, height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: `6px solid ${color}`,
        }} />
      )}
    </div>
  );
};

// ── Six small triangles around the ring (mirrors Layer 1) ────────────────────
const TriangleRing = ({ size, color, opacity = 0.5 }) => {
  const r = size / 2;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ width: size, height: size }}>
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = r + Math.cos(rad) * (r * 0.82) - 4;
        const y = r + Math.sin(rad) * (r * 0.82) - 3;
        return (
          <div
            key={angle}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: `6px solid ${color}`,
              opacity,
              transform: `rotate(${angle + 90}deg)`,
              filter: `drop-shadow(0 0 2px ${color}88)`,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Corner squares (mirrors Layer 2) ─────────────────────────────────────────
const CornerSquares = ({ size, active }) => {
  const s = 4;
  const inset = size * 0.12;
  const positions = [
    { top: inset, left: inset, color: active ? RED : RED },
    { top: inset, left: size - inset - s, color: active ? RED : GREEN },
    { top: size - inset - s, left: inset, color: active ? RED : GREEN },
    { top: size - inset - s, left: size - inset - s, color: active ? RED : RED },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ width: size, height: size }}>
      {positions.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: s,
            height: s,
            backgroundColor: p.color,
            border: '1px solid white',
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

// ── Main cursor ───────────────────────────────────────────────────────────────
const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useSpring(0, { stiffness: 600, damping: 32 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 32 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const move = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); setVisible(true); };
    const over = (e) => {
      const t = e.target;
      if (t.closest('[data-cursor="project"]')) setVariant('project');
      else if (t.closest('[data-cursor="experience-card"]')) setVariant('experience-card');
      else if (t.closest('[data-cursor="skills-card"]')) setVariant('skills-card');
      else if (t.closest('[data-cursor="education-card"]')) setVariant('education-card');
      else if (t.closest('a, button, [role="button"]')) setVariant('interactive');
      else if (t.closest('#contact')) setVariant('contact');
      else if (t.closest('#about')) setVariant('about');
      else if (t.closest('#experience')) setVariant('experience');
      else if (t.closest('#skills')) setVariant('skills');
      else if (t.closest('#education')) setVariant('education');
      else setVariant('default');
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', () => setVisible(false));
    document.addEventListener('mouseenter', () => setVisible(true));
    document.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', () => setVisible(false));
      document.removeEventListener('mouseenter', () => setVisible(true));
      document.removeEventListener('mouseover', over);
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice) return null;

  // ── Variant config ────────────────────────────────────────────────────────
  const cfg = {
    default: {
      size: 44,
      outerStroke: GREEN,
      innerStroke: RED,
      spinDur: '4s',
      orbitR: 18,
      orbitSpeed: 1.8,
      showTriRing: true,
      showCorners: false,
      showOrbit: true,
      centerContent: 'triangle',   // red triangle like Layer 3
      badgeText: null,
    },
    interactive: {
      size: 48,
      outerStroke: RED,
      innerStroke: RED,
      spinDur: '1.2s',
      orbitR: 22,
      orbitSpeed: 4,
      showTriRing: true,
      showCorners: true,
      showOrbit: true,
      centerContent: 'triangle',
      badgeText: null,
    },
    project: {
      size: 52,
      outerStroke: GREEN,
      innerStroke: RED,
      spinDur: '0.6s',
      orbitR: 26,
      orbitSpeed: 5.5,
      showTriRing: true,
      showCorners: true,
      showOrbit: true,
      centerContent: 'badge',
      badgeText: '</>',
    },
    about: {
      size: 46,
      outerStroke: GREEN,
      innerStroke: GREEN,
      spinDur: '5s',
      orbitR: 20,
      orbitSpeed: 2,
      showTriRing: true,
      showCorners: false,
      showOrbit: true,
      centerContent: 'badge',
      badgeIcon: <FaUser size={8} />,
    },
    experience: {
      size: 46,
      outerStroke: RED,
      innerStroke: RED,
      spinDur: '4s',
      orbitR: 20,
      orbitSpeed: 3,
      showTriRing: true,
      showCorners: false,
      showOrbit: true,
      centerContent: 'badge',
      badgeIcon: <FaBriefcase size={8} />,
    },
    skills: {
      size: 46,
      outerStroke: GREEN,
      innerStroke: RED,
      spinDur: '3s',
      orbitR: 20,
      orbitSpeed: 4,
      showTriRing: true,
      showCorners: false,
      showOrbit: true,
      centerContent: 'badge',
      badgeIcon: <FaBolt size={8} />,
    },
    education: {
      size: 46,
      outerStroke: GREEN,
      innerStroke: GREEN,
      spinDur: '4s',
      orbitR: 20,
      orbitSpeed: 2.5,
      showTriRing: true,
      showCorners: false,
      showOrbit: true,
      centerContent: 'badge',
      badgeIcon: <FaGraduationCap size={8} />,
    },
    contact: {
      size: 46,
      outerStroke: GREEN,
      innerStroke: GREEN,
      spinDur: '5s',
      orbitR: 20,
      orbitSpeed: 1.2,
      showTriRing: true,
      showCorners: false,
      showOrbit: true,
      centerContent: 'badge',
      badgeIcon: <FaEnvelope size={8} />,
    },
  };

  ['experience', 'skills', 'education'].forEach(sec => {
    cfg[`${sec}-card`] = {
      ...cfg[sec],
      size: 52,
      spinDur: '0.6s',
      orbitR: 26,
      orbitSpeed: 5.5,
      showCorners: true,
    };
  });

  const c = cfg[variant];

  return (
    <>
      <style>{`
        @keyframes cursor-ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .cursor-ring {
          animation: cursor-ring-spin var(--spin-dur, 4s) linear infinite;
        }
        /* Hide native cursor site-wide */
        * { cursor: none !important; }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.15 } }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ width: c.size, height: c.size }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          style={{ position: 'relative' }}
        >

          {/* ── Outer rotating rings (mirrors Layer 0) ── */}
          <svg
            className="cursor-ring absolute inset-0"
            style={{ '--spin-dur': c.spinDur }}
            width={c.size}
            height={c.size}
            viewBox="0 0 44 44"
            fill="none"
          >
            {/* Solid green outer circle */}
            <motion.circle
              cx="22" cy="22" r="20"
              stroke={c.outerStroke}
              strokeWidth="1.5"
              fill="none"
              animate={{ stroke: c.outerStroke }}
              transition={{ duration: 0.25 }}
            />
            {/* Dashed red/green inner circle */}
            <motion.circle
              cx="22" cy="22" r="16"
              stroke={c.innerStroke}
              strokeWidth="1"
              strokeDasharray="3 3"
              fill="none"
              animate={{ stroke: c.innerStroke }}
              transition={{ duration: 0.25 }}
            />
          </svg>

          {/* ── Six-triangle ring (mirrors Layer 1) ── */}
          {c.showTriRing && (
            <div
              className="absolute inset-0"
              style={{
                width: c.size,
                height: c.size,
                animation: `cursor-ring-spin ${c.spinDur} linear infinite reverse`,
              }}
            >
              <TriangleRing size={c.size} color={GREEN} opacity={0.5} />
            </div>
          )}

          {/* ── Corner squares (mirrors Layer 2) ── */}
          {c.showCorners && (
            <CornerSquares size={c.size} active={variant === 'interactive'} />
          )}

          {/* ── Center content ── */}
          <div
            className="absolute flex items-center justify-center"
            style={{ width: c.size, height: c.size, zIndex: 10 }}
          >
            {c.centerContent === 'triangle' && (
              /* Red triangle — mirrors Layer 3 */
              <motion.svg
                viewBox="0 0 20 20"
                width={c.size * 0.35}
                height={c.size * 0.35}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <polygon
                  points="10,3 17,15 3,15"
                  fill="rgba(239,68,68,0.3)"
                  stroke={RED}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  transform="rotate(45, 10, 10)"
                />
              </motion.svg>
            )}

            {(c.centerContent === 'badge' && (c.badgeText || c.badgeIcon)) && (
              /* AN-badge style — black box, green border, white text */
              <motion.div
                key={variant + '-badge'}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: '#000',
                  border: `1.5px solid ${GREEN}`,
                  padding: c.badgeIcon ? '3px' : '1px 4px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: '7px',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {c.badgeIcon || c.badgeText}
              </motion.div>
            )}
          </div>

          {/* ── Orbiting red square (mirrors sticker orbital squares) ── */}
          <OrbitalDot
            orbitR={c.orbitR}
            speed={c.orbitSpeed}
            shape="square"
            color={RED}
            angleOffset={0}
            visible={c.showOrbit}
          />

          {/* ── Orbiting green triangle (mirrors sticker orbital triangles) ── */}
          <OrbitalDot
            orbitR={c.orbitR}
            speed={-c.orbitSpeed * 0.75}
            shape="triangle"
            color={GREEN}
            angleOffset={Math.PI}
            visible={c.showOrbit}
          />

          {/* ── Extra fast orbitals on project var and card variants ── */}
          {(variant === 'project' || variant.endsWith('-card')) && (
            <>
              <OrbitalDot orbitR={c.orbitR * 0.6} speed={c.orbitSpeed * 1.4} shape="square" color={RED} angleOffset={Math.PI / 2} visible />
              <OrbitalDot orbitR={c.orbitR * 0.6} speed={-c.orbitSpeed * 1.4} shape="triangle" color={GREEN} angleOffset={Math.PI * 1.5} visible />
            </>
          )}

        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;