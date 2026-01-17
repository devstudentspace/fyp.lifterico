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
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "SME",
    price: "Free",
    features: ["Create orders", "Basic tracking", "Email support", "Up to 10 deliveries/month"],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Logistics",
    price: "15% commission",
    features: ["Fleet management", "Analytics", "Priority support", "SMS notifications", "Unlimited deliveries", "API access"],
    buttonText: "Contact Sales",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Custom features", "Dedicated account manager", "Advanced analytics", "API access", "White-label solution", "24/7 premium support"],
    buttonText: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="w-full py-16 md:py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`glass-card rounded-lg p-8 ${plan.popular ? 'border-primary' : ''}`}
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
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-4xl font-bold text-primary mt-2">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-1" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.popular ? 'bg-primary' : 'bg-foreground/20'}`}>
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
