import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import { experience } from '../data';
import GeometricBackground from './GeometricBackground';

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-black relative overflow-hidden">
      {/* Geometric background */}
      <GeometricBackground variant="dark" />
      <div className="absolute inset-0 opacity-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-pale-green"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
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
            <span className="text-white">Work</span>{' '}
            <span className="text-red-500">Experience</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-1 bg-red-500"></div>
            <div className="w-4 h-4 bg-pale-green transform rotate-45"></div>
            <div className="w-16 h-1 bg-red-500"></div>
          </div>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-pale-green"></div>

          <div className="space-y-12">
            {experience.map((job, index) => (
              <motion.div 
                key={job.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-500 border-4 border-black z-10 rotate-45"></div>

                {/* Content card */}
                <div className={`w-full md:w-5/12 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <motion.div 
                    className="bg-white border-4 border-pale-green p-6 relative group hover:border-red-500 transition-all"
                    whileHover={{ scale: 1.03 }}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 bg-red-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-pale-green"></div>

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-black mb-2">
                          {job.role}
                        </h3>
                        <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                          <FaBriefcase size={16} />
                          <span>{job.company}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendar size={14} />
                        <span className="font-semibold">{job.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt size={14} />
                        <span className="font-semibold">{job.location}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-4">
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 bg-pale-green rounded-full mt-2"></span>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {job.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-black text-pale-green text-xs font-bold uppercase tracking-wider border border-pale-green"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
