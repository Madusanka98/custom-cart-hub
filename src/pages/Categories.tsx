
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoriesList } from '@/components/CategoriesList';

export default function Categories() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">All Categories</h1>
          <CategoriesList showTitle={false} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
