import React, { useMemo, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* --------------------------------------------------
   Seeded random generator (stable layout)
-------------------------------------------------- */
const useSeededShapes = (count, seed = 1) =>
  useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: rand() * 120 + 80,
      x: rand() * 100,
      y: rand() * 100,
      depth: rand() * 0.8 + 0.2,
      rotate: rand() * 360,
    }));
  }, [count, seed]);

/* --------------------------------------------------
   Depth-based opacity (subtle)
-------------------------------------------------- */
const getOpacityByDepth = (depth) => 0.04 + depth * 0.10;

/* --------------------------------------------------
   Cinematic entrance variants
-------------------------------------------------- */
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    y: 160,
    filter: "blur(10px)",
  },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */
const GeometricBackground = ({ variant = "dark" }) => {
  const isDark = variant === "dark";
  const { scrollYProgress } = useScroll();

  /* Mouse parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 22 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 90);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 90);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  /* Shape groups */
  const circles = useSeededShapes(8, 11);
  const squares = useSeededShapes(6, 22);
  const triangles = useSeededShapes(5, 33);

  const strokeColor = isDark
    ? "rgba(16,185,129,0.30)"
  : "rgba(239,68,68,0.30)";

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* ---------------- CIRCLES ---------------- */}
      {circles.map((s, i) => {
        const scrollY = useTransform(
          scrollYProgress,
          [0, 1],
          [0, -200 * s.depth]
        );

        return (
          <motion.div
            key={`circle-${i}`}
            custom={i}
            variants={item}
            className="absolute rounded-full border"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.x}%`,
              top: `${s.y}%`,
              borderColor: strokeColor,
              opacity: getOpacityByDepth(s.depth),
              x: useTransform(smoothX, (v) => v * s.depth),
              y: useTransform(
                [smoothY, scrollY],
                ([my, sy]) => my * s.depth + sy
              ),
            }}
          />
        );
      })}

      {/* ---------------- SQUARES ---------------- */}
      {squares.map((s, i) => {
        const scrollY = useTransform(
          scrollYProgress,
          [0, 1],
          [0, -170 * s.depth]
        );

        return (
          <motion.div
            key={`square-${i}`}
            custom={i + 10}
            variants={item}
            className="absolute border"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.x}%`,
              top: `${s.y}%`,
              rotate: s.rotate,
              borderColor: strokeColor,
              opacity: getOpacityByDepth(s.depth),
              x: useTransform(smoothX, (v) => v * s.depth),
              y: useTransform(
                [smoothY, scrollY],
                ([my, sy]) => my * s.depth + sy
              ),
            }}
          />
        );
      })}

      {/* ---------------- TRIANGLES (OUTLINE ONLY) ---------------- */}
      {triangles.map((s, i) => {
        const scrollY = useTransform(
          scrollYProgress,
          [0, 1],
          [0, -240 * s.depth]
        );

        return (
          <motion.svg
            key={`triangle-${i}`}
            custom={i + 20}
            variants={item}
            viewBox="0 0 100 100"
            className="absolute"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: getOpacityByDepth(s.depth),
              x: useTransform(smoothX, (v) => v * s.depth),
              y: useTransform(
                [smoothY, scrollY],
                ([my, sy]) => my * s.depth + sy
              ),
            }}
          >
            <polygon
              points="50,5 5,95 95,95"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
            />
          </motion.svg>
        );
      })}
    </motion.div>
  );
};

export default GeometricBackground;
