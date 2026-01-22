"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, MapPin, Package, Truck, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

// Types
import { PackageSize } from "@/lib/types";

const STEPS = [
  { id: 1, title: "Pickup", icon: MapPin },
  { id: 2, title: "Delivery", icon: Truck },
  { id: 3, title: "Package", icon: Package },
  { id: 4, title: "Partner", icon: Building2 },
  { id: 5, title: "Review", icon: CheckCircle2 },
];

export function CreateOrderForm() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Data State
  const [smeProfile, setSmeProfile] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [partners, setPartners] = useState<{ logistics: any[], riders: any[] }>({ logistics: [], riders: [] });
  const [loadingData, setLoadingData] = useState(true);

  const [useMyAddress, setUseMyAddress] = useState(false);
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("none");
  const [partnerType, setPartnerType] = useState<'any' | 'logistics' | 'rider'>('any');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    pickup_address: "",
    pickup_contact_name: "",
    pickup_contact_phone: "",
    delivery_address: "",
    delivery_contact_name: "",
    delivery_contact_phone: "",
    package_description: "",
    package_size: "small" as PackageSize,
    delivery_fee: 0,
    estimated_duration_mins: 0,
    distance_km: 0,
    business_id: "",
    rider_id: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: sme, error: smeError } = await supabase
            .from('sme_profiles')
            .select(`
              business_name,
              business_address, 
              city, 
              state, 
              profiles!id (
                full_name, 
                phone_number
              )
            `)
            .eq('id', user.id)
            .single();
          
          if (sme) setSmeProfile(sme);

          const resCust = await fetch('/api/customers');
          if (resCust.ok) setCustomers(await resCust.json());

          const resPart = await fetch('/api/partners');
          if (resPart.ok) setPartners(await resPart.json());
        }
      } catch (e) {
        console.error("Error fetching data", e);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  // Handle "Use my address" toggle
  useEffect(() => {
    if (useMyAddress) {
      if (!smeProfile) return;

      const addressParts = [
          smeProfile.business_address,
          smeProfile.city,
          smeProfile.state
      ].filter(part => part && part.trim().length > 0);

      const fullAddress = addressParts.join(", ");

      const profileData = Array.isArray(smeProfile.profiles) 
          ? smeProfile.profiles[0] 
          : smeProfile.profiles;
      
      const contactName = profileData?.full_name || smeProfile.business_name || "";
      const contactPhone = profileData?.phone_number || "";

      if (!fullAddress) {
         setError("Your business profile has no address saved. Please uncheck and enter manually.");
         setUseMyAddress(false);
         return;
      }
      
      setError(null); 
      
      setFormData(prev => ({
          ...prev,
          pickup_address: fullAddress,
          pickup_contact_name: contactName,
          pickup_contact_phone: contactPhone
      }));
    }
  }, [useMyAddress, smeProfile]);

  // Handle Customer Selection
  useEffect(() => {
    if (isExistingCustomer && selectedCustomerId !== "none") {
      const cust = customers.find(c => c.id === selectedCustomerId);
      if (cust) {
        setFormData(prev => ({
          ...prev,
          delivery_contact_name: cust.full_name || "",
          delivery_contact_phone: cust.phone_number || ""
        }));
      }
    }
  }, [isExistingCustomer, selectedCustomerId, customers]);

  // Handle Redirect after Success
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push('/dashboard/sme/orders');
        router.refresh();
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer);
    }
  }, [showSuccess, router]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
      if (step === 1 && !formData.pickup_address) {
          setError("Pickup address is required.");
          return;
      }
      if (step === 2 && !formData.delivery_address) {
          setError("Delivery address is required.");
          return;
      }
      setError(null);
      setStep(s => Math.min(s + 1, 5));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      business_id: partnerType === 'logistics' ? selectedPartnerId : null,
      rider_id: partnerType === 'rider' ? selectedPartnerId : null
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create order");
      }

      // Success!
      setShowSuccess(true);
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false); // Only re-enable if error
    }
  }

  const estimatedFee = formData.package_size === 'large' ? 2500 : formData.package_size === 'medium' ? 1500 : 800;

  if (loadingData) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl h-full min-h-[400px]"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="flex flex-col items-center text-center p-8 bg-card border shadow-lg rounded-xl max-w-sm"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Created!</h2>
              <p className="text-muted-foreground mb-4">Your delivery request has been submitted successfully.</p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to orders...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300" 
               style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
          
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = s.id <= step;
            return (
              <div key={s.id} className="flex flex-col items-center bg-background px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className={showSuccess ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader>
          <CardTitle>{STEPS[step-1].title} Details</CardTitle>
          <CardDescription>
            {step === 5 ? "Review and confirm your delivery details." : 
             step === 4 ? "Select your preferred delivery partner." :
             `Step ${step} of 5: Fill in ${STEPS[step-1].title.toLowerCase()} information.`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 mb-4 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          {/* Step 1: Pickup */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20 mb-4">
                <Switch 
                  id="use-my-address" 
                  checked={useMyAddress}
                  onCheckedChange={setUseMyAddress}
                />
                <Label htmlFor="use-my-address" className="cursor-pointer">Use my business address & contact</Label>
              </div>

              <div className="grid gap-2">
                <Label>Pickup Address</Label>
                <Input 
                  placeholder="e.g. 123 Lagos Street, Ikeja" 
                  value={formData.pickup_address || ""}
                  onChange={(e) => handleChange('pickup_address', e.target.value)}
                  disabled={useMyAddress}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Contact Name</Label>
                  <Input 
                    placeholder="Sender Name" 
                    value={formData.pickup_contact_name || ""}
                    onChange={(e) => handleChange('pickup_contact_name', e.target.value)}
                    disabled={useMyAddress}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Contact Phone</Label>
                  <Input 
                    placeholder="08012345678" 
                    value={formData.pickup_contact_phone || ""}
                    onChange={(e) => handleChange('pickup_contact_phone', e.target.value)}
                    disabled={useMyAddress}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Delivery */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20 mb-4">
                <Switch 
                  id="is-existing-customer" 
                  checked={isExistingCustomer}
                  onCheckedChange={setIsExistingCustomer}
                />
                <Label htmlFor="is-existing-customer" className="cursor-pointer">Select from existing customers</Label>
              </div>

              {isExistingCustomer ? (
                <div className="grid gap-2 animate-in zoom-in-95 duration-200">
                  <Label>Select Customer</Label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                  >
                    <option value="none">-- Select a customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.full_name} ({c.phone_number})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Recipient Name</Label>
                      <Input 
                        placeholder="Receiver Name" 
                        value={formData.delivery_contact_name || ""}
                        onChange={(e) => handleChange('delivery_contact_name', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Recipient Phone</Label>
                      <Input 
                        placeholder="08087654321" 
                        value={formData.delivery_contact_phone || ""}
                        onChange={(e) => handleChange('delivery_contact_phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label>Delivery Address</Label>
                <Input 
                  placeholder="e.g. 456 Victoria Island Way" 
                  value={formData.delivery_address || ""}
                  onChange={(e) => handleChange('delivery_address', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Package */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid gap-2">
                <Label>Package Description</Label>
                <Input 
                  placeholder="e.g. Box of Electronics, Documents" 
                  value={formData.package_description || ""}
                  onChange={(e) => handleChange('package_description', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Package Size</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.package_size} 
                  onChange={(e) => handleChange('package_size', e.target.value)}
                >
                  <option value="small">Small (Fits in backpack)</option>
                  <option value="medium">Medium (Fits on bike seat)</option>
                  <option value="large">Large (Needs cargo box)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Partner Selection */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${partnerType === 'any' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => { setPartnerType('any'); setSelectedPartnerId(null); }}
                >
                  Broadcast (Any)
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${partnerType === 'logistics' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => { setPartnerType('logistics'); setSelectedPartnerId(null); }}
                >
                  Logistics Company
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${partnerType === 'rider' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => { setPartnerType('rider'); setSelectedPartnerId(null); }}
                >
                  Individual Rider
                </button>
              </div>

              <div className="min-h-[200px] border rounded-md p-4">
                {partnerType === 'any' && (
                  <div className="text-center text-muted-foreground py-8">
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Your order will be broadcast to all nearby partners.</p>
                  </div>
                )}

                {partnerType === 'logistics' && (
                  <div className="space-y-2">
                    {partners.logistics.length === 0 ? <p className="text-center text-muted-foreground">No verified logistics companies found.</p> :
                      partners.logistics.map(p => (
                        <div 
                          key={p.id} 
                          className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-accent ${selectedPartnerId === p.id ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setSelectedPartnerId(p.id)}
                        >
                          <div>
                            <div className="font-medium">{p.company_name}</div>
                            <div className="text-xs text-muted-foreground">{p.city}, {p.state}</div>
                          </div>
                          {selectedPartnerId === p.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>
                      ))
                    }
                  </div>
                )}

                {partnerType === 'rider' && (
                  <div className="space-y-2">
                    {partners.riders.length === 0 ? <p className="text-center text-muted-foreground">No verified independent riders found.</p> :
                      partners.riders.map(r => (
                        <div 
                          key={r.id} 
                          className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-accent ${selectedPartnerId === r.id ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setSelectedPartnerId(r.id)}
                        >
                          <div>
                            <div className="font-medium">{r.name}</div>
                            <div className="text-xs text-muted-foreground">{r.vehicle}</div>
                          </div>
                          {selectedPartnerId === r.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">Pickup:</span>
                  <span>{formData.pickup_address || "Not specified"}</span>
                  
                  <span className="font-medium text-muted-foreground">Contact:</span>
                  <span>{formData.pickup_contact_name || "N/A"} ({formData.pickup_contact_phone || "N/A"})</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">Delivery:</span>
                  <span>{formData.delivery_address || "Not specified"}</span>
                  
                  <span className="font-medium text-muted-foreground">Contact:</span>
                  <span>{formData.delivery_contact_name || "N/A"} ({formData.delivery_contact_phone || "N/A"})</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">Package:</span>
                  <span>{formData.package_size.toUpperCase()} - {formData.package_description || "No description"}</span>
                  
                  <span className="font-medium text-muted-foreground">Assignment:</span>
                  <span>
                    {partnerType === 'any' ? "Broadcast to All" : 
                     partnerType === 'logistics' ? `Logistics: ${partners.logistics.find(l => l.id === selectedPartnerId)?.company_name || 'Selected'}` :
                     `Rider: ${partners.riders.find(r => r.id === selectedPartnerId)?.name || 'Selected'}`
                    }
                  </span>

                  <span className="font-medium text-muted-foreground">Est. Fee:</span>
                  <span className="font-bold text-primary">₦{estimatedFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 1 || submitting || showSuccess}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {step < 5 ? (
            <Button onClick={nextStep} disabled={step === 4 && partnerType !== 'any' && !selectedPartnerId}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting || showSuccess} className="min-w-[120px]">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Order"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}