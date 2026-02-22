import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Import product images
import proteinImage from '@/assets/Elite Whey Protein.jpg';
import preworkoutImage from '@/assets/Pre-Workout Ignite.jpg';
import bcaaImage from '@/assets/BCAA Complex.jpg';
import creatineImage from '@/assets/Creatine Monohydrate.jpg';
import recoveryImage from '@/assets/Recovery Matrix.jpg';
import massGainerImage from '@/assets/Mass Gainer Extreme.jpg';
import fatBurnerImage from '@/assets/Thermogenic Fat Burner.jpg';
import multivitaminImage from '@/assets/Daily Multivitamin.jpg';
import fishOilImage from '@/assets/Omega-3 Fish Oil.jpg';

const Wishlist = () => {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to get product image based on product name
  const getProductImage = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('protein') || name.includes('whey')) return proteinImage;
    if (name.includes('pre-workout') || name.includes('preworkout')) return preworkoutImage;
    if (name.includes('bcaa')) return bcaaImage;
    if (name.includes('creatine')) return creatineImage;
    if (name.includes('recovery')) return recoveryImage;
    if (name.includes('mass gainer') || name.includes('weight gainer')) return massGainerImage;
    if (name.includes('fat burner') || name.includes('thermogenic')) return fatBurnerImage;
    if (name.includes('vitamin') || name.includes('multivitamin')) return multivitaminImage;
    if (name.includes('fish oil') || name.includes('omega')) return fishOilImage;
    return proteinImage; // Default image
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items || []);
      } else if (response.status === 404) {
        setWishlistItems([]);
      } else {
        throw new Error('Failed to fetch wishlist');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.product_id !== productId));
      } else {
        throw new Error('Failed to remove item from wishlist');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addToCart = async (productId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/cart/add/${productId}`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product added to cart!",
          variant: "success"
        });
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Chargement de la wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="gold-black-motion">My Wishlist</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="p-4">
              <p className="text-destructive font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist and build your perfect collection
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/products')}
            >
              <Zap className="mr-2 h-5 w-5" />
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card 
                key={item.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getProductImage(item.product_name)}
                      alt={item.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => removeFromWishlist(item.product_id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                      Wishlist
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.product_name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-primary">
                      ${parseFloat(item.product_price || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => addToCart(item.product_id)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

