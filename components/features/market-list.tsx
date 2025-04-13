"use client";

import { useState} from "react";
import MarketCard from "../ui/market-card";
import marketData from "@/scripts/market-info.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

export default function MarketCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // Track animation direction: -1 for left, 1 for right
  const markets = marketData.markets;
  const { scrollY } = useScroll();

  const bgY = useTransform(scrollY, [0, 300], [0, -100]);
  const bgYSmooth = useSpring(bgY, { damping: 20, stiffness: 100 });
  
  const goToPrevious = () => {
    setDirection(-1); // Going left
    const isFirstMarket = currentIndex === 0;
    const newIndex = isFirstMarket ? markets.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const goToNext = () => {
    setDirection(1); // Going right
    const isLastMarket = currentIndex === markets.length - 1;
    const newIndex = isLastMarket ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    // Set direction based on index comparison
    setDirection(slideIndex > currentIndex ? 1 : -1);
    setCurrentIndex(slideIndex);
  };

  const currentMarket = markets[currentIndex];

  return (
    <div className="w-full relative overflow-visible">
      {/* Scroll-reactive background image */}
      <motion.div
        style={{ y: bgYSmooth }}
        className="fixed top-0 left-0 w-full h-[120vh] bg-[url('/hero-bg.webp')] bg-cover bg-center z-0 opacity-20 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex items-center justify-center w-full min-h-[calc(100vh)]">
        <div className="relative w-full px-4 overflow-visible">
          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 md:-left-8 lg:-left-12 z-50">
            <button 
              onClick={goToPrevious}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-white transition-colors border border-muted"
              aria-label="Previous market"
            >
              <ChevronLeft size={24} className="text-primary" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 md:-right-8 lg:-right-12 z-50">
            <button 
              onClick={goToNext}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-white transition-colors border border-muted"
              aria-label="Next market"
            >
              <ChevronRight size={24} className="text-primary" />
            </button>
          </div>

          <div className="max-w-5xl mx-auto relative min-h-[500px] flex items-center justify-center overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
                <motion.div
                key={currentMarket.name}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction * 50 // Moves in from right or left based on direction
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction * -50 // Exits to right or left based on direction
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
                >
                <MarketCard
                  name={currentMarket.name}
                  image_url={currentMarket.image_url}
                  location={currentMarket.location}
                  time={currentMarket.time}
                  months={currentMarket.months}
                  features={currentMarket.features}
                  about={currentMarket.about}
                />
                </motion.div>
            </AnimatePresence>

            {/* Dots navigation */}
            <div className="flex justify-center gap-2 mt-6 absolute bottom-4 left-0 right-0">
              {markets.map((_, marketIndex) => (
                <button
                  key={marketIndex}
                  onClick={() => goToSlide(marketIndex)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentIndex === marketIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                  aria-label={`Go to market ${marketIndex + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
