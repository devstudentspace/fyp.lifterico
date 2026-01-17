'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Package } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "/docs/api" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Help Center", href: "/help" },
    { name: "Documentation", href: "/docs" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer({ className }: { className?: string }) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={`w-full py-12 sm:py-16 md:py-20 glass-effect ${className || ''}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="relative p-3 rounded-2xl bg-primary shadow-lg">
                <Package className="h-6 sm:h-7 w-6 sm:w-7 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl sm:text-2xl text-foreground">
                Lifterico
              </span>
            </div>
            <p className="text-foreground/80 mb-4 sm:mb-6 max-w-xs text-sm sm:text-base">
              Smart Delivery Tracking for Nigerian Businesses.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.name}
                  className="p-2 sm:p-3 rounded-full bg-foreground/10 hover:bg-foreground/20"
                >
                  <link.icon className="h-4 sm:h-5 w-4 sm:w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 sm:mt-0">
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Product</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/80 hover:text-primary text-sm sm:text-base">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 sm:mt-0">
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/80 hover:text-primary text-sm sm:text-base">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 sm:mt-0">
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Resources</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/80 hover:text-primary text-sm sm:text-base">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 border-t border-foreground/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/80 text-xs sm:text-sm">
            &copy; {currentYear ?? 2024} Lifterico. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-3 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="text-foreground/80 hover:text-primary text-xs sm:text-sm">{link.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
