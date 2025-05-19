
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, ShoppingBag, Package, DollarSign } from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get user count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
          
        // Get product count  
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true });
          
        // Get order count
        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true });
          
        // Get revenue
        const { data: orders, error: revenueError } = await supabase
          .from('orders')
          .select('total');
          
        const revenue = orders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;
        
        setStats({
          totalUsers: usersCount || 0,
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          revenue: revenue
        });
        
        if (usersError || productsError || ordersError || revenueError) {
          console.error("Error fetching stats:", { usersError, productsError, ordersError, revenueError });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    
    fetchStats();
  }, []);
  
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-500",
      bgColor: "bg-amber-100"
    }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This dashboard will be implemented with full functionality in subsequent phases.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
