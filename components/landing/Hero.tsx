"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 flex items-center">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
        <motion.div
          className="glass-card p-6 sm:p-8 md:p-12 rounded-3xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground">
            Smart Delivery Tracking for Your Business
          </h1>
          <p className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
            Connect SMEs, logistics companies, and riders on one seamless platform.
            Experience real-time tracking, secure payments, and effortless deliveries.
          </p>
          <div className="mt-8 sm:mt-12">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl w-full md:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="w-full h-64 sm:h-80 md:h-96 glass-card rounded-xl flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
        >
          <p className="text-foreground/50 text-center px-4">App Mockup Placeholder</p>
        </motion.div>
      </div>
    </section>
  );
}
