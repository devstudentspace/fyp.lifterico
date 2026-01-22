"use client";

import { useState, useEffect } from "react";
import { UserTable } from "@/components/admin/user-table";

interface UserTableWrapperProps {
  initialUsers: any[];
  userType: 'riders' | 'smes' | 'logistics' | 'customers';
}

export function UserTableWrapper({ initialUsers, userType }: UserTableWrapperProps) {
  const [users, setUsers] = useState(initialUsers);

  const handleApprove = (user: any) => {
    // Update the local state to reflect the status change
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id ? { ...u, status: 'verified' } : u
      )
    );
  };

  const handleSuspend = (user: any) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id ? { ...u, status: 'suspended' } : u
      )
    );
  };

  const handleActivate = (user: any) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id ? { ...u, status: 'active' } : u
      )
    );
  };

  return (
    <UserTable 
      users={users} 
      onApprove={handleApprove}
      onSuspend={handleSuspend}
      onActivate={handleActivate}
    />
  );
}