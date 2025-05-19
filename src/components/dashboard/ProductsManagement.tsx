
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export default function ProductsManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  async function fetchProducts() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Error loading products', {
        description: error.message
      });
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Button>Add Product</Button>
      </div>
      
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button>Add Your First Product</Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="border-b px-4 py-3 flex items-center font-medium">
            <div className="flex-1">Product Name</div>
            <div className="flex-1">Category</div>
            <div className="w-24 text-right">Price</div>
            <div className="w-24 text-right">Stock</div>
            <div className="w-24 text-center">Actions</div>
          </div>
          
          {products.map((product) => (
            <div key={product.id} className="border-b px-4 py-3 flex items-center">
              <div className="flex-1">{product.title}</div>
              <div className="flex-1">{product.category}</div>
              <div className="w-24 text-right">${Number(product.price).toFixed(2)}</div>
              <div className="w-24 text-right">{product.stock}</div>
              <div className="w-24 flex justify-center gap-2">
                <Button variant="ghost" size="icon">✏️</Button>
                <Button variant="ghost" size="icon">🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
