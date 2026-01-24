export type UserRole = 'admin' | 'logistics' | 'sme' | 'rider' | 'customer';

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'assigned' 
  | 'picked_up' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled' 
  | 'failed';

export type PackageSize = 'small' | 'medium' | 'large';

export interface Order {
  id: string;
  order_number: string;
  sme_id: string;
  business_id?: string | null;
  rider_id?: string | null;
  status: OrderStatus;
  
  pickup_address: string;
  pickup_lat?: number;
  pickup_lng?: number;
  pickup_contact_name: string;
  pickup_contact_phone: string;
  
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_contact_name: string;
  delivery_contact_phone: string;
  
  package_description?: string;
  package_size: PackageSize;
  
  delivery_fee?: number;
  distance_km?: number;
  estimated_duration_mins?: number;
  
  created_at: string;
  updated_at: string;
  rider?: {
    vehicle_type?: string;
    license_plate?: string;
    profiles?: {
      full_name?: string;
      phone_number?: string;
    };
  };
}

export interface SmeProfile {
  id: string;
  business_name: string;
  business_address: string;
  industry_type: string;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  city?: string;
  state?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface LogisticsProfile {
  id: string;
  company_name: string;
  registration_number: string;
  fleet_size: number;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  payout_info?: any;
  address?: string;
  city?: string;
  state?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface Rider {
  id: string;
  name?: string;
  vehicle_type?: string;
  license_plate?: string;
  license_number?: string;
  current_status?: 'offline' | 'online' | 'busy';
  logistics_id?: string | null;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    phone_number?: string;
  }[];
}
