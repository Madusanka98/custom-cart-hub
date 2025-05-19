
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

export default function Dashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading dashboard...</p>
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
          <Route path="users" element={<UsersManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </DashboardLayout>
      <Footer />
    </div>
  );
}
