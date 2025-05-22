
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  useEffect(() => {
    if (!user) {
      toast("Authentication required", {
        description: "Please login to view your orders"
      });
      navigate('/login', { state: { redirectTo: '/my-orders' } });
      return;
    }
    
    fetchOrders();
  }, [user, navigate]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: orderItems, error: itemsError } = await supabase
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
                comment
              )
            `)
            .eq('order_id', order.id);
            
          if (itemsError) throw itemsError;
          
          return {
            ...order,
            items: orderItems || []
          };
        })
      );
      
      setOrders(ordersWithItems);
    } catch (error: any) {
      toast("Error loading orders", {
        description: error.message
      });
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };
  
  const openOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrderItems(order.items);
    }
  };
  
  const openReviewModal = (item: any) => {
    const hasReview = item.reviews && item.reviews.length > 0;
    setCurrentItem(item);
    
    if (hasReview) {
      const review = item.reviews[0];
      setReviewRating(review.rating);
      setReviewComment(review.comment || '');
    } else {
      setReviewRating(5);
      setReviewComment('');
    }
    
    setIsReviewModalOpen(true);
  };
  
  const handleSubmitReview = async () => {
    if (!currentItem || !user) return;
    
    try {
      setIsSubmittingReview(true);
      
      const hasReview = currentItem.reviews && currentItem.reviews.length > 0;
      
      if (hasReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating: reviewRating,
            comment: reviewComment,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentItem.reviews[0].id);
          
        if (error) throw error;
        
        toast("Review updated", {
          description: "Your review has been updated successfully"
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            product_id: currentItem.product_id,
            order_item_id: currentItem.id,
            rating: reviewRating,
            comment: reviewComment
          });
          
        if (error) throw error;
        
        toast("Review submitted", {
          description: "Your review has been submitted successfully"
        });
      }
      
      // Refresh orders data
      fetchOrders();
      setIsReviewModalOpen(false);
    } catch (error: any) {
      toast("Error submitting review", {
        description: error.message
      });
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  const canReviewItem = (order: any, item: any) => {
    const isDelivered = order.status === 'delivered';
    const hasReview = item.reviews && item.reviews.length > 0;
    
    return isDelivered;
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground mt-2">
              Looks like you haven't made any orders yet.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div className="bg-muted/40 p-4 flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Order ID</span>
                        <p className="font-medium">{order.id}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Date</span>
                        <p className="font-medium">{formatOrderDate(order.created_at)}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Total</span>
                        <p className="font-medium">${Number(order.total).toFixed(2)}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Status</span>
                        <p>
                          <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => openOrderDetails(order.id)}
                    className="mt-4 md:mt-0"
                  >
                    View Details
                  </Button>
                </div>
                
                {selectedOrderItems.length > 0 && selectedOrderItems[0].order_id === order.id && (
                  <div className="p-4 border-t">
                    <h3 className="font-medium mb-4">Order Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                                  <img 
                                    src={item.products?.images[0] || '/placeholder.svg'} 
                                    alt={item.products?.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{item.products?.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              ${Number(item.price_at_purchase).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {canReviewItem(order, item) && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openReviewModal(item)}
                                >
                                  {item.reviews && item.reviews.length > 0 ? 'Edit Review' : 'Add Review'}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Review Dialog */}
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentItem?.reviews && currentItem?.reviews.length > 0 
                  ? 'Edit Your Review' 
                  : 'Write a Review'}
              </DialogTitle>
              <DialogDescription>
                Share your experience with this product
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rating" className="text-sm font-medium">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewRating(value)}
                      className="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          reviewRating >= value 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="comment" className="text-sm font-medium">Comment</label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsReviewModalOpen(false)}
                disabled={isSubmittingReview}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
}
