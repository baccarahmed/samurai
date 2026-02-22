import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Zap,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/logo.PNG';

const Header = ({ onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(0);
  const location = useLocation();
  const { isAuthenticated, user, isAdmin } = useAuth();

  // Gestion du scroll pour l'effet de transparence
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/articles', label: 'Articles' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-12 h-12 lg:w-15 lg:h-15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img src={logoImage} alt="Samurai Nutrition Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              Samurai
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-colors font-medium samurai-nav-item ${
                  location.pathname === item.path 
                    ? 'text-primary bg-primary/10 active' 
                    : 'text-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </Link>
            ))}

            
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplements..." 
                className="pl-10 bg-muted/50 border-primary/20 focus:border-primary focus:ring-primary/20"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" aria-label="Open wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-all duration-300" aria-label="Open wishlist">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  aria-label="Account menu"
                >
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 samurai-header border-primary/20">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem className="cursor-default text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      {user?.first_name} {user?.last_name}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 hover:text-primary">
                      <Link to="/orders" className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Mes Commandes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 hover:text-primary">
                      <Link to="/history" className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Mon Historique
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 hover:text-primary">
                        <Link to="/admin" className="flex items-center">
                          <Zap className="w-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                ) : (
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 hover:text-primary">
                    <Link to="/auth" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Login / Register
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart */}
            <Link to="/cart" aria-label="Open cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-all duration-300" aria-label="Open cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs bg-primary text-primary-foreground animate-samurai-pulse">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10 hover:text-primary transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden katana-divider samurai-header backdrop-blur-md">
            <div className="py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search supplements..." 
                  className="pl-10 bg-muted/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg transition-colors font-medium ${
                      location.pathname === item.path 
                        ? 'text-primary bg-primary/10' 
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                </Link>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                  </Button>
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Orders
                      </Button>
                    </Link>
                    <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        History
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
