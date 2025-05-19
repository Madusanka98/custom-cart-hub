
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  PackageOpen, 
  Settings,
  Home 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: ShoppingBag, label: 'Products', href: '/dashboard/products' },
    { icon: Users, label: 'Users', href: '/dashboard/users' },
    { icon: PackageOpen, label: 'Orders', href: '/dashboard/orders' },
    { icon: Home, label: 'Home Page', href: '/dashboard/homepage' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];
  
  return (
    <main className="flex flex-1">
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      
      <div className="flex flex-1 flex-col">
        <div className="md:hidden border-b">
          <div className="flex h-14 items-center px-4">
            <h2 className="font-semibold">Admin Dashboard</h2>
          </div>
          <nav className="flex overflow-x-auto p-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </main>
  );
}
