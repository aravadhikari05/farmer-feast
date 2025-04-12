"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

export default function Header() {
  const [headerVisible, setHeaderVisible] = useState(true);

  const lastScrollPosition = useRef(0);
  const accumulatedDelta = useRef(0);
  const scrollDirectionRef = useRef<"up" | "down" | null>(null);

  const handleScrollPositionChange = (position: number) => {
    const delta = position - lastScrollPosition.current;
    const newDirection = delta > 0 ? "down" : delta < 0 ? "up" : null;

    if (newDirection !== scrollDirectionRef.current) {
      accumulatedDelta.current = 0;
      scrollDirectionRef.current = newDirection;
    }

    accumulatedDelta.current += Math.abs(delta);

    if (position === 0) {
      setHeaderVisible(true);
      accumulatedDelta.current = 0;
    } else if (
      scrollDirectionRef.current === "up" &&
      accumulatedDelta.current > 64
    ) {
      setHeaderVisible(true);
      accumulatedDelta.current = 0;
    } else if (
      scrollDirectionRef.current === "down" &&
      accumulatedDelta.current > 64 &&
      position > 0
    ) {
      setHeaderVisible(false);
      accumulatedDelta.current = 0;
    }

    lastScrollPosition.current = position;
  };

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      handleScrollPositionChange(scrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full h-16 bg-background border-b border-b-foreground/10 transition-transform duration-300 ${
        headerVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full h-full max-w-5xl mx-auto flex items-center justify-between px-4 text-sm">
        <Link href="/" className="flex items-center gap-3">
          <img src="/favicon.ico" alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-lg transition-all duration-200 hover:opacity-80">
            Farmer Feast
          </span>
        </Link>

        <ThemeSwitcher />
      </div>
    </nav>
  );
}
