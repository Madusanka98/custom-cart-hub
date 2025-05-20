
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  PackageOpen, 
  Home,
  Settings,
  List
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', description: 'Overview of your store' },
    { icon: ShoppingBag, label: 'Products', href: '/dashboard/products', description: 'Manage your products' },
    { icon: List, label: 'Categories', href: '/dashboard/categories', description: 'Manage product categories' },
    { icon: Users, label: 'Users', href: '/dashboard/users', description: 'Manage user accounts' },
    { icon: PackageOpen, label: 'Orders', href: '/dashboard/orders', description: 'View and manage orders' },
    { icon: Home, label: 'Home Page', href: '/dashboard/homepage', description: 'Edit homepage content' },
  ];
  
  return (
    <main className="flex flex-1">
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 p-4 space-y-6">
          <div className="space-y-1">
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
                  <Icon className="h-4 w-4 shrink-0" />
                  <div>
                    <div>{item.label}</div>
                    {isActive && (
                      <p className="text-xs text-muted-foreground line-clamp-1 text-primary-foreground/80">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              Store Management
            </h4>
            <Link
              to="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Home className="h-4 w-4" />
              View Store
            </Link>
            <Link
              to="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                location.pathname === '/dashboard/settings' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
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
