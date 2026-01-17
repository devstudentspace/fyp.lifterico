"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin, Target, Camera
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Real-time Tracking",
    icon: MapPin,
    description: "Track every delivery live on interactive maps with live location updates.",
  },
  {
    title: "Smart Assignment",
    icon: Target,
    description: "AI-powered auto-assignment of nearest available rider based on location and rating.",
  },
  {
    title: "Proof of Delivery",
    icon: Camera,
    description: "Photo verification, OTP confirmation, or digital signature validation.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-20">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground">
            Everything You Need for Efficient Deliveries
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl sm:max-w-3xl mx-auto">
            A powerful, modern platform to manage your deliveries, riders, and customers with cutting-edge features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -10,
                rotateX: 10,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <Card className="glass-card p-6 sm:p-8 rounded-lg h-full flex flex-col"
                style={{ transform: "translateZ(0)" }}>
                <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 pb-4">
                  <div className="p-3 rounded-full bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/80 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
