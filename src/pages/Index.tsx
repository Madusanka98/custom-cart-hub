
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { featuredProducts, categories } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';

export default function Index() {
  const [activeTab, setActiveTab] = useState('featured');
  const popularCategories = categories.slice(0, 6);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                Shop Millions of Products at Unbeatable Prices
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Everything you need, delivered to your doorstep with just a few clicks
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Link to="/products">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/sellers">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Popular Categories</h2>
              <Link to="/categories">
                <Button variant="outline" className="hidden sm:flex items-center">
                  All Categories <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/category/${category.id}`}
                  className="bg-card hover:bg-accent transition-colors rounded-lg p-4 text-center"
                >
                  <div className="h-16 w-16 mx-auto flex items-center justify-center bg-primary/10 rounded-full mb-3">
                    <span className="text-primary text-xl">{category.icon}</span>
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Products Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Explore Our Products</h2>
              <Link to="/products">
                <Button variant="outline" className="hidden sm:flex items-center">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <Tabs 
              defaultValue="featured" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-8">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="new-arrivals">New Arrivals</TabsTrigger>
                <TabsTrigger value="best-sellers">Best Sellers</TabsTrigger>
                <TabsTrigger value="deals">Top Deals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="featured">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="new-arrivals">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.slice(4, 12).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="best-sellers">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.slice(2, 10).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="deals">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts
                    .filter(product => product.discount)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center">
              <Link to="/products">
                <Button className="sm:hidden">View All Products</Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Banner Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-lg p-6 md:p-10 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Become a Seller Today</h2>
                  <p className="text-white/80 max-w-xl mb-4">
                    Start selling your products to millions of customers worldwide. 
                    Low fees, powerful tools, and a global marketplace at your fingertips.
                  </p>
                  <Link to="/sellers">
                    <Button className="bg-white text-primary hover:bg-gray-100">
                      Start Selling
                    </Button>
                  </Link>
                </div>
                <div className="bg-white/10 rounded-lg p-4 md:p-6 backdrop-blur">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3">
                      <div className="text-3xl font-bold">100M+</div>
                      <div className="text-sm opacity-80">Active Buyers</div>
                    </div>
                    <div className="p-3">
                      <div className="text-3xl font-bold">150+</div>
                      <div className="text-sm opacity-80">Countries</div>
                    </div>
                    <div className="p-3">
                      <div className="text-3xl font-bold">$10B+</div>
                      <div className="text-sm opacity-80">Annual Sales</div>
                    </div>
                    <div className="p-3">
                      <div className="text-3xl font-bold">5%</div>
                      <div className="text-sm opacity-80">Seller Fee</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
