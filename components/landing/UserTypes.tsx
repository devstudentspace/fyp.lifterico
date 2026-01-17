"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Truck, Bike } from "lucide-react";
import { motion } from "framer-motion";

const userTypes = [
  {
    type: "SMEs",
    description: "Create orders, track deliveries, grow your business.",
    cta: "Start Selling",
    href: "/auth/sign-up",
    icon: Building2,
  },
  {
    type: "Logistics Companies",
    description: "Manage your fleet, accept orders, earn more.",
    cta: "Partner With Us",
    href: "/auth/sign-up",
    icon: Truck,
  },
  {
    type: "Riders",
    description: "Accept deliveries, earn money, flexible hours.",
    cta: "Become a Rider",
    href: "/auth/sign-up",
    icon: Bike,
  },
];

export function UserTypes() {
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
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Built for Everyone in the Delivery Chain
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Whether you're a business owner, logistics company, or rider, we've got you covered.
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {userTypes.map((user) => (
            <motion.div
              key={user.type}
              variants={itemVariants}
              whileHover="hover"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              <Card className="glass-card flex flex-col h-full p-8 border border-white/20 backdrop-blur-lg text-center"
                style={{ transform: "translateZ(0)" }}>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                      <user.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.type}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                    {user.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Link href={user.href} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      {user.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
