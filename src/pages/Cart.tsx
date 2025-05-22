
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Trash, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
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
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 mb-4 text-muted-foreground">
                <ShoppingCart className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link to="/products">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow overflow-hidden">
                  <div className="bg-muted px-4 py-3 font-medium hidden md:grid grid-cols-8 gap-4">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-1 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-1 text-right">Total</div>
                  </div>
                  
                  {cartItems.map((item) => {
                    const { product, quantity } = item;
                    const price = product.discount 
                      ? product.price * (1 - product.discount / 100)
                      : product.price;
                      
                    return (
                      <div 
                        key={product.id} 
                        className="border-t first:border-t-0 p-4 md:grid md:grid-cols-8 md:gap-4 md:items-center"
                      >
                        {/* Product */}
                        <div className="md:col-span-4 mb-4 md:mb-0 flex items-center">
                          <div className="w-20 h-20 rounded overflow-hidden mr-4 shrink-0">
                            <img 
                              src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link 
                              to={`/products/${product.id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {product.title}
                            </Link>
                            <div className="text-sm text-muted-foreground">
                              {product.category}
                            </div>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="md:col-span-1 md:text-center mb-2 md:mb-0 flex justify-between">
                          <span className="md:hidden">Price:</span>
                          <span>${price.toFixed(2)}</span>
                        </div>
                        
                        {/* Quantity */}
                        <div className="md:col-span-2 md:text-center mb-2 md:mb-0 flex justify-between md:justify-center items-center">
                          <span className="md:hidden mr-2">Quantity:</span>
                          <div className="flex items-center border rounded-md">
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center border-r"
                              onClick={() => handleQuantityChange(product.id, quantity - 1)}
                            >
                              -
                            </button>
                            <span className="w-10 text-center">{quantity}</span>
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center border-l"
                              onClick={() => handleQuantityChange(product.id, quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Total */}
                        <div className="md:col-span-1 md:text-right flex justify-between items-center">
                          <span className="md:hidden">Total:</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              ${(price * quantity).toFixed(2)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeFromCart(product.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <Link to="/products">
                    <Button variant="outline">Continue Shopping</Button>
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow p-6 sticky top-20">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-semibold mb-6">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <Link to="/checkout">
                      <Button className="w-full">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
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
