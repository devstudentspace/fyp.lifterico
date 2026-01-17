"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "../theme-switcher";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // Close mobile menu if open
    setIsMenuOpen(false);

    // Extract the section ID from the href
    const targetId = href.substring(1); // Remove the '#' symbol
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offset = 80; // Account for fixed header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect" : "bg-background"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative p-3 rounded-2xl bg-primary shadow-lg">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-foreground">
            Lifterico
          </span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <a href="#features" className="text-foreground/80 hover:text-primary cursor-pointer" onClick={(e) => scrollToSection(e, '#features')}>Features</a>
          <a href="#how-it-works" className="text-foreground/80 hover:text-primary cursor-pointer" onClick={(e) => scrollToSection(e, '#how-it-works')}>How it Works</a>
          <a href="#pricing" className="text-foreground/80 hover:text-primary cursor-pointer" onClick={(e) => scrollToSection(e, '#pricing')}>Pricing</a>
          <a href="#testimonials" className="text-foreground/80 hover:text-primary cursor-pointer" onClick={(e) => scrollToSection(e, '#testimonials')}>Testimonials</a>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          <Link href="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
          </Link>
          <ThemeSwitcher />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden glass-effect mt-2 mx-4 rounded-2xl overflow-hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col p-6 space-y-5">
              <a href="#features" className="text-foreground/80 py-3 text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#features')}>Features</a>
              <a href="#how-it-works" className="text-foreground/80 py-3 text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#how-it-works')}>How it Works</a>
              <a href="#pricing" className="text-foreground/80 py-3 text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#pricing')}>Pricing</a>
              <a href="#testimonials" className="text-foreground/80 py-3 text-lg cursor-pointer" onClick={(e) => scrollToSection(e, '#testimonials')}>Testimonials</a>
              <div className="border-t border-foreground/10 pt-5 mt-5">
                <div className="flex flex-col gap-4">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full py-6 text-base" onClick={() => setIsMenuOpen(false)}>Login</Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button className="w-full bg-primary py-6 text-base" onClick={() => setIsMenuOpen(false)}>Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
