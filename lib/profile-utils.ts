export function calculateProfileCompletion(role: string, profile: any, roleData: any): number {
  let score = 0;
  let totalFields = 0;

  // Base Profile Fields (Common) - Weight: 40%
  const baseFields = ['full_name', 'phone_number'];
  totalFields += baseFields.length;
  baseFields.forEach(field => {
    if (profile?.[field] && profile[field].trim().length > 0) score++;
  });

  // Role Specific Fields - Weight: 60%
  if (role === 'sme') {
    const smeFields = ['business_name', 'business_address', 'industry_type'];
    totalFields += smeFields.length;
    smeFields.forEach(field => {
      if (roleData?.[field] && roleData[field].trim().length > 0) score++;
    });
  } else if (role === 'logistics') {
    const logFields = ['company_name', 'registration_number'];
    totalFields += logFields.length;
    logFields.forEach(field => {
      if (roleData?.[field] && roleData[field].trim().length > 0) score++;
    });
    // Fleet size > 0 adds to score, but we'll treat basic text fields as the core 100% for now
  } else if (role === 'rider') {
    const riderFields = ['vehicle_type', 'license_plate'];
    totalFields += riderFields.length;
    riderFields.forEach(field => {
      if (roleData?.[field] && roleData[field].trim().length > 0) score++;
    });
  }

  return Math.round((score / totalFields) * 100);
}
