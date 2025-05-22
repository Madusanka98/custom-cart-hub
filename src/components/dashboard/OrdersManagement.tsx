
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Eye, Loader2 } from 'lucide-react';
import { Rating } from '@/components/ui/rating';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
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
      setIsUpdating(true);
      
      // Create a new Date object when status is changed to delivered
      const updates: any = { status: newStatus };
      if (newStatus === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);
        
      if (error) throw error;
      
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          return { 
            ...order, 
            status: newStatus,
            delivered_at: newStatus === 'delivered' ? new Date().toISOString() : order.delivered_at
          };
        }
        return order;
      }));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error('Error updating order', {
        description: error.message
      });
      console.error('Error updating order:', error);
    } finally {
      setIsUpdating(false);
    }
  }
  
  async function viewOrderDetails(order: any) {
    try {
      setSelectedOrder(order);
      setIsDetailsModalOpen(true);
      
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id (
            id,
            title,
            images
          ),
          reviews:order_item_id (
            id,
            rating,
            comment,
            created_at
          )
        `)
        .eq('order_id', order.id);
        
      if (error) throw error;
      
      setOrderItems(data || []);
    } catch (error: any) {
      toast.error('Error loading order details', {
        description: error.message
      });
      console.error('Error loading order details:', error);
    }
  }
  
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
      'processing': 'bg-blue-100 text-blue-700',
      'shipped': 'bg-purple-100 text-purple-700',
      'pending': 'bg-amber-100 text-amber-700'
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs ${statusClasses[status as keyof typeof statusClasses] || 'bg-amber-100 text-amber-700'}`}>
        {status}
      </span>
    );
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <span className="truncate block max-w-[120px]">{order.id}</span>
                  </TableCell>
                  <TableCell>
                    {order.profiles?.first_name} {order.profiles?.last_name}
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(order.total).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <div className="text-sm space-y-2">
                  <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                  <p><span className="font-medium">Status:</span> {getStatusBadge(selectedOrder.status)}</p>
                  <p><span className="font-medium">Created:</span> {formatDate(selectedOrder.created_at)}</p>
                  {selectedOrder.delivered_at && (
                    <p><span className="font-medium">Delivered:</span> {formatDate(selectedOrder.delivered_at)}</p>
                  )}
                  <p><span className="font-medium">Total:</span> ${Number(selectedOrder.total).toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="text-sm space-y-2">
                  {selectedOrder.shipping_address && (
                    <>
                      <p><span className="font-medium">Name:</span> {selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                      <p><span className="font-medium">Address:</span> {selectedOrder.shipping_address.address}</p>
                      <p><span className="font-medium">City:</span> {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}</p>
                      <p><span className="font-medium">Country:</span> {selectedOrder.shipping_address.country}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.shipping_address.phone}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.shipping_address.email}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="my-4">
              <h3 className="font-semibold mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                            <img 
                              src={item.products?.images[0] || '/placeholder.svg'} 
                              alt={item.products?.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>{item.products?.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${Number(item.price_at_purchase).toFixed(2)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="my-4">
              <h3 className="font-semibold mb-2">Customer Reviews</h3>
              {orderItems.some(item => item.reviews && item.reviews.length > 0) ? (
                <div className="space-y-4">
                  {orderItems.map((item) => {
                    if (!item.reviews || item.reviews.length === 0) return null;
                    
                    return item.reviews.map((review: any) => (
                      <div key={review.id} className="border rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.products?.title}</p>
                            <div className="mt-1">
                              <Rating value={review.rating} />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                        {review.comment && (
                          <p className="mt-2 text-sm">{review.comment}</p>
                        )}
                      </div>
                    ));
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews submitted yet.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
