import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo } from '../data';
import GeometricBackground from './GeometricBackground';

const Contact = () => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [mailOption, setMailOption] = useState('default');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Portfolio Contact from ${formData.name}`
    );

    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    const mailtoLink = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${personalInfo.email}&su=${subject}&body=${body}`;
    const yahooLink = `https://compose.mail.yahoo.com/?to=${personalInfo.email}&subject=${subject}&body=${body}`;
    const outlookWebLink = `https://outlook.live.com/mail/0/deeplink/compose?to=${personalInfo.email}&subject=${subject}&body=${body}`;

    switch (mailOption) {
      case 'gmail':
        window.open(gmailLink, '_blank');
        break;
      case 'yahoo':
        window.open(yahooLink, '_blank');
        break;
      case 'outlook-web':
        window.open(outlookWebLink, '_blank');
        break;
      default:
        window.location.href = mailtoLink;
    }
  };

  return (
    <section id="contact" className="py-20 bg-black relative overflow-hidden">
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
            Ready to discuss opportunities or collaborations? Send me a message below.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">

          {/* Social Links */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: FaLinkedin, label: "LinkedIn", href: personalInfo.linkedin },
              { icon: FaGithub, label: "GitHub", href: personalInfo.github }
            ].map((contact, index) => (
              <motion.a
                key={index}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-4 border-pale-green p-6 relative group hover:border-red-500 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black group-hover:bg-red-500 transition-colors">
                    <contact.icon className="text-pale-green group-hover:text-white transition-colors" size={24} />
                  </div>
                  <div>
                    <h3 className="text-black font-black uppercase tracking-wider">
                      {contact.label}
                    </h3>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-red-500 border-4 border-white p-8 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-wider text-center">
              Send Me a Message
            </h3>

            <div className="grid gap-4">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="p-4 border-4 border-white bg-black text-white placeholder-gray-400 focus:outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="p-4 border-4 border-white bg-black text-white placeholder-gray-400 focus:outline-none"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="p-4 border-4 border-white bg-black text-white placeholder-gray-400 focus:outline-none"
              />

              {/* Mail Option Selector */}
              <div className="text-white font-semibold">
                <label className="block mb-2 uppercase text-sm">
                  Choose how to send:
                </label>

                <select
                  value={mailOption}
                  onChange={(e) => setMailOption(e.target.value)}
                  className="w-full p-3 border-4 border-white bg-black text-white focus:outline-none"
                >
                  <option value="default">
                    Default Mail App (Outlook / Apple Mail)
                  </option>
                  <option value="gmail">
                    Gmail (Browser)
                  </option>
                  <option value="outlook-web">
                    Outlook Web
                  </option>
                  <option value="yahoo">
                    Yahoo Mail
                  </option>
                </select>
              </div>

              <motion.button
                type="submit"
                className="px-8 py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-pale-green hover:text-black transition-all border-4 border-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>

            </div>
          </motion.form>
        </div>
      </div>

      <footer className="mt-20 pt-8 border-t-4 border-pale-green relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm font-semibold">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
