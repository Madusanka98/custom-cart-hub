import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CategoriesDropdown } from './CategoriesDropdown';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useMobile } from '@/hooks/use-mobile';

export function Header() {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { cartItems: cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Close mobile menu when navigating or resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile) setIsMenuOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchActive(false);
    }
  };
  
  const handleLogout = () => {
    setShowLogoutConfirm(false);
    signOut();
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  const toggleSearch = () => {
    setIsSearchActive(prev => !prev);
  };
  
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 mr-2 fill-primary" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L4 7l8 5 8-5-8-5zM4 15l8 5 8-5M4 11l8 5 8-5" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
              />
            </svg>
            MarketMaster
          </Link>
          
          {/* Mobile - Menu Toggle Button */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSearch}
                className="focus:outline-none"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="focus:outline-none">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMenu}
                className="focus:outline-none"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          )}
          
          {/* Desktop - Navigation Links */}
          {!isMobile && (
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <CategoriesDropdown />
              <Link to="/products" className="text-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/sellers" className="text-foreground hover:text-primary transition-colors">
                Sellers
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          )}
          
          {/* Desktop - Right Side Controls */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-56 pl-8 pr-2 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              </form>
              
              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="focus:outline-none">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* User */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="focus:outline-none">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <DropdownMenuItem disabled>
                        <span className="text-sm">Hello, {user.email?.split('@')[0]}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate('/account')}>
                        My Account
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate('/orders')}>
                        My Orders
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onSelect={() => setShowLogoutConfirm(true)}>
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onSelect={() => navigate('/login')}>
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate('/register')}>
                        Register
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {/* Mobile - Search Bar (conditionally rendered) */}
        {isMobile && isSearchActive && (
          <form onSubmit={handleSearch} className="mt-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8 pr-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={toggleSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
        
        {/* Mobile - Navigation Menu (conditionally rendered) */}
        {isMobile && isMenuOpen && (
          <nav className="mt-4 py-3 space-y-3">
            <Link 
              to="/" 
              className="block p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="block p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="block p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/sellers" 
              className="block p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Sellers
            </Link>
            <Link 
              to="/contact" 
              className="block p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <div className="border-t border-border my-2 pt-2"></div>
                <Link 
                  to="/account" 
                  className="block p-2 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link 
                  to="/orders" 
                  className="block p-2 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <Link 
                    to="/dashboard" 
                    className="block p-2 hover:bg-muted rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  className="block w-full text-left p-2 hover:bg-muted rounded-md text-destructive"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-2 pt-2"></div>
                <Link 
                  to="/login" 
                  className="block p-2 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block p-2 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
