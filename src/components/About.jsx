import React from 'react';
import { motion } from 'framer-motion';
import { about, achievements } from '../data';
import GeometricBackground from './GeometricBackground';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Enhanced geometric background elements */}
      <GeometricBackground variant="dark" />
      <div className="absolute top-0 right-0 w-64 h-64 border-4 border-pale-green opacity-10 transform rotate-45"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500 opacity-5"></div>
      
      {/* Additional circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full border-2 border-red-500"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.05
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: Math.random() * 5 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Triangles scattered */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`triangle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.08
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: Math.random() * 8 + 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100">
            <polygon
              points="50,10 90,80 10,80"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
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
            <span className="text-black">About</span>{' '}
            <span className="text-red-500">Me</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-1 bg-red-500"></div>
            <div className="w-4 h-4 bg-pale-green transform rotate-45"></div>
            <div className="w-16 h-1 bg-red-500"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-800 text-lg leading-relaxed mb-6">
              {about.summary}
            </p>
            <div className="space-y-4">
              {about.highlights.map((highlight, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 border-2 border-red-500 bg-pale-green transform rotate-45 mt-1"></div>
                  <p className="text-gray-700 group-hover:text-black transition-colors">
                    {highlight}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index}
                className="relative bg-black border-4 border-pale-green p-6 hover:border-red-500 transition-all group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-pale-green"></div>
                
                <div className="text-6xl font-black text-red-500 mb-2 group-hover:text-pale-green transition-colors">
                  {achievement.metric}
                </div>
                <div className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  {achievement.label}
                </div>
                <div className="text-xs text-gray-400">
                  {achievement.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
