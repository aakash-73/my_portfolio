import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { projects } from "../data";
import GeometricBackground from "./GeometricBackground";
import TiltCard from "./TiltCard";

// Stable random values seeded once at module level — not per render
const CIRCLE_PARTICLES = Array.from({ length: 8 }, () => ({
  width: Math.random() * 20 + 10,
  height: Math.random() * 20 + 10,
  left: Math.random() * 100,
  top: Math.random() * 100,
  xDrift: Math.random() * 40 - 20,
  duration: Math.random() * 5 + 8,
}));

const TRIANGLE_PARTICLES = Array.from({ length: 4 }, (_, i) => ({
  left: (i * 25) % 100,
  top: Math.random() * 80,
  duration: 20 + i * 3,
}));

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    []
  );

  const filteredProjects = useMemo(() => {
    const list =
      activeCategory === "All"
        ? projects
        : projects.filter((p) => p.category === activeCategory);

    if (expandedId && !list.some((p) => p.id === expandedId)) {
      setExpandedId(null);
    }

    return list;
  }, [activeCategory, expandedId]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="projects" className="py-20 bg-white relative overflow-hidden">
      <GeometricBackground variant="dark" />
      <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-500 opacity-10 transform rotate-12" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-pale-green opacity-5" />

      {CIRCLE_PARTICLES.map((p, i) => (
        <motion.div
          key={`proj-circle-${i}`}
          className="absolute rounded-full bg-pale-green"
          style={{
            width: p.width,
            height: p.height,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: 0.1,
          }}
          animate={{ y: [0, -30, 0], x: [0, p.xDrift, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {TRIANGLE_PARTICLES.map((p, i) => (
        <motion.div
          key={`proj-tri-${i}`}
          className="absolute"
          style={{ left: `${p.left}%`, top: `${p.top}%`, opacity: 0.06 }}
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        >
          <svg width="60" height="60" viewBox="0 0 100 100">
            <polygon points="50,10 90,80 10,80" fill="none" stroke="#EF4444" strokeWidth="3" />
          </svg>
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-black">Featured</span>{" "}
            <span className="text-red-500">Projects</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4 mb-8">
            <div className="w-16 h-1 bg-red-500" />
            <div className="w-4 h-4 bg-pale-green transform rotate-45" />
            <div className="w-16 h-1 bg-red-500" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const isInProgress = category === "In Progress";
              const isLive = category === "Live";
              const isActive = activeCategory === category;
              return (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all border-2 flex items-center gap-2 ${
                    isActive
                      ? isInProgress
                        ? "bg-amber-500 text-black border-amber-500"
                        : isLive
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-red-500 text-white border-red-500"
                      : isInProgress
                      ? "bg-white text-amber-500 border-amber-500 hover:bg-amber-50"
                      : isLive
                      ? "bg-white text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                      : "bg-white text-black border-black hover:border-pale-green"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLive && (
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isActive ? "bg-white" : "bg-emerald-500"}`} />
                  )}
                  {isInProgress && (
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isActive ? "bg-black" : "bg-amber-500"}`} />
                  )}
                  {category}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* items-stretch ensures every card in a row matches the tallest */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredProjects.map((project, index) => {
            const isExpanded = expandedId === project.id;
            const isInProgress = project.inProgress === true;
            const isLive = !!project.liveUrl;
            const collapsedTech = project.technologies.slice(0, 3);
            const remainingCount = Math.max(project.technologies.length - 3, 0);

            return (
              <TiltCard
                key={project.id}
                disabled={isExpanded}
                maxTilt={10}
                perspective={1200}
                scaleOnHover={1.04}
                className="h-full"
              >
                <div
                  data-cursor="project"
                  className={`h-full flex flex-col border-4 relative group cursor-pointer overflow-hidden transition-colors ${
                    isInProgress
                      ? isExpanded
                        ? "bg-black border-amber-500"
                        : "bg-black border-amber-500/60 hover:border-amber-500"
                      : isLive
                      ? isExpanded
                        ? "bg-black border-emerald-500"
                        : "bg-black border-emerald-500/60 hover:border-emerald-500"
                      : isExpanded
                      ? "bg-black border-red-500"
                      : "bg-black border-pale-green hover:border-red-500"
                  }`}
                  onClick={(e) => {
                    if (project.liveUrl && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                    } else {
                      toggleExpand(project.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  title={isLive ? "Ctrl+Click to open live project" : undefined}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (project.liveUrl && (e.ctrlKey || e.metaKey)) {
                        window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                      } else {
                        toggleExpand(project.id);
                      }
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  {/* Corner geometric accents */}
                  <div className={`absolute top-0 right-0 w-8 h-8 transform -translate-y-2 translate-x-2 z-10 ${isInProgress ? "bg-amber-500" : isLive ? "bg-emerald-500" : "bg-red-500"}`} />
                  <div className={`absolute bottom-0 left-0 w-6 h-6 z-10 ${isInProgress ? "bg-amber-500/50" : isLive ? "bg-emerald-500/50" : "bg-pale-green"}`} />


                  {/* Ctrl+Click hint — fades in on hover for Live cards only */}
                  {isLive && (
                    <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold uppercase tracking-wider pointer-events-none">
                      Ctrl+Click to visit
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <motion.div
                      className="flex flex-col flex-1"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 transition-colors ${isInProgress ? "bg-amber-500/20 group-hover:bg-amber-500" : isLive ? "bg-emerald-500/20 group-hover:bg-emerald-500" : "bg-pale-green group-hover:bg-red-500"}`}>
                          <FaCode className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider">
                            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                            {project.category}
                          </span>
                          {project.year && (
                            <span className="px-2 py-0.5 text-gray-500 text-xs font-bold">
                              {project.year}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className={`text-xl font-black text-white mb-3 transition-colors ${isInProgress ? "group-hover:text-amber-400" : isLive ? "group-hover:text-emerald-400" : "group-hover:text-pale-green"}`}>
                        {project.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {project.highlights && (
                        <ul className="space-y-2 mb-4">
                          {project.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-500">
                              <span className={`flex-shrink-0 w-2 h-2 mt-1 ${isInProgress ? "bg-amber-500" : isLive ? "bg-emerald-500" : "bg-red-500"}`} />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Tech badges pinned to the bottom of the card */}
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2">
                          {collapsedTech.map((tech, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 border text-xs font-bold ${isInProgress ? "border-amber-500/60 text-amber-400" : isLive ? "border-emerald-500/60 text-emerald-400" : "border-pale-green text-pale-green"}`}
                            >
                              {tech}
                            </span>
                          ))}

                          {!isExpanded && remainingCount > 0 && (
                            <span className="px-2 py-1 text-gray-500 text-xs font-bold">
                              +{remainingCount}
                            </span>
                          )}
                        </div>

                        {/* Extra tech badges revealed on expand */}
                        <AnimatePresence initial={false}>
                          {isExpanded && remainingCount > 0 && (
                            <motion.div
                              key="extra-tech"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.technologies.slice(3).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-1 border text-xs font-bold ${isInProgress ? "border-amber-500/60 text-amber-400" : isLive ? "border-emerald-500/60 text-emerald-400" : "border-pale-green text-pale-green"}`}
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;