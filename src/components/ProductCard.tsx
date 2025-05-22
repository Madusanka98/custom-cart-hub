import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <Card className="bg-card text-card-foreground shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold truncate">
          {product.title}
        </CardTitle>
        <CardDescription className="text-gray-500 truncate">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative">
          {product.discount && (
            <Badge className="absolute top-2 left-2 z-10 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-bold">
              {product.discount}% off
            </Badge>
          )}
          <Link to={`/products/${product.id}`}>
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.svg"
              }
              alt={product.title}
              className="w-full h-48 object-cover rounded-md"
            />
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-primary">
              ${product.discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
            </div>
            {product.discount && (
              <div className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">Stock: {product.stock}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <Link to={`/products/${product.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Button onClick={() => handleAddToCart(product)}>
          Add to Cart <ShoppingCart className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
