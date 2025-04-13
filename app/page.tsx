"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";

const prompts = [
  "Cooking for a date night?",
  "Craving something spicy?",
  "Making something cozy?",
  "Using what’s in season?",
  "Trying a plant-based dish?",
];

export default function LandingPage() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const { scrollY } = useScroll();

  const bgY = useTransform(scrollY, [0, 300], [0, -100]);
  const bgYSmooth = useSpring(bgY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
      {/* Scroll-reactive background image */}
      <motion.div
        style={{ y: bgYSmooth }}
        className="fixed top-0 left-0 w-full h-[120vh] bg-[url('/hero-bg.webp')] bg-cover bg-center z-0 opacity-20 pointer-events-none"
        aria-hidden
      />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen w-full flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-primary"
        >
          <span className="bg-gradient-to-r from-[#7d6b5b] via-[#bfa97f] to-[#8a6f56] bg-clip-text text-transparent">
            What do you want to cook?
          </span>
        </motion.h1>

        <motion.p
          key={currentPrompt}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-muted-foreground mt-4 max-w-md sm:max-w-xl text-base sm:text-lg"
        >
          {prompts[currentPrompt]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              className="mt-6 px-6 py-2 text-white bg-gradient-to-r from-[#7d6b5b] via-[#bfa97f] to-[#8a6f56] hover:opacity-90 transition shadow-lg"
            >
              <Link href="/search">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>

        <div
          onClick={() => {
            const el = document.getElementById("about");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        >
          <span className="text-sm">About</span>
          <ArrowDown className="h-4 w-4 mt-1 animate-bounce" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-24 w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10"
          >
            Find ingredients and support farmers.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-lg sm:text-xl font-semibold mb-2">
                Cook Anything
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="w-full max-w-[16rem] aspect-[4/3] rounded-md overflow-hidden mb-3 shadow-lg"
              >
                <img
                  src="/farmers.png"
                  alt="Search Dish"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <p className="text-sm sm:text-base">
                Think of any dish you love – our system will help you cook it
                using ingredients from local markets.
              </p>
            </motion.div>

            {/* Vertical Separator */}
            <div className="hidden md:flex justify-center">
              <Separator orientation="vertical" className="h-full" />
            </div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-lg sm:text-xl font-semibold mb-2">
                Shop Fresher
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="w-full max-w-[16rem] aspect-[4/3] rounded-md overflow-hidden mb-3 shadow-lg"
              >
                <img
                  src="/markets.png"
                  alt="Local Markets"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <p className="text-sm sm:text-base">
                Once we pull out the ingredients, we show you which local
                farmers markets carry them. Eat better, support small growers.
              </p>
            </motion.div>
          </div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto text-center text-lg sm:text-2xl"
          >
            Our mission is to empower home cooks with smart, ingredient-driven
            tools while supporting local farmers through transparent, seasonal
            sourcing.
          </motion.div>
        </div>
      </section>
    </div>
  );
}
