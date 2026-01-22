"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Bike, Clock, CheckCircle2, XCircle, Settings } from "lucide-react";
import { InviteRiderModal } from "./invite-rider-modal";
import { CreateRiderModal } from "./create-rider-modal";
import { RiderDetailsDialog } from "./rider-details-dialog";

export function FleetList() {
  const [activeTab, setActiveTab] = useState<'riders' | 'invites'>('riders');
  const [riders, setRiders] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Rider Details Dialog
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'riders') {
        const res = await fetch('/api/logistics/riders');
        if (res.ok) setRiders(await res.json());
      } else {
        const res = await fetch('/api/logistics/invites');
        if (res.ok) setInvites(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleManageRider = (rider: any) => {
    setSelectedRider(rider);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('riders')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'riders' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Active Fleet
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'invites' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Pending Invites
          </button>
        </div>
        <div className="flex gap-2">
            <CreateRiderModal onRiderCreated={() => { if(activeTab === 'riders') fetchData(); else setActiveTab('riders'); }} />
            <InviteRiderModal onInviteSent={() => { if(activeTab === 'invites') fetchData(); else setActiveTab('invites'); }} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {activeTab === 'riders' && (
            <>
              {riders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                  <Bike className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No riders in your fleet yet.</p>
                  <p className="text-sm">Invite riders to get started.</p>
                </div>
              ) : (
                riders.map((rider) => (
                  <Card key={rider.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{rider.profiles?.full_name || "Unknown Rider"}</h3>
                          <p className="text-sm text-muted-foreground">{rider.profiles?.phone_number || "No phone"}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{rider.vehicle_type}</Badge>
                            <Badge variant="secondary">{rider.license_plate}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <Badge variant={rider.current_status === 'online' ? 'default' : 'secondary'}>
                            {rider.current_status.toUpperCase()}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleManageRider(rider)}>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}

          {activeTab === 'invites' && (
            <>
              {invites.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No pending invites.</p>
                </div>
              ) : (
                invites.map((invite) => (
                  <Card key={invite.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{invite.email}</h3>
                          <p className="text-xs text-muted-foreground">Sent: {new Date(invite.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {invite.status.toUpperCase()}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
        </div>
      )}

      {/* Details Dialog */}
      {selectedRider && (
        <RiderDetailsDialog 
            rider={selectedRider} 
            open={isDetailsOpen} 
            onOpenChange={setIsDetailsOpen}
            onUpdate={fetchData}
        />
      )}
    </div>
  );
}