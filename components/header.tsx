"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

export default function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 z-50 w-full h-16 backdrop-blur transition-colors duration-200 ${
        scrolled ? "bg-background/90 shadow-md" : "bg-transparent shadow-none"
      }`}
    >
      <div className="h-full relative w-full max-w-7xl mx-auto flex items-center justify-between px-4">
        {/* Left: Logo */}
        <div
          className={`flex items-center gap-2 transition-all duration-200 ease-in-out transform ${
            scrolled ? "translate-x-8" : "translate-x-0"
          }`}
        >
          <img
            src="/favicon.ico"
            alt="Logo"
            className="transition-all duration-200 ease-in-out w-7 h-7"
          />
          <span
            className={`font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out ${
              scrolled
                ? "opacity-0 max-w-0 pointer-events-none"
                : "opacity-100 max-w-xs"
            }`}
          >
            Farmer Feast
          </span>
        </div>

        {/* Center: Nav Links */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full font-medium transition-colors duration-200 ${
              isActive("/")
                ? "selected-nav"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            Get Started
          </Link>
          <Link
            href="/search"
            className={`px-3 py-1.5 rounded-full font-medium transition-colors duration-200 ${
              isActive("/search")
                ? "selected-nav"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            RecipeSearch
          </Link>
          <Link
            href="/markets"
            className={`px-3 py-1.5 rounded-full font-medium transition-colors duration-200 ${
              isActive("/markets")
                ? "selected-nav"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            Markets
          </Link>
        </div>

        {/* Right: Theme Switcher & Mobile Menu */}
        <div
          className={`flex items-center gap-4 justify-end transition-all duration-200 ease-in-out transform ${
            scrolled ? "-translate-x-8" : "translate-x-0"
          }`}
        >
          <ThemeSwitcher />
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="space-y-1">
              <div className="w-5 h-0.5 dark:bg-primary-foreground bg-primary" />
              <div className="w-4 h-0.5 dark:bg-primary-foreground bg-primary" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 pt-2 flex flex-col gap-2 bg-background shadow-md transition-all duration-200 ease-in-out">
          <Link
            href="/"
            className="text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
          <Link
            href="/search"
            className="text-sm"
            onClick={() => setMobileOpen(false)}
          >
            RecipeSearch
          </Link>
          <Link
            href="/markets"
            className="text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Markets
          </Link>
          {/* Optional links can be uncommented if needed */}

          {/*
          <Link href="/markets" className="text-sm" onClick={() => setMobileOpen(false)}>
            Markets
          </Link>
          <Link href="/login" className="text-sm" onClick={() => setMobileOpen(false)}>
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-yellow-400 text-black px-4 py-2 rounded-full w-fit"
            onClick={() => setMobileOpen(false)}
          >
            Sign up
          </Link>
          */}
        </div>
      )}
    </nav>
  );
}
