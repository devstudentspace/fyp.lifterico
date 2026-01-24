"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AcceptanceSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
}

export function AcceptanceSuccessModal({ isOpen, onClose, orderNumber }: AcceptanceSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Order Accepted Successfully</DialogTitle>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="relative h-32 bg-green-600 flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  className="absolute inset-0 flex flex-wrap gap-4 p-4"
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Package key={i} className="h-8 w-8 text-white rotate-12" />
                    ))}
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="relative bg-background rounded-full p-4 shadow-xl"
                >
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </motion.div>
              </div>

              <div className="p-8 text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold mb-2"
                >
                  Delivery Accepted!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground mb-8"
                >
                  Order <span className="font-mono font-bold text-foreground">{orderNumber || "#CONFIRMED"}</span> has been successfully added to your active deliveries.
                </motion.p>

                <div className="flex flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button asChild className="w-full py-6 text-lg font-semibold shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-700">
                      <Link href="/dashboard/logistics/orders">
                        Go to My Deliveries <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button variant="outline" onClick={onClose} className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      Accept More Orders
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
