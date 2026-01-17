"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aisha Yusuf",
    business: "Mama Put Catering",
    quote: "Lifterico transformed our delivery process. Our customers are happier and our business is growing faster than ever!",
    rating: 5,
    avatar: "AY",
  },
  {
    name: "Chukwuma Eze",
    business: "Swift Logistics",
    quote: "Managing our fleet used to be a nightmare. Lifterico's smart assignment and real-time tracking are game-changers.",
    rating: 5,
    avatar: "CE",
  },
  {
    name: "Fatima Bello",
    business: "Bello Fabrics",
    quote: "The secure payment system with escrow gives me peace of mind. Highly recommend Lifterico for any small business.",
    rating: 5,
    avatar: "FB",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-16 md:py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Trusted by Businesses Across Nigeria
          </h2>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Hear from businesses who have transformed their delivery operations with Lifterico.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              className="glass-card p-6 rounded-lg"
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
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-foreground/80">{testimonial.business}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-foreground/80">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
