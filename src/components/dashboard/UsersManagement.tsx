
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  async function fetchUsers() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
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
      
      toast.success(`User admin status updated`);
    } catch (error: any) {
      toast.error('Error updating user', {
        description: error.message
      });
      console.error('Error updating user:', error);
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="border-b px-4 py-3 flex items-center font-medium">
            <div className="flex-1">User ID</div>
            <div className="flex-1">Name</div>
            <div className="w-32 text-center">Admin Status</div>
            <div className="w-32 text-center">Actions</div>
          </div>
          
          {users.map((user) => (
            <div key={user.id} className="border-b px-4 py-3 flex items-center">
              <div className="flex-1 truncate">{user.id}</div>
              <div className="flex-1">{user.first_name} {user.last_name}</div>
              <div className="w-32 text-center">
                {user.is_admin ? (
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Admin</span>
                ) : (
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">User</span>
                )}
              </div>
              <div className="w-32 flex justify-center">
                <Button 
                  size="sm" 
                  variant={user.is_admin ? "destructive" : "outline"}
                  onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                >
                  {user.is_admin ? "Remove Admin" : "Make Admin"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
