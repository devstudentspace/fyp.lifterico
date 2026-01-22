"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit, Trash2, Eye, Search, Filter, CheckCircle, Ban, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDetailsModal } from "./user-details-modal";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  details?: any; // Extra details specific to the user type
}

interface UserTableProps {
  users: UserData[];
  onView?: (user: UserData) => void;
  onEdit?: (user: UserData) => void;
  onDelete?: (user: UserData) => void;
  onApprove?: (user: UserData) => void;
  onSuspend?: (user: UserData) => void;
  onActivate?: (user: UserData) => void;
  onDesuspend?: (user: UserData) => void;
}

export function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onSuspend,
  onActivate,
  onDesuspend
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, string | null>>({});

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (user: UserData) => {
    setSelectedUser(user);
    setDetailsOpen(true);
    if (onView) onView(user);
  };

  const handleApprove = async (user: UserData) => {
    setLoadingStates(prev => ({ ...prev, [user.id]: 'approve' }));
    try {
      const response = await fetch('/api/admin/users/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role, action: 'approve' })
      });

      if (response.ok) {
        if (onApprove) onApprove(user);
      } else {
        let errorMessage = 'Failed to approve user';
        try {
          const error = await response.json();
          console.error('Error approving user:', error);
          errorMessage = error.error || errorMessage;
        } catch (e) {
          console.error('Error parsing response for approving user:', e);
          // Use the default error message if JSON parsing fails
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [user.id]: null }));
    }
  };

  const handleSuspend = async (user: UserData) => {
    setLoadingStates(prev => ({ ...prev, [user.id]: 'suspend' }));
    try {
      const response = await fetch('/api/admin/users/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role, action: 'suspend' })
      });

      if (response.ok) {
        if (onSuspend) onSuspend(user);
      } else {
        let errorMessage = 'Failed to suspend user';
        try {
          const error = await response.json();
          console.error('Error suspending user:', error);
          errorMessage = error.error || errorMessage;
        } catch (e) {
          console.error('Error parsing response for suspending user:', e);
          // Use the default error message if JSON parsing fails
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error suspending user:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [user.id]: null }));
    }
  };

  const handleActivate = async (user: UserData) => {
    setLoadingStates(prev => ({ ...prev, [user.id]: 'activate' }));
    try {
      const response = await fetch('/api/admin/users/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role, action: 'activate' })
      });

      if (response.ok) {
        if (onActivate) onActivate(user);
      } else {
        let errorMessage = 'Failed to activate user';
        try {
          const error = await response.json();
          console.error('Error activating user:', error);
          errorMessage = error.error || errorMessage;
        } catch (e) {
          console.error('Error parsing response for activating user:', e);
          // Use the default error message if JSON parsing fails
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error activating user:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [user.id]: null }));
    }
  };

  const handleDesuspend = async (user: UserData) => {
    setLoadingStates(prev => ({ ...prev, [user.id]: 'desuspend' }));
    try {
      const response = await fetch('/api/admin/users/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role, action: 'desuspend' })
      });

      if (response.ok) {
        if (onDesuspend) onDesuspend(user);
      } else {
        let errorMessage = 'Failed to desuspend user';
        try {
          const error = await response.json();
          console.error('Error desuspending user:', error);
          errorMessage = error.error || errorMessage;
        } catch (e) {
          console.error('Error parsing response for desuspending user:', e);
          // Use the default error message if JSON parsing fails
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error desuspending user:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [user.id]: null }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-card p-1 rounded-lg">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="hidden md:table-cell font-semibold">Joined</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-20" />
                    <p>No users found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize font-normal">
                        {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'verified' || user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="capitalize text-sm">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {(user.status === 'pending' || user.status === 'unverified') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleApprove(user)}
                          disabled={loadingStates[user.id] === 'approve'}
                        >
                          {loadingStates[user.id] === 'approve' ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </>
                          )}
                        </Button>
                      )}

                      {user.status === 'verified' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleSuspend(user)}
                          disabled={loadingStates[user.id] === 'suspend'}
                        >
                          {loadingStates[user.id] === 'suspend' ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <>
                              <Ban className="h-4 w-4 mr-1" /> Suspend
                            </>
                          )}
                        </Button>
                      )}

                      {user.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleActivate(user)}
                          disabled={loadingStates[user.id] === 'activate'}
                        >
                          {loadingStates[user.id] === 'activate' ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <>
                              <RotateCcw className="h-4 w-4 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleView(user)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDetailsModal
        user={selectedUser}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}