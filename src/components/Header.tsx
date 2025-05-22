import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Icons } from '@/components/Icons';
import { ModeToggle } from '@/components/ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

function getInitials(user: any) {
  if (!user || !user.first_name || !user.last_name) return "XX";
  return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
}

export function Header() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {/* Mobile Menu Button */}
        {isSmallScreen && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="px-0" onClick={toggleMenu}>
                <Icons.menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader className="pl-5 pt-5">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Explore the store and manage your account
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <Link to="/" className="flex items-center space-x-2 px-5 py-3 hover:bg-secondary/50" onClick={closeMenu}>
                  <span>Home</span>
                </Link>
                <Link to="/products" className="flex items-center space-x-2 px-5 py-3 hover:bg-secondary/50" onClick={closeMenu}>
                  <span>Products</span>
                </Link>
                <Link to="/categories" className="flex items-center space-x-2 px-5 py-3 hover:bg-secondary/50" onClick={closeMenu}>
                  <span>Categories</span>
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/account" className="flex items-center space-x-2 px-5 py-3 hover:bg-secondary/50" onClick={closeMenu}>
                      <span>My Account</span>
                    </Link>
                    <Link to="/my-orders" className="flex items-center space-x-2 px-5 py-3 hover:bg-secondary/50" onClick={closeMenu}>
                      <span>My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link to="/dashboard" className="flex items-center space-x-2 px-5 py-3 hover:bg-secondary/50" onClick={closeMenu}>
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Button variant="ghost" className="w-full justify-start px-5 py-3 hover:bg-secondary/50" onClick={() => { handleLogout(); closeMenu(); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center space-x-2 px-5 py-3 hover:bg-secondary/50" onClick={closeMenu}>
                      <span>Login</span>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}

        <Link to="/" className="hidden sm:block">
          <Icons.logo className="h-6 w-6" />
          <span className="sr-only">Acme</span>
        </Link>
        <div className="w-full flex-1 sm:w-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="placeholder:text-sm"
            />
            <Icons.logo className="absolute right-2.5 top-2.5 h-5 w-5 text-muted-foreground peer-focus:text-secondary" />
          </div>
        </div>
        <nav className="flex items-center space-x-1">
          <ModeToggle />
          <div className="hidden sm:flex">
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892c-.57.57-.876 1.379-.876 2.21a2.5 2.5 0 002.5 2.5h8.184a2.5 2.5 0 002.5-2.5c0-.831-.305-1.64-1.876-2.21l-1.358-5.43a.997.997 0 00.01-.042l.305-1.222H16a1 1 0 000-2H3z" />
                </svg>
                {cartItems.length > 0 && (
                  <Label className="absolute -right-2 top-0 rounded-full bg-secondary px-1 text-[0.6rem] font-bold text-secondary-foreground">
                    {cartItems.length}
                  </Label>
                )}
              </Button>
            </Link>
          </div>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar>
                    <AvatarImage src={user?.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-orders">My Orders</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
