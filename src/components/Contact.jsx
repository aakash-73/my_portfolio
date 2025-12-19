import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { personalInfo } from '../data';
import GeometricBackground from './GeometricBackground';

const Contact = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section id="contact" className="py-20 bg-black relative overflow-hidden">
      {/* Geometric background */}
      <GeometricBackground variant="dark" />
      <div className="absolute inset-0 opacity-5">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-pale-green"
            style={{
              width: Math.random() * 150 + 50,
              height: Math.random() * 150 + 50,
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
            <span className="text-white">Let's</span>{' '}
            <span className="text-red-500">Connect</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4 mb-6">
            <div className="w-16 h-1 bg-red-500"></div>
            <div className="w-4 h-4 bg-pale-green transform rotate-45"></div>
            <div className="w-16 h-1 bg-red-500"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ready to discuss opportunities, collaborations, or just tech talk? I'm all ears.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Contact Cards */}
            {[
              { icon: FaLinkedin, label: "LinkedIn", value: "Connect", href: personalInfo.linkedin },
              { icon: FaGithub, label: "GitHub", value: "View Code", href: personalInfo.github }
            ].map((contact, index) => (
              <motion.a 
                key={index}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white border-4 border-pale-green p-6 relative group hover:border-red-500 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 group-hover:w-6 group-hover:h-6 transition-all"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-pale-green group-hover:w-6 group-hover:h-6 transition-all"></div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black group-hover:bg-red-500 transition-colors">
                    <contact.icon className="text-pale-green group-hover:text-white transition-colors" size={24} />
                  </div>
                  <div>
                    <h3 className="text-black font-black mb-1 uppercase tracking-wider">{contact.label}</h3>
                    <p className="text-gray-600 text-sm font-semibold">{contact.value}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="bg-red-500 border-4 border-white p-8 text-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 bg-black"></div>
            <div className="absolute top-0 right-0 w-6 h-6 bg-pale-green"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 bg-pale-green"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-black"></div>
            
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">
              Ready to Build Something Great?
            </h3>
            <p className="text-white mb-6 text-lg">
              Let's turn ideas into reality. Drop me a message.
            </p>
            <motion.a 
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-pale-green hover:text-black transition-all border-4 border-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope /> Send Message
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t-4 border-pale-green relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm font-semibold">
              © {currentYear} {personalInfo.name}. All rights reserved.
            </p>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4 font-semibold">
            Designed with <span className="text-red-500">{'<code/>'}</span> and creativity
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
