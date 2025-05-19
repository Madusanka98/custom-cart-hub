
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function HomePageSettings() {
  const [loading, setLoading] = useState(true);
  const [heroSection, setHeroSection] = useState({
    title: 'Shop Millions of Products at Unbeatable Prices',
    description: 'Everything you need, delivered to your doorstep with just a few clicks',
    primaryButton: 'Shop Now',
    secondaryButton: 'Become a Seller',
  });
  
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bannerSection, setBannerSection] = useState({
    title: 'Become a Seller Today',
    description: 'Start selling your products to millions of customers worldwide. Low fees, powerful tools, and a global marketplace at your fingertips.',
    buttonText: 'Start Selling',
    stats: [
      { value: '100M+', label: 'Active Buyers' },
      { value: '150+', label: 'Countries' },
      { value: '$10B+', label: 'Annual Sales' },
      { value: '5%', label: 'Seller Fee' },
    ],
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');
          
        if (categoriesError) throw categoriesError;
        
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(12);
          
        if (productsError) throw productsError;
        
        setCategories(categoriesData || []);
        setFeaturedProducts(productsData || []);
      } catch (error: any) {
        toast.error('Error loading data', {
          description: error.message
        });
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSaveHeroSection = () => {
    toast.success('Hero section settings saved successfully');
    // In a real implementation, this would save to a settings table in Supabase
  };
  
  const handleSaveBannerSection = () => {
    toast.success('Banner section settings saved successfully');
    // In a real implementation, this would save to a settings table in Supabase
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Home Page Settings</h1>
      
      <Tabs defaultValue="hero">
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Featured Products</TabsTrigger>
          <TabsTrigger value="banner">Banner Section</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Update the content displayed in the hero section of the home page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium mb-1">Title</label>
                <Input
                  id="heroTitle"
                  value={heroSection.title}
                  onChange={(e) => setHeroSection({...heroSection, title: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="heroDesc" className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  id="heroDesc"
                  value={heroSection.description}
                  onChange={(e) => setHeroSection({...heroSection, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primaryBtn" className="block text-sm font-medium mb-1">Primary Button</label>
                  <Input
                    id="primaryBtn"
                    value={heroSection.primaryButton}
                    onChange={(e) => setHeroSection({...heroSection, primaryButton: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="secondaryBtn" className="block text-sm font-medium mb-1">Secondary Button</label>
                  <Input
                    id="secondaryBtn"
                    value={heroSection.secondaryButton}
                    onChange={(e) => setHeroSection({...heroSection, secondaryButton: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveHeroSection}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories Management</CardTitle>
              <CardDescription>
                Manage the categories that appear on the home page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading categories...</p>
              ) : (
                <Table>
                  <TableCaption>List of categories displayed on the home page.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.icon}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button>Add New Category</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>
                Select which products to feature on the home page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading products...</p>
              ) : (
                <Table>
                  <TableCaption>Products that can be featured on the home page.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Feature</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featuredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">
                          <input 
                            type="checkbox" 
                            className="rounded"
                            defaultChecked={true}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button>Save Featured Products</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="banner">
          <Card>
            <CardHeader>
              <CardTitle>Banner Section</CardTitle>
              <CardDescription>
                Update the content displayed in the seller banner section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="bannerTitle" className="block text-sm font-medium mb-1">Title</label>
                <Input
                  id="bannerTitle"
                  value={bannerSection.title}
                  onChange={(e) => setBannerSection({...bannerSection, title: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="bannerDesc" className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  id="bannerDesc"
                  value={bannerSection.description}
                  onChange={(e) => setBannerSection({...bannerSection, description: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="buttonText" className="block text-sm font-medium mb-1">Button Text</label>
                <Input
                  id="buttonText"
                  value={bannerSection.buttonText}
                  onChange={(e) => setBannerSection({...bannerSection, buttonText: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Statistics</label>
                <div className="grid grid-cols-2 gap-4">
                  {bannerSection.stats.map((stat, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <Input
                        className="mb-2"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...bannerSection.stats];
                          newStats[index].value = e.target.value;
                          setBannerSection({...bannerSection, stats: newStats});
                        }}
                      />
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...bannerSection.stats];
                          newStats[index].label = e.target.value;
                          setBannerSection({...bannerSection, stats: newStats});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveBannerSection}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
