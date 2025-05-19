
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Loader2, Search, X } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(user => 
        user.first_name?.toLowerCase().includes(lowerCaseQuery) || 
        user.last_name?.toLowerCase().includes(lowerCaseQuery) ||
        user.id.toLowerCase().includes(lowerCaseQuery)
      ));
    }
  }, [searchQuery, users]);
  
  async function fetchUsers() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error: any) {
      toast.error('Error loading users', {
        description: error.message
      });
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function toggleAdminStatus(userId: string, isCurrentlyAdmin: boolean) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isCurrentlyAdmin })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !isCurrentlyAdmin } : user
      ));
      
      toast.success(`User admin status updated`, {
        description: isCurrentlyAdmin ? 'Admin privileges removed' : 'Admin privileges granted'
      });
    } catch (error: any) {
      toast.error('Error updating user', {
        description: error.message
      });
      console.error('Error updating user:', error);
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableCaption>List of all registered users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Admin Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs truncate max-w-[120px]">
                    {user.id}
                  </TableCell>
                  <TableCell>
                    {user.first_name || user.last_name 
                      ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
                      : 'No name provided'}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.is_admin ? (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        User
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant={user.is_admin ? "destructive" : "outline"}
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    >
                      {user.is_admin ? "Remove Admin" : "Make Admin"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
