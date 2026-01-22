"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Briefcase, Truck, Shield, Calendar, CreditCard, CheckCircle, Ban, RotateCcw } from "lucide-react";

interface UserDetailsModalProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  if (!user) return null;

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'rider': return Truck;
      case 'sme': return Briefcase;
      case 'logistics': return MapPin;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  // Helper to format keys (e.g. "business_name" -> "Business Name")
  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const handleAction = async (action: 'approve' | 'suspend' | 'activate' | 'desuspend') => {
    setLoadingAction(action);
    try {
      const response = await fetch('/api/admin/users/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role, action })
      });

      if (response.ok) {
        // Optionally refresh the parent component or update the user status
        window.location.reload(); // Simple solution for now
      } else {
        let errorMessage = `Failed to ${action} user`;
        try {
          const error = await response.json();
          console.error(`Error ${action}ing user:`, error);
          errorMessage = error.error || errorMessage;
        } catch (e) {
          console.error(`Error parsing response for ${action}ing user:`, e);
          // Use the default error message if JSON parsing fails
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Section */}
        <div className="bg-muted/30 p-6 border-b">
          <DialogHeader className="flex flex-row items-start justify-between">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background shadow-sm">
                <RoleIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold">{user.name}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize bg-background">{user.role}</Badge>
                  <Badge
                    variant={user.status === 'verified' || user.status === 'active' ? 'default' : 'secondary'}
                    className={user.status === 'unverified' || user.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200' : 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'}
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Section */}
        <div className="p-6 grid gap-6">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email Address</label>
              <div className="flex items-center gap-2 text-sm font-medium break-all">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {user.email}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Joined Date</label>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {new Date(user.joinedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Role Specific Details */}
          {user.details && Object.keys(user.details).length > 0 && (
            <div className="bg-muted/20 rounded-lg p-4 space-y-4 border">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Role Details
              </h4>

              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                {Object.entries(user.details).map(([key, value]) => {
                  if (!value || (typeof value !== 'string' && typeof value !== 'number')) return null;
                  return (
                    <div key={key} className={String(value).length > 30 ? "col-span-2" : ""}>
                      <span className="text-muted-foreground block text-xs">{formatKey(key)}</span>
                      <span className="font-medium break-words">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="bg-muted/30 p-4 border-t flex sm:justify-between items-center w-full">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <div className="flex gap-2">
            {user.status === 'pending' || user.status === 'unverified' ? (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleAction('approve')}
                disabled={loadingAction === 'approve'}
              >
                {loadingAction === 'approve' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" /> Approve User
                  </>
                )}
              </Button>
            ) : user.status === 'suspended' ? (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleAction('activate')}
                disabled={loadingAction === 'activate'}
              >
                {loadingAction === 'activate' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" /> Activate User
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => handleAction('suspend')}
                disabled={loadingAction === 'suspend'}
              >
                {loadingAction === 'suspend' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <>
                    <Ban className="h-4 w-4 mr-2" /> Suspend User
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}