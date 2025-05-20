
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;
  
  return (
    <Card className="product-card overflow-hidden h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="overflow-hidden">
        <div className="h-48 overflow-hidden relative">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'} 
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <Badge className="absolute top-2 right-2 bg-red-500">-{product.discount}%</Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Rating value={product.rating || 0} />
          <span className="text-xs text-muted-foreground">{product.category}</span>
        </div>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg">${discountedPrice.toFixed(2)}</span>
          {product.discount && (
            <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-1">{product.description}</p>
        
        <div className="text-xs text-muted-foreground">
          Seller: {product.seller?.name || 'Store Seller'}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full"
          onClick={() => addToCart(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
