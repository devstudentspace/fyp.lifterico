"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Rider } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onAssignmentSuccess: () => void;
}

export function AssignRiderModal({ isOpen, onClose, orderId, onAssignmentSuccess }: AssignRiderModalProps) {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableRiders();
      setShowSuccess(false); // Reset success state on open
    }
  }, [isOpen]);

  async function fetchAvailableRiders() {
    try {
      setLoading(true);

      // Get the current user to determine which logistics company they belong to
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error getting user:", userError);
        return;
      }

      // Fetch riders who are active and available and belong to this logistics company
      const { data, error } = await supabase
        .from('rider_profiles')
        .select(`
          id,
          current_status,
          vehicle_type,
          license_plate,
          license_number,
          logistics_id,
          created_at,
          updated_at,
          profiles:profiles (full_name, phone_number)
        `)
        .eq('current_status', 'online') // Only show online riders
        .eq('logistics_id', user.id); // Only show riders belonging to this logistics company

      if (error) {
        console.error("Error fetching riders:", error);
        return;
      }

      // Flatten the nested profile data to match the Rider interface
      const flattenedRiders = data?.map(rider => ({
        ...rider,
        name: rider.profiles?.[0]?.full_name,
        phone_number: rider.profiles?.[0]?.phone_number
      })) || [];

      setRiders(flattenedRiders);
    } catch (error) {
      console.error("Error fetching riders:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAssignRider = async () => {
    if (!selectedRiderId) return;

    try {
      setAssigning(true);

      // Update the order with the selected rider ID
      const { error } = await supabase
        .from('orders')
        .update({
          rider_id: selectedRiderId,
          status: 'assigned' // Change status to assigned once rider is assigned
        })
        .eq('id', orderId);

      if (error) {
        console.error("Error assigning rider:", error);
        return;
      }

      // Show success animation
      setShowSuccess(true);

      // Delay closing to let animation play
      setTimeout(() => {
        setShowSuccess(false);
        onAssignmentSuccess();
      }, 2000);

    } catch (error) {
      console.error("Error assigning rider:", error);
    } finally {
      setAssigning(false);
    }
  };

  const handleClose = () => {
    if (showSuccess) return; // Prevent closing during success animation
    setSelectedRiderId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-2"
              >
                Rider Assigned!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground"
              >
                The order has been successfully assigned to the rider.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Assign Rider to Order</DialogTitle>
              </DialogHeader>

              {loading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rider" className="text-right">
                      Rider
                    </Label>
                    <div className="col-span-3">
                      <Select value={selectedRiderId} onValueChange={setSelectedRiderId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a rider" />
                        </SelectTrigger>
                        <SelectContent>
                          {riders.length === 0 ? (
                             <SelectItem value="none" disabled>No active riders available</SelectItem>
                          ) : (
                            riders.map((rider) => (
                              <SelectItem key={rider.id} value={rider.id}>
                                {rider.profiles?.[0]?.full_name || 'Unnamed Rider'} ({rider.vehicle_type || 'Vehicle type not set'})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={assigning}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAssignRider}
                  disabled={!selectedRiderId || assigning}
                >
                  {assigning ? "Assigning..." : "Assign Rider"}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}