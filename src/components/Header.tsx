import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/Icons";
import { toast } from "@/components/ui/sonner";

export function Header() {
  const { user, signOut, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6" />
          <span>MarketMaster</span>
        </Link>

        {isMobile ? (
          <>
            <Sheet>
              <SheetTrigger className="relative rounded-full">
                <Icons.menu className="h-6 w-6" />
                {cartQuantity > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center">
                    {cartQuantity}
                  </div>
                )}
              </SheetTrigger>
              <SheetContent side="left" className="sm:w-64 p-6">
                <SheetHeader className="text-left">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through our amazing store.
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <div className="grid gap-4">
                  <Link to="/" className="hover:underline py-2 block">
                    Home
                  </Link>
                  <Link to="/products" className="hover:underline py-2 block">
                    Products
                  </Link>
                  <Link to="/categories" className="hover:underline py-2 block">
                    Categories
                  </Link>
                  <Link to="/cart" className="hover:underline py-2 block relative">
                    Cart
                    {cartQuantity > 0 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center">
                        {cartQuantity}
                      </div>
                    )}
                  </Link>
                  {user ? (
                    <>
                      <Link to="/account" className="hover:underline py-2 block">
                        Account
                      </Link>
                      {isAdmin && (
                        <Link to="/dashboard" className="hover:underline py-2 block">
                          Dashboard
                        </Link>
                      )}
                      <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="hover:underline py-2 block">
                        Login
                      </Link>
                    </>
                  )}
                  <Separator className="my-4" />
                  <ModeToggle />
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="hover:underline underline-offset-4">
                Home
              </Link>
              <Link to="/products" className="hover:underline underline-offset-4">
                Products
              </Link>
              <Link to="/categories" className="hover:underline underline-offset-4">
                Categories
              </Link>
              <Link to="/cart" className="relative hover:underline underline-offset-4">
                Cart
                {cartQuantity > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center">
                    {cartQuantity}
                  </div>
                )}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <ModeToggle />
              <Separator orientation="vertical" className="h-6" />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.email || "User Avatar"} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "MM"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <Dashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

import {
  User,
  LogOut,
  Dashboard
} from "lucide-react";
