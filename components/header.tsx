"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import { DM_Serif_Display, Merriweather, Quicksand, Bitter, Cabin } from 'next/font/google';

export const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
});

export const merriweather = Merriweather({
  weight: ['700'],
  subsets: ['latin'],
});

export const quicksand = Quicksand({
  weight: ['700'],
  subsets: ['latin'],
});

export const bitter = Bitter({
  weight: ['600'],
  subsets: ['latin'],
});

export const cabin = Cabin({
  weight: ['700'],
  subsets: ['latin'],
});

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
      <div
        className={`h-full mx-auto flex items-center justify-between transition-all duration-200 ease-in-out ${
          scrolled ? "max-w-6xl px-4" : "max-w-7xl px-6"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 transition-all duration-200 ease-in-out">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="transition-all duration-200 ease-in-out w-7 h-7"
          />
          <span
            className={`${merriweather.className} font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out transform ${
              scrolled
                ? "opacity-0 max-w-0 pointer-events-none"
                : "opacity-100 max-w-xs"
            }`}
          >
            Farmer Feast
          </span>
        </div>

        {/* Nav links (desktop only) */}
        <div className="hidden md:flex items-center gap-6 text-sm">
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
            Search
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

        {/* Right side: Auth + Theme + Mobile menu */}
        <div className="flex items-center gap-4">
          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* {            <Link
              href="/login"
              className="text-muted-foreground text-sm hover:opacity-80 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-black font-medium text-sm px-4 py-1.5 rounded-full bg-yellow-400 shadow-yellow-500/30 shadow-lg hover:brightness-105 transition"
            >
              Sign up
            </Link>} */}
          </div>

          <ThemeSwitcher />

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="space-y-1">
              <div className="w-5 h-0.5 bg-white" />
              <div className="w-4 h-0.5 bg-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
            Search
          </Link>
          <Link
            href="/markets"
            className="text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Markets
          </Link>
          {/* {        <Link href="/markets" className="text-sm" onClick={() => setMobileOpen(false)}>
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
        </Link>} */}
        </div>
      )}
    </nav>
  );
}
