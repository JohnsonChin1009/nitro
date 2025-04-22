"use client";
import React from "react";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  //Animation Variants:
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: 0.2 },
    },
  };
  return (
    <footer className="bg-gray-900 text-gray-700 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={logoVariants}
            className="mb-8 md:mb-0"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Nitro
            </h2>
          </motion.div>

          <div className="flex flex-row space-x-3">
            <div>
              <Github className="h-6 w-6 text-white" />
              <span className="sr-only">GitHub</span>
            </div>
            <div>
              <Twitter className="h-6 w-6 text-white" />
              <span className="sr-only">Twitter</span>
            </div>
            <div>
              <Instagram className="h-6 w-6 text-white" />
              <span className="sr-only">Instagram</span>
            </div>
            <div>
              <Linkedin className="h-6 w-6 text-white" />
              <span className="sr-only">LinkedIn</span>
            </div>

          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-5 pt-5 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">© {currentYear} Nitro. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">Powering the future of Microloan Landscape in Malaysia</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
