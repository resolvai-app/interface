"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import GalaxyBackground from "@/components/GalaxyBackground";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // 添加弹性滚动效果
  const springConfig = { stiffness: 100, damping: 30, bounce: 0 };
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, springConfig);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <GalaxyBackground />
      {/* Dynamic background elements */}
      <motion.div className="absolute inset-0" style={{ scale: springScale }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-blue-900/20" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Navigation bar */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
          style={{ y: springY }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                className="text-2xl font-bold text-blue-400 font-['Long_Cang',cursive]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                ResolvAI
              </motion.div>
              <div className="flex items-center space-x-6">
                <motion.a
                  href="#features"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Features
                </motion.a>
                <motion.a
                  href="#demo"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Demo
                </motion.a>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/chat"
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Try Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero section */}
        <section className="min-h-screen flex items-center justify-center pt-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-6xl font-bold text-white mb-6 font-['Long_Cang',cursive]"
                style={{ opacity }}
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Smart Voice Interaction
                <br />
                Making Communication Easier
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                style={{ opacity }}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Experience fluid and natural voice interactions powered by advanced AI technology.
                Whether it&apos;s customer service or daily conversations, we&apos;ve got you
                covered.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href="/chat"
                  className="px-8 py-3 bg-blue-500 text-white rounded-full text-lg hover:bg-blue-600 transition-colors inline-block"
                >
                  Try Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-20 bg-gray-900/90">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl font-bold text-center text-white mb-12 font-['Long_Cang',cursive]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Core Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Voice Recognition",
                  description:
                    "Accurate voice recognition supporting multiple languages and dialects",
                  icon: "🎯",
                },
                {
                  title: "Natural Language Processing",
                  description: "Understanding user intent and providing precise responses",
                  icon: "🧠",
                },
                {
                  title: "Real-time Voice Synthesis",
                  description: "Converting text to natural, fluid speech",
                  icon: "🎵",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="text-4xl mb-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo section */}
        <section id="demo" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-700"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
              }}
            >
              <motion.h2
                className="text-4xl font-bold text-center text-white mb-8 font-['Long_Cang',cursive]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Live Demo
              </motion.h2>
              <motion.div
                className="aspect-video bg-gray-900 rounded-xl mb-6 flex items-center justify-center border border-gray-700"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-gray-400">Demo video will be played here</p>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/chat"
                    className="px-8 py-3 bg-blue-500 text-white rounded-full text-lg hover:bg-blue-600 transition-colors inline-block"
                  >
                    Start Experience
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-400">AI Call Assistant</h3>
                <p className="text-gray-400">Making every call intelligent and warm</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-400">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#features"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#demo" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Demo
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/chat"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Get Started
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-400">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">Email: contact@example.com</li>
                  <li className="text-gray-400">Phone: 400-123-4567</li>
                </ul>
              </div>
            </motion.div>
            <motion.div
              className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p>© 2024 AI Call Assistant. All rights reserved.</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </main>
  );
}
