"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Save, User, Phone, Bike, CreditCard } from "lucide-react";

interface RiderDetailsDialogProps {
  rider: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function RiderDetailsDialog({ rider, open, onOpenChange, onUpdate }: RiderDetailsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState(rider?.vehicle_type || "");
  const [licensePlate, setLicensePlate] = useState(rider?.license_plate || "");

  // Update local state when rider changes (e.g. opening different rider)
  // Use a key or effect in parent, or simple effect here.
  // Ideally parent controls this or we use useEffect.
  // For simplicity, we assume the dialog is remounted or we rely on initial state if 'rider' key changes in parent.
  // Better: useEffect to sync state if rider prop changes while open.
  
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logistics/riders/${rider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_type: vehicleType, license_plate: licensePlate }),
      });
      if (!res.ok) throw new Error("Failed to update");
      onUpdate();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this rider from your fleet?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/logistics/riders/${rider.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Failed to remove");
      onUpdate();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!rider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rider Details</DialogTitle>
          <DialogDescription>View and manage rider information.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {rider.profiles?.full_name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-bold text-lg">{rider.profiles?.full_name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Phone className="h-3 w-3" /> {rider.profiles?.phone_number || "No phone"}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <CreditCard className="h-3 w-3" /> Status: {rider.verification_status}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Vehicle Type</Label>
            <Input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>License Plate</Label>
            <Input value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between w-full">
          <Button variant="destructive" onClick={handleRemove} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" /> Remove
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
