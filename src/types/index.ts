
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  category: string;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  stock: number;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isSeller: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
