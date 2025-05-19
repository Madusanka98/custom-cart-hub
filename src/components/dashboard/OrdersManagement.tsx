
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  async function fetchOrders() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error: any) {
      toast.error('Error loading orders', {
        description: error.message
      });
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error('Error updating order', {
        description: error.message
      });
      console.error('Error updating order:', error);
    }
  }
  
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="border-b px-4 py-3 flex items-center font-medium">
            <div className="w-1/4">Order ID</div>
            <div className="w-1/4">Customer</div>
            <div className="w-1/6 text-right">Total</div>
            <div className="w-1/6 text-center">Status</div>
            <div className="w-1/6 text-right">Action</div>
          </div>
          
          {orders.map((order) => (
            <div key={order.id} className="border-b px-4 py-3 flex items-center">
              <div className="w-1/4 truncate">{order.id}</div>
              <div className="w-1/4">
                {order.profiles?.first_name} {order.profiles?.last_name}
              </div>
              <div className="w-1/6 text-right">
                ${Number(order.total).toFixed(2)}
              </div>
              <div className="w-1/6 text-center">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="w-1/6 text-right">
                <select
                  className="text-sm border rounded px-2 py-1"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
