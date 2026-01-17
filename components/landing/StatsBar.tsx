"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Package, Building2, Bike, Star } from "lucide-react";
import { motion } from "framer-motion";

export function StatsBar() {
  const stats = [
    { value: "1000+", label: "Deliveries Completed", icon: Package },
    { value: "500+", label: "Active Businesses", icon: Building2 },
    { value: "200+", label: "Verified Riders", icon: Bike },
    { value: "4.8★", label: "Average Rating", icon: Star },
  ];

  const [animatedValues, setAnimatedValues] = useState(Array(stats.length).fill(0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(stats.map(stat => stat.value));
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
    hover: {
      y: -10,
      rotateX: 10,
      rotateY: 10,
    }
  };


  return (
    <section className="w-full py-12 sm:py-16">
      <div className="container mx-auto">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
         variants={containerVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover="hover"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <Card className="glass-card flex flex-col items-center p-4 sm:p-6 text-center w-full border border-white/20 backdrop-blur-lg h-full"
                style={{ transform: "translateZ(0)" }}>
                <stat.icon className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500 mb-3 sm:mb-4" />
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {animatedValues[index]}
                </p>
                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
