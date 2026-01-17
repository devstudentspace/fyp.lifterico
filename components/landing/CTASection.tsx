"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="container mx-auto flex flex-col items-center text-center">
        <motion.div
          className="glass-card p-8 md:p-12 rounded-3xl"
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
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Ready to Transform Your Deliveries?
          </h2>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Join thousands of businesses already using Lifterico to streamline their delivery operations.
          </p>
          <div className="mt-12">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
