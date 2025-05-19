
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  
  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity is zero or negative, remove item
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-4">Product</th>
                          <th className="pb-4 text-center">Quantity</th>
                          <th className="pb-4 text-right">Price</th>
                          <th className="pb-4 text-right">Total</th>
                          <th className="pb-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {cartItems.map((item) => {
                          const discountedPrice = item.product.discount 
                            ? item.product.price * (1 - item.product.discount / 100)
                            : item.product.price;
                          
                          const itemTotal = discountedPrice * item.quantity;
                          
                          return (
                            <tr key={item.product.id} className="text-sm md:text-base">
                              <td className="py-4">
                                <div className="flex items-center">
                                  <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.title} 
                                    className="w-16 h-16 object-cover rounded-md hidden md:block"
                                  />
                                  <div className="md:ml-4">
                                    <Link 
                                      to={`/products/${item.product.id}`}
                                      className="font-medium hover:text-primary line-clamp-2"
                                    >
                                      {item.product.title}
                                    </Link>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Seller: {item.product.seller.name}
                                    </div>
                                    
                                    {item.product.discount && (
                                      <div className="flex items-center mt-1">
                                        <span className="text-xs text-red-500 mr-1">
                                          {item.product.discount}% OFF
                                        </span>
                                        <span className="text-xs text-muted-foreground line-through">
                                          ${item.product.price.toFixed(2)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center justify-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="py-4 text-right">
                                ${discountedPrice.toFixed(2)}
                              </td>
                              <td className="py-4 text-right font-medium">
                                ${itemTotal.toFixed(2)}
                              </td>
                              <td className="py-4 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={clearCart}>
                      Clear Cart
                    </Button>
                    
                    <Button asChild>
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-card rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>${(cartTotal + cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <Button className="w-full" asChild>
                      <Link to="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </div>
                </div>
                
                {/* Promo Code */}
                <div className="mt-6 bg-card rounded-lg shadow p-6">
                  <h3 className="text-sm font-bold mb-3">Promo Code</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter code" className="flex-grow" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
