"use client";

import { Truck, User, PackageCheck } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your account in minutes with our simple registration process.",
      icon: User,
    },
    {
      step: 2,
      title: "Create Order",
      description: "Enter pickup and delivery details with our intuitive dashboard.",
      icon: PackageCheck,
    },
    {
      step: 3,
      title: "Track & Deliver",
      description: "Monitor in real-time until delivery with live updates.",
      icon: Truck,
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-12 md:py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground">
          Get Started in 3 Simple Steps
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl sm:max-w-3xl mx-auto">
          Our streamlined process makes delivery management effortless for everyone.
        </p>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item) => (
            <motion.div
              key={item.step}
              className="glass-card flex flex-col items-center p-6 sm:p-8 text-center rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -10,
                rotateX: 10,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl sm:text-2xl mx-auto mb-4 sm:mb-6">
                {item.step}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-foreground">
                {item.title}
              </h3>
              <p className="text-foreground/80 text-sm sm:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
