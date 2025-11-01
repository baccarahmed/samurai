import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus, CreditCard, Zap, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';

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

const Cart = () => {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  
  // Function to get product image based on product name
  const getProductImage = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('protein') || name.includes('whey')) return proteinImage;
    if (name.includes('pre-workout') || name.includes('preworkout')) return preworkoutImage;
    if (name.includes('bcaa')) return bcaaImage;
    if (name.includes('recovery')) return recoveryImage;
    if (name.includes('creatine')) return creatineImage;
    if (name.includes('mass gainer') || name.includes('weight gainer')) return massGainerImage;
    if (name.includes('fat burner') || name.includes('thermogenic')) return fatBurnerImage;
    if (name.includes('vitamin') || name.includes('multivitamin')) return multivitaminImage;
    if (name.includes('fish oil') || name.includes('omega')) return fishOilImage;
    return proteinImage; // Default image
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:5000/api/cart', {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else if (response.status === 404) {
        setCartItems([]);
      } else {
        throw new Error('Failed to fetch cart');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setCartItems(items => items.filter(item => item.product_id !== productId));
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setUpdating(prev => ({ ...prev, [productId]: true }));
    
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:5000/api/cart/update_quantity/${productId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart.items || []);
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.product_price === 'string' ? parseFloat(item.product_price) : item.product_price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Chargement du panier...</p>
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
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="sm"
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="gold-black-motion">Shopping Cart</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  {calculateItemCount()} {calculateItemCount() === 1 ? 'item' : 'items'} in your cart
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

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Add some products to get started and fuel your performance
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    Cart Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <Card 
                        key={item.id}
                        className="group hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={getProductImage(item.product_name)}
                                alt={item.product_name}
                                className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              />
                              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                                {item.quantity}
                              </Badge>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {item.product_name}
                              </h3>
                              <p className="text-primary font-bold text-lg">
                                ${typeof item.product_price === 'string' ? parseFloat(item.product_price) : item.product_price?.toFixed(2) || '0.00'}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                disabled={updating[item.product_id]}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <span className="w-12 text-center font-semibold text-foreground">
                                {updating[item.product_id] ? '...' : item.quantity}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                disabled={updating[item.product_id]}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-foreground text-lg">
                                ${(item.product_price * item.quantity).toFixed(2)}
                              </p>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product_id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({calculateItemCount()} items)</span>
                      <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-primary font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">${(calculateTotal() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full py-4 text-lg font-semibold"
                      onClick={() => navigate('/checkout')}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/products')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

