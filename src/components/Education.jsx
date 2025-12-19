import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaMapMarkerAlt, FaCalendar, FaStar } from 'react-icons/fa';
import { education } from '../data';
import GeometricBackground from './GeometricBackground'; // Assuming you have a GeometricBackground component

const Education = () => {
  return (
    <section id="education" className="py-20 bg-white relative overflow-hidden">
      {/* Enhanced geometric elements */}

      <GeometricBackground variant="dark" />
      <div className="absolute top-0 left-0 w-48 h-48 border-4 border-pale-green opacity-10 transform -rotate-12"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500 opacity-5 transform rotate-45"></div>
      
      {/* Floating circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`edu-circle-${i}`}
          className="absolute rounded-full border-3 border-red-500"
          style={{
            width: Math.random() * 80 + 40,
            height: Math.random() * 80 + 40,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.07
          }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 0]
          }}
          transition={{
            duration: Math.random() * 6 + 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Triangles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`edu-tri-${i}`}
          className="absolute"
          style={{
            right: `${i * 30 + 10}%`,
            top: `${i * 25 + 10}%`,
            opacity: 0.08
          }}
          animate={{
            rotate: [0, -360]
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="70" height="70" viewBox="0 0 100 100">
            <polygon
              points="50,10 90,80 10,80"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
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
            <span className="text-black">Education</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-1 bg-red-500"></div>
            <div className="w-4 h-4 bg-pale-green transform rotate-45"></div>
            <div className="w-16 h-1 bg-red-500"></div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {education.map((edu, index) => (
            <motion.div 
              key={index}
              className="bg-black border-4 border-pale-green p-8 relative hover:border-red-500 transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 bg-red-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-pale-green"></div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 p-4 bg-pale-green">
                  <FaGraduationCap className="text-black" size={48} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-pale-green text-lg font-bold mb-2">
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500 border-2 border-white">
                      <FaStar className="text-white" />
                      <span className="text-white font-black">GPA: {edu.gpa}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2 font-semibold">
                      <FaCalendar size={14} />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                      <FaMapMarkerAlt size={14} />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  {edu.highlights && (
                    <ul className="space-y-2">
                      {edu.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 bg-pale-green mt-2"></span>
                          <span className="text-white leading-relaxed">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
