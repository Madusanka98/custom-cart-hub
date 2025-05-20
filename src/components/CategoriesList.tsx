
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export function CategoriesList({ limit = 0, showTitle = true }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      
      try {
        let query = supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (limit > 0) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, [limit]);
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products/category/${categoryId}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    );
  }
  
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Categories</h2>
            <Link to="/categories" className="text-primary hover:underline">
              View All
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.id} 
              onClick={() => handleCategoryClick(category.id)}
              className="bg-card hover:bg-accent transition-colors rounded-lg p-4 text-center cursor-pointer"
            >
              <div className="h-16 w-16 mx-auto flex items-center justify-center bg-primary/10 rounded-full mb-3">
                <span className="text-primary text-xl">{category.icon || '📦'}</span>
              </div>
              <h3 className="font-medium">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
