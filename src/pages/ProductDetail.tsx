
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ShoppingCart, Heart, Truck, ArrowLeft, ArrowRight, Star, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (productError) {
          throw new Error(productError.message);
        }
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        // Add seller information to match the Product type
        const transformedProduct = {
          ...productData,
          seller: { 
            name: 'Store Seller', 
            id: productData.seller_id,
            rating: 4.5
          },
        } as Product;
        
        setProduct(transformedProduct);
        
        // Fetch related products (same category)
        if (productData.category) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('category', productData.category)
            .neq('id', id)
            .limit(4);
            
          if (relatedError) {
            console.error('Error fetching related products:', relatedError);
          } else {
            // Transform products to match the Product type
            const transformedProducts = (relatedData || []).map(p => ({
              ...p,
              seller: { 
                name: 'Store Seller', 
                id: p.seller_id,
                rating: 4.5
              },
            })) as Product[];
            
            setRelatedProducts(transformedProducts);
          }
        }
        
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [id]);
  
  // Calculate discounted price if applicable
  const discountedPrice = product?.discount 
    ? product.price * (1 - product.discount / 100)
    : product?.price || 0;
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };
  
  const handlePrevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex(prev => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleNextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex(prev => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (error || !product) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p>{error || "Sorry, we couldn't find the product you're looking for."}</p>
          <Button asChild className="mt-4">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center">
              <li>
                <Link to="/" className="hover:text-primary">Home</Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link to="/products" className="hover:text-primary">Products</Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link to={`/products/category/${product.category}`} className="hover:text-primary">{product.category}</Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-foreground font-medium">{product.title}</li>
            </ol>
          </nav>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-muted rounded-lg overflow-hidden h-96">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : '/placeholder.svg'} 
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
                
                {product.discount && (
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    {product.discount}% OFF
                  </Badge>
                )}
                
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="opacity-70 hover:opacity-100" 
                    onClick={handlePrevImage}
                    disabled={!product.images || product.images.length <= 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="opacity-70 hover:opacity-100" 
                    onClick={handleNextImage}
                    disabled={!product.images || product.images.length <= 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 border rounded-md overflow-hidden ${
                        idx === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.title} thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Rating value={product.rating || 0} />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} Rating
                  </span>
                </div>
                
                <span className="text-sm text-muted-foreground">
                  Sold by {product.seller.name}
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-bold">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discount && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {product.discount && (
                  <Badge variant="outline" className="text-red-500 border-red-200">
                    Save ${(product.price - discountedPrice).toFixed(2)} ({product.discount}% off)
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Free shipping on orders over $50
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    {product.seller.rating} Seller Rating
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="mr-3">Quantity:</span>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                  
                  <span className="ml-4 text-sm text-muted-foreground">
                    {product.stock} available
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button className="flex-1 sm:flex-none" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <Tabs defaultValue="details" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="prose max-w-none">
                <p>
                  {product.description}
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, 
                  vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, 
                  ac blandit elit tincidunt id.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand:</span>
                      <span className="font-medium">MarketMaster</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model:</span>
                      <span className="font-medium">MM-{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">0.5kg</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">10 x 5 x 2 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-medium">Metal, Plastic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color:</span>
                      <span className="font-medium">Black</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Warranty:</span>
                      <span className="font-medium">12 Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Overall Rating</h3>
                    <Button>Write a Review</Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{product.rating || 0}</div>
                      <Rating value={product.rating || 0} size={24} className="my-2" />
                      <div className="text-sm text-muted-foreground">Based on 24 reviews</div>
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <div className="w-8 text-sm text-right">{star} star</div>
                          <div className="flex-grow bg-muted-foreground/20 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-yellow-500 h-full"
                              style={{ 
                                width: `${
                                  star === Math.round(product.rating || 0) 
                                    ? '70%'
                                    : star > Math.round(product.rating || 0)
                                      ? '10%'
                                      : '30%'
                                }` 
                              }}
                            ></div>
                          </div>
                          <div className="w-8 text-sm">{
                            star === Math.round(product.rating || 0) 
                              ? '70%'
                              : star > Math.round(product.rating || 0)
                                ? '10%'
                                : '30%'
                          }</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Mock reviews */}
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">John D.</div>
                        <div className="text-muted-foreground text-sm">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                      <Rating value={5} className="mb-2" />
                      <h4 className="font-medium mb-1">Great product, highly recommend</h4>
                      <p className="text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. 
                        Duis vulputate commodo lectus.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      We offer the following shipping options for all orders:
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Standard Shipping (5-7 business days): $4.99</li>
                      <li>Express Shipping (2-3 business days): $9.99</li>
                      <li>Next Day Delivery (order before 2 PM): $14.99</li>
                    </ul>
                    <p>
                      Free standard shipping on all orders over $50.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="returns">
                  <AccordionTrigger>Returns & Refunds</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      We accept returns within 30 days of delivery.
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      <li>Items must be unused and in original packaging</li>
                      <li>Return shipping fees may apply</li>
                      <li>Refunds are processed within 5-7 business days</li>
                    </ul>
                    <p>
                      Contact customer service to initiate a return.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="warranty">
                  <AccordionTrigger>Warranty</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      This product comes with a 12-month warranty covering manufacturing defects.
                    </p>
                    <p>
                      The warranty does not cover damage from misuse, accidents, or normal wear and tear.
                      Please contact the seller directly for warranty claims.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
