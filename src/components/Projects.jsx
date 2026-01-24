import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { projects } from "../data";
import GeometricBackground from "./GeometricBackground";

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

    // collapse if expanded card disappears due to filter
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
      {/* Enhanced geometric background */}
      <GeometricBackground variant="dark" />
      <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-500 opacity-10 transform rotate-12"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-pale-green opacity-5"></div>

      {/* Orbiting circles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`proj-circle-${i}`}
          className="absolute rounded-full bg-pale-green"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.1,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional triangles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`proj-tri-${i}`}
          className="absolute"
          style={{
            left: `${(i * 25) % 100}%`,
            top: `${Math.random() * 80}%`,
            opacity: 0.06,
          }}
          animate={{ rotate: [0, 180, 360] }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg width="60" height="60" viewBox="0 0 100 100">
            <polygon
              points="50,10 90,80 10,80"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
            />
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
            <div className="w-16 h-1 bg-red-500"></div>
            <div className="w-4 h-4 bg-pale-green transform rotate-45"></div>
            <div className="w-16 h-1 bg-red-500"></div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all border-2 ${
                  activeCategory === category
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-black border-black hover:border-pale-green"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const isExpanded = expandedId === project.id;

            // Collapsed: show first 3 + +N
            const collapsedTech = project.technologies.slice(0, 3);
            const remainingCount = Math.max(project.technologies.length - 3, 0);

            return (
              <motion.div
                key={project.id}
                className={`bg-black border-4 relative group transition-all cursor-pointer ${
                  isExpanded
                    ? "border-red-500"
                    : "border-pale-green hover:border-red-500"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                layout
                onClick={() => toggleExpand(project.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(project.id);
                  }
                }}
                aria-expanded={isExpanded}
              >
                {/* Corner geometric elements */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-red-500 transform -translate-y-2 translate-x-2"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-pale-green"></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-pale-green group-hover:bg-red-500 transition-colors">
                      <FaCode className="text-black" size={24} />
                    </div>
                    <span className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-pale-green transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {project.highlights && (
                    <ul className="space-y-2 mb-4">
                      {project.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-gray-500"
                        >
                          <span className="flex-shrink-0 w-2 h-2 bg-red-500 mt-1"></span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech stack: SAME AREA, just expands */}
                  <div className="flex flex-wrap gap-2">
                    {(isExpanded ? project.technologies : collapsedTech).map(
                      (tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 border border-pale-green text-pale-green text-xs font-bold"
                        >
                          {tech}
                        </span>
                      )
                    )}

                    {!isExpanded && remainingCount > 0 && (
                      <span className="px-2 py-1 text-gray-500 text-xs font-bold">
                        +{remainingCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
