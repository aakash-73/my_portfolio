import React from 'react';
import { motion } from 'framer-motion';
import { technicalSkills, softSkills } from '../data';
import GeometricBackground from './GeometricBackground';

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-black relative overflow-hidden">
      {/* Geometric background */}
      <GeometricBackground variant="dark" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 border-4 border-red-500 transform rotate-45"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-pale-green"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-white">Skills &</span>{' '}
            <span className="text-red-500">Expertise</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-1 bg-red-500"></div>
            <div className="w-4 h-4 bg-pale-green transform rotate-45"></div>
            <div className="w-16 h-1 bg-red-500"></div>
          </div>
        </motion.div>

        {/* Technical Skills */}
        <div className="mb-16">
          <h3 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-wider">
            <span className="border-b-4 border-pale-green pb-2">Technical Arsenal</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalSkills.map((category, idx) => (
              <motion.div
                key={idx}
                className="bg-white border-4 border-pale-green p-6 relative hover:border-red-500 transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500"></div>

                <h4 className="text-xl font-black text-black mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-3 h-3 bg-pale-green"></span>
                  {category.category}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIdx) => (
                    <motion.span
                      key={skillIdx}
                      className="px-3 py-2 border-2 border-black text-black text-xs font-black uppercase tracking-wide hover:border-red-500 hover:text-red-500 transition-all"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: skillIdx * 0.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <h3 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-wider">
            <span className="border-b-4 border-red-500 pb-2">Professional Strengths</span>
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {softSkills.map((skill, idx) => (
              <motion.div
                key={idx}
                className="bg-white border-4 border-black p-6 text-center relative group hover:border-pale-green transition-all"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-3 h-3 bg-red-500"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-pale-green"></div>

                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <h4 className="text-black font-black mb-2 uppercase tracking-wide text-sm group-hover:text-red-500 transition-colors">
                  {skill.name}
                </h4>
                <p className="text-gray-600 text-xs">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
