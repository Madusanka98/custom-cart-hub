import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ProductCard from "@/components/ProductCard";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, ArrowUpDown, Search, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export default function Products() {
  const { categoryId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }
        
        // Fetch products
        let query = supabase
          .from('products')
          .select(`
            id,
            title,
            description,
            price,
            discount,
            images,
            rating,
            category,
            seller_id,
            stock
          `);
          
        // Filter by category if provided in URL
        if (categoryId) {
          const category = categoriesData?.find(cat => cat.id === categoryId);
          if (category) {
            query = query.eq('category', category.name);
            setSelectedCategories([category.name]);
          }
        }
        
        const { data: productsData, error: productsError } = await query;
        
        if (productsError) {
          console.error('Error fetching products:', productsError);
        } else {
          // Transform products data to match the Product type
          const transformedProducts = productsData.map(product => ({
            ...product,
            seller: { 
              name: 'Store Seller', 
              id: product.seller_id,
              rating: 4.5 // Adding the missing rating property
            },
          })) as Product[];
          
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [categoryId]);
  
  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Filter by search query
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Filter by price range
    const price = product.discount 
      ? product.price * (1 - product.discount / 100)
      : product.price;
    
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      case 'price-high':
        const priceHighA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceHighB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceHighB - priceHighA;
      case 'rating':
        return ((b.rating || 0) - (a.rating || 0));
      case 'newest':
        return parseInt(b.id.toString()) - parseInt(a.id.toString());
      default: // 'featured'
        return 0; // No sorting
    }
  });
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSortBy('featured');
  };
  
  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            {categoryId && categories.find(cat => cat.id === categoryId)
              ? `${categories.find(cat => cat.id === categoryId)?.name} Products`
              : 'All Products'}
          </h1>
          
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : (
            <>
              {/* Mobile filter button */}
              <div className="lg:hidden mb-4">
                <Button 
                  onClick={toggleFilters} 
                  variant="outline" 
                  className="w-full flex justify-between"
                >
                  <span className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  {showFilters ? <X className="h-4 w-4" /> : null}
                </Button>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Filters Sidebar */}
                <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  <div className="bg-card rounded-lg shadow p-6 sticky top-20">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={resetFilters}
                        className="text-sm text-muted-foreground h-8"
                      >
                        Reset All
                      </Button>
                    </div>
                    
                    {/* Search Filter */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Search</h3>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-7 w-7 p-0"
                            onClick={() => setSearchQuery('')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Price Range Filter */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-4">Price Range</h3>
                      <Slider
                        value={priceRange}
                        min={0}
                        max={200}
                        step={5}
                        onValueChange={setPriceRange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Category Filter */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.name)}
                              onCheckedChange={() => toggleCategory(category.name)}
                              className="mr-2"
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Products Grid */}
                <div className="lg:w-3/4">
                  {/* Sort Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <p className="text-muted-foreground">
                      Showing <span className="font-medium">{sortedProducts.length}</span> products
                    </p>
                    
                    <div className="flex items-center">
                      <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="newest">Newest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {sortedProducts.length === 0 ? (
                    <div className="bg-card rounded-lg shadow p-8 text-center">
                      <h3 className="text-xl font-medium mb-2">No products found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
