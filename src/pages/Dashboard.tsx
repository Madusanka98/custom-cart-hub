
import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHome from '@/components/dashboard/DashboardHome';
import ProductsManagement from '@/components/dashboard/ProductsManagement';
import UsersManagement from '@/components/dashboard/UsersManagement';
import OrdersManagement from '@/components/dashboard/OrdersManagement';
import HomePageSettings from '@/components/dashboard/HomePageSettings';
import CategoriesManagement from '@/components/dashboard/CategoriesManagement';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export default function Dashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("Authentication required", {
          description: "Please login to access the dashboard"
        });
        navigate('/login');
      } else if (!isAdmin) {
        toast.error("Access denied", {
          description: "You don't have permission to access the admin dashboard"
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <DashboardLayout>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="homepage" element={<HomePageSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </DashboardLayout>
      <Footer />
    </div>
  );
}
