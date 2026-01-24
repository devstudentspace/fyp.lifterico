import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error: "Missing configuration",
        message: "SUPABASE_SERVICE_ROLE_KEY is required in .env.local",
      },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ... (User creation logic remains the same, I will append more orders at the end) ...
  // Re-declaring users array for context if needed, but I'll focus on the order logic update.
  // Ideally, I should keep the full file content to avoid breaking the previous logic.
  
  // --- 1. Define Expanded Kano-Localized Test Data ---
  const users = [
    // Admin
    { email: "admin@lifterico.com", password: "password", role: "admin", name: "System Admin" },

    // Logistics Companies
    { email: "logistics@kanoexpress.com", password: "password", role: "logistics", name: "Al-Amin", company: "Kano Express Logistics", address: "No. 55 Zoo Road, Kano", city: "Kano", state: "Kano", reg_no: "RC-KNO-1122", fleet: 15 },
    { email: "ops@arewadelivery.com", password: "password", role: "logistics", name: "Yakubu", company: "Arewa Last Mile", address: "Plot 12, Zaria Road, Gyadi-Gyadi", city: "Kano", state: "Kano", reg_no: "RC-ARE-9988", fleet: 8 },
    { email: "info@nasarawalogistics.com", password: "password", role: "logistics", name: "Sani Abacha", company: "Nasarawa Rapid Drop", address: "No. 5 Audu Bako Way, Nasarawa GRA", city: "Kano", state: "Kano", reg_no: "RC-NAS-7766", fleet: 5 },

    // SMEs
    { email: "sales@sahadkitchen.com", password: "password", role: "sme", name: "Hajiya Fatima", business: "Fati's Kitchen", address: "Shop 4, Ado Bayero Mall", city: "Kano", state: "Kano", industry: "Food & Beverage" },
    { email: "info@kwari.textiles.com", password: "password", role: "sme", name: "Alhaji Musa", business: "Kwari Textile Hub", address: "Kwari Market, Kano Municipal", city: "Kano", state: "Kano", industry: "Textiles" },
    { email: "shop@kantinkwari.com", password: "password", role: "sme", name: "Bashir Dandago", business: "Dandago Electronics", address: "Beirut Road, Kano", city: "Kano", state: "Kano", industry: "Electronics" },
    { email: "orders@sabongari.pharmacy.com", password: "password", role: "sme", name: "Dr. Chioma", business: "City Care Pharmacy", address: "France Road, Sabon Gari", city: "Kano", state: "Kano", industry: "Healthcare" },

    // Riders
    { email: "rider1@gmail.com", password: "password", role: "rider", name: "Ibrahim Sani", vehicle: "Motorcycle", plate: "KNO-123-AA", phone: "08031234567" },
    { email: "rider2@gmail.com", password: "password", role: "rider", name: "Emeka Okonkwo", vehicle: "Van", plate: "ABJ-456-XY", phone: "08099887766" },
    { email: "rider3@gmail.com", password: "password", role: "rider", name: "Usman Bello", vehicle: "Bicycle", plate: "N/A", phone: "07055443322" },
    { email: "rider4@gmail.com", password: "password", role: "rider", name: "Aliyu Yusuf", vehicle: "Motorcycle", plate: "KNO-889-BB", phone: "08122334455" },
    { email: "rider5@gmail.com", password: "password", role: "rider", name: "John Danjuma", vehicle: "Motorcycle", plate: "KNO-777-CC", phone: "09011223344" },
    { email: "rider6@gmail.com", password: "password", role: "rider", name: "Mustapha Gombe", vehicle: "Van", plate: "BAU-555-DD", phone: "07088990011" },

    // Customers
    { email: "cust1@gmail.com", password: "password", role: "customer", name: "Zainab Abba", phone: "08123456789" },
    { email: "cust2@gmail.com", password: "password", role: "customer", name: "Kabiru Gaya", phone: "09087654321" },
    { email: "cust3@gmail.com", password: "password", role: "customer", name: "Aisha Mohammed", phone: "08055667788" },
    { email: "cust4@gmail.com", password: "password", role: "customer", name: "Chinedu Eze", phone: "07033445566" },
  ];

  const results = [];

  // --- 2. Create Users & Update Profiles ---
  for (const u of users) {
    let userId = null;
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list?.users.find(x => x.email === u.email);

    if (existing) {
      userId = existing.id;
    } else {
      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { role: u.role, full_name: u.name }
      });
      if (error) {
        results.push(`Error creating ${u.email}: ${error.message}`);
        continue;
      }
      userId = newUser.user.id;
      results.push(`Created user ${u.email}.`);
    }

    if (u.phone) await supabase.from('profiles').update({ phone_number: u.phone }).eq('id', userId);

    if (u.role === 'sme') {
      await supabase.from('sme_profiles').update({
        business_name: u.business,
        business_address: u.address,
        city: u.city,
        state: u.state,
        industry_type: u.industry,
        verification_status: 'verified'
      }).eq('id', userId);
    } else if (u.role === 'logistics') {
      await supabase.from('logistics_profiles').update({
        company_name: u.company,
        address: u.address,
        city: u.city,
        state: u.state,
        registration_number: u.reg_no,
        fleet_size: u.fleet,
        verification_status: 'verified'
      }).eq('id', userId);
    } else if (u.role === 'rider') {
      await supabase.from('rider_profiles').update({
        vehicle_type: u.vehicle,
        license_plate: u.plate,
        verification_status: 'verified',
        current_status: 'online'
      }).eq('id', userId);
    }
  }

  // --- 3. Link Riders to Logistics ---
  const { data: log1 } = await supabase.from('logistics_profiles').select('id').eq('company_name', 'Kano Express Logistics').single();
  const { data: log2 } = await supabase.from('logistics_profiles').select('id').eq('company_name', 'Arewa Last Mile').single();
  
  if (log1) {
    const ridersToLink = ['rider1@gmail.com', 'rider4@gmail.com'];
    for (const email of ridersToLink) {
        const { data: u } = await supabase.from('profiles').select('id').eq('id', (await supabase.auth.admin.listUsers()).data.users.find(x => x.email === email)?.id).single();
        if (u) await supabase.from('rider_profiles').update({ logistics_id: log1.id }).eq('id', u.id);
    }
  }
  if (log2) {
    const { data: u } = await supabase.from('profiles').select('id').eq('id', (await supabase.auth.admin.listUsers()).data.users.find(x => x.email === 'rider2@gmail.com')?.id).single();
    if (u) await supabase.from('rider_profiles').update({ logistics_id: log2.id }).eq('id', u.id);
  }

  // --- 4. Create EXPANDED Sample Orders ---
  const { data: sme1 } = await supabase.from('sme_profiles').select('id').eq('business_name', "Fati's Kitchen").single();
  const { data: sme2 } = await supabase.from('sme_profiles').select('id').eq('business_name', "Kwari Textile Hub").single();
  const { data: sme3 } = await supabase.from('sme_profiles').select('id').eq('business_name', "City Care Pharmacy").single();
  const { data: sme4 } = await supabase.from('sme_profiles').select('id').eq('business_name', "Dandago Electronics").single();

  // Helper to get Rider ID
  const getRiderId = async (email: string) => {
      const u = (await supabase.auth.admin.listUsers()).data.users.find(x => x.email === email);
      return u ? u.id : null;
  };
  const rider1Id = await getRiderId('rider1@gmail.com');
  const rider2Id = await getRiderId('rider2@gmail.com');

  const orders = [];

  if (sme1 && log1) {
    orders.push(
        { sme_id: sme1.id, business_id: log1.id, rider_id: rider1Id, status: 'in_transit', pickup_address: "Shop 4, Ado Bayero Mall", pickup_contact_name: "Hajiya Fatima", pickup_contact_phone: "08011122233", delivery_address: "No. 10 BUK Road", delivery_contact_name: "Student Rep", delivery_contact_phone: "09022233344", package_description: "5 Packs of Jollof Rice", package_size: "medium", delivery_fee: 1500 },
        { sme_id: sme1.id, status: 'pending', pickup_address: "Shop 4, Ado Bayero Mall", pickup_contact_name: "Hajiya Fatima", pickup_contact_phone: "08011122233", delivery_address: "Tarauni Market", delivery_contact_name: "Mrs. Johnson", delivery_contact_phone: "07088899900", package_description: "Catering Tray", package_size: "large", delivery_fee: 2500 },
        { sme_id: sme1.id, status: 'delivered', pickup_address: "Shop 4, Ado Bayero Mall", pickup_contact_name: "Hajiya Fatima", pickup_contact_phone: "08011122233", delivery_address: "Hotoro GRA", delivery_contact_name: "Alhaji Bello", delivery_contact_phone: "08099900011", package_description: "Special Dinner Set", package_size: "large", delivery_fee: 3000 }
    );
  }

  if (sme2) {
    orders.push(
        { sme_id: sme2.id, status: 'pending', pickup_address: "Kwari Market", pickup_contact_name: "Alhaji Musa", pickup_contact_phone: "08099988877", delivery_address: "Singer Market", delivery_contact_name: "Bello Trader", delivery_contact_phone: "07011223344", package_description: "Bale of Lace Materials", package_size: "large", delivery_fee: 1200 },
        { sme_id: sme2.id, status: 'cancelled', pickup_address: "Kwari Market", pickup_contact_name: "Alhaji Musa", pickup_contact_phone: "08099988877", delivery_address: "Sabon Gari Market", delivery_contact_name: "Chukwudi", delivery_contact_phone: "08033344455", package_description: "Sample Fabrics", package_size: "small", delivery_fee: 500 }
    );
  }

  if (sme3 && log2) {
    orders.push(
        { sme_id: sme3.id, business_id: log2.id, status: 'accepted', pickup_address: "France Road, Sabon Gari", pickup_contact_name: "Dr. Chioma", pickup_contact_phone: "08055566677", delivery_address: "No. 22 Airport Road", delivery_contact_name: "Patient X", delivery_contact_phone: "09099887766", package_description: "Prescription Meds", package_size: "small", delivery_fee: 800 },
        { sme_id: sme3.id, business_id: log2.id, rider_id: rider2Id, status: 'delivered', pickup_address: "France Road, Sabon Gari", pickup_contact_name: "Dr. Chioma", pickup_contact_phone: "08055566677", delivery_address: "Brigade Quarters", delivery_contact_name: "Mama Yusuf", delivery_contact_phone: "07011122233", package_description: "Vitamins Box", package_size: "medium", delivery_fee: 1000 }
    );
  }

  if (sme4) {
      orders.push(
          { sme_id: sme4.id, status: 'pending', pickup_address: "Beirut Road", pickup_contact_name: "Bashir", pickup_contact_phone: "08022233344", delivery_address: "Farm Centre", delivery_contact_name: "Gadget Shop", delivery_contact_phone: "08199988877", package_description: "Laptop Delivery", package_size: "medium", delivery_fee: 2000 }
      );
  }

  // Insert Orders safely
  for (const order of orders) {
      // Check for duplicate based on details to avoid spamming on re-seed
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true })
        .eq('sme_id', order.sme_id)
        .eq('delivery_address', order.delivery_address)
        .eq('package_description', order.package_description);
      
      if (count === 0) {
          await supabase.from('orders').insert(order);
          results.push(`Created order for ${order.package_description}`);
      }
  }

  return NextResponse.json({
    message: "Seed completed with expanded Kano-localized data & Orders.",
    details: results
  });
}