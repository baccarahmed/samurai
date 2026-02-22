import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingCart, 
  Heart, 
  Eye, 
  Star, 
  CheckCircle, 
  Shield, 
  Zap, 
  Leaf, 
  Award, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

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

const FeaturedProducts = () => {
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [loading, setLoading] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      setLoading(prev => ({ ...prev, [`cart_${productId}`]: true }));
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to cart');
        return;
      }

      const response = await fetch(`/api/cart/add/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product added to cart!",
          variant: "success",
          className: "bg-green-500 text-white border-none"
        });
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      alert('Error adding to cart: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, [`cart_${productId}`]: false }));
    }
  };

  const handleToggleWishlist = async (productId, e) => {
    e.stopPropagation();
    try {
      setLoading(prev => ({ ...prev, [`wishlist_${productId}`]: true }));
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to manage wishlist');
        return;
      }

      const response = await fetch(`/api/wishlist/add/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Added to wishlist!');
      } else if (response.status === 409) {
        alert('Product already in wishlist');
      } else {
        throw new Error('Failed to add to wishlist');
      }
    } catch (error) {
      alert('Error adding to wishlist: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, [`wishlist_${productId}`]: false }));
    }
  };

  // Fetch featured products from the API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();

        // Normalize possible API shapes to an array
        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.items)
                ? data.items
                : [];

        if (!Array.isArray(productsArray)) {
          throw new Error('Unexpected products response format');
        }
        
        // Process the data to match our component's expected format
        const processedProducts = productsArray.map(product => {
          const rawCategory = typeof product.category === 'object'
            ? (product.category?.name ?? product.category?.slug ?? '')
            : (product.category ?? product.category_name ?? product.categoryName ?? '');
          const category = normalizeCategory(rawCategory);
          return ({
          id: product.id,
          name: product.name,
          category,
          price: product.price ?? product.current_price ?? product.salePrice ?? 0,
          originalPrice: product.original_price ?? product.originalPrice ?? null,
          rating: product.rating || 4.5,
          reviews: Math.floor(Math.random() * 3000) + 500,
          image: getProductImage(product.name),
          badges: determineBadges(product),
          description: product.description,
          flavors: product.flavors || ['Unflavored'],
          stock: (product.stock_quantity ?? product.stockQuantity ?? product.stock ?? 0) > 10 
            ? 'In Stock' 
            : (product.stock_quantity ?? product.stockQuantity ?? product.stock ?? 0) > 0 
              ? 'Low Stock' 
              : 'Out of Stock',
          stockLevel: determineStockLevel(product.stock_quantity ?? product.stockQuantity ?? product.stock ?? 0),
          featured: product.featured === true,
          features: determineFeatures(product)
        });
        });
        
        // Filter to only show featured products or limit to 4 products if needed
        const featuredProducts = processedProducts.filter(p => p.featured).length > 0 
          ? processedProducts.filter(p => p.featured) 
          : processedProducts.slice(0, 4);
          
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        // Use fallback data if API fails
        setProducts([
          {
            id: 1,
            name: 'Elite Whey Protein',
            category: 'Protein',
            price: 49.99,
            originalPrice: 59.99,
            rating: 4.9,
            reviews: 2847,
            image: proteinImage,
            badges: ['Best Seller', 'NSF Certified'],
            description: 'Premium whey protein isolate with 25g protein per serving',
            flavors: ['Vanilla', 'Chocolate', 'Strawberry'],
            stock: 'In Stock',
            stockLevel: 'high',
            features: ['Fast Absorption', 'Muscle Building', 'Post-Workout']
          },
          {
            id: 2,
            name: 'Pre-Workout Ignite',
            category: 'Pre-Workout',
            price: 39.99,
            originalPrice: null,
            rating: 4.8,
            reviews: 1923,
            image: preworkoutImage,
            badges: ['High Energy', 'Vegan'],
            description: 'Explosive energy and focus for intense training sessions',
            flavors: ['Blue Raspberry', 'Fruit Punch', 'Green Apple'],
            stock: 'Low Stock',
            stockLevel: 'low',
            features: ['Energy Boost', 'Focus Enhancement', 'Pump Formula']
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
  // Helper functions for processing product data
  const determineStockLevel = (stockQuantity) => {
    if (stockQuantity > 50) return 'high';
    if (stockQuantity > 10) return 'medium';
    return 'low';
  };
  
  const normalizeCategory = (cat) => {
    const c = (cat || '').toString().toLowerCase();
    if (c.includes('protein') || c.includes('whey')) return 'Protein';
    if (c.includes('pre')) return 'Pre-Workout';
    if (c.includes('recover')) return 'Recovery';
    if (c.includes('strength') || c.includes('creatine')) return 'Strength';
    if (c.includes('vitamin')) return 'Vitamines';
    return cat || 'Performance';
  };
  
  const determineBadges = (product) => {
    const badges = [];
    if (product.featured) badges.push('Best Seller');
    if (product.category === 'Protein') badges.push('NSF Certified');
    if (product.category === 'Pre-Workout') badges.push('High Energy');
    if (product.vegan) badges.push('Vegan');
    if (product.new) badges.push('New');
    if (product.athlete_choice) badges.push('Athlete Choice');
    return badges.length > 0 ? badges : ['New'];
  };
  
  const determineFeatures = (product) => {
    // This would ideally come from the product data
    // For now, we'll return default features based on category
    const categoryFeatures = {
      'Protein': ['Fast Absorption', 'Muscle Building', 'Post-Workout'],
      'Pre-Workout': ['Energy Boost', 'Focus Enhancement', 'Pump Formula'],
      'Recovery': ['Muscle Recovery', 'Reduce Fatigue', 'Anti-Inflammatory'],
      'Strength': ['Strength Gains', 'Power Output', 'Muscle Volume'],
      'Vitamines': ['Immune Support', 'Daily Health', 'Energy'],
      'Récupération': ['Muscle Recovery', 'Reduce Fatigue', 'Anti-Inflammatory'],
      'Performance': ['Endurance', 'Strength', 'Focus']
    };
    
    return categoryFeatures[product.category] || ['Quality', 'Performance', 'Value'];
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Best Seller': return <TrendingUp className="w-3 h-3" />;
      case 'NSF Certified': return <Shield className="w-3 h-3" />;
      case 'High Energy': return <Zap className="w-3 h-3" />;
      case 'Vegan': return <Leaf className="w-3 h-3" />;
      case 'New': return <Star className="w-3 h-3" />;
      case 'Athlete Choice': return <Award className="w-3 h-3" />;
      default: return null;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-primary text-primary-foreground';
      case 'NSF Certified': return 'bg-green-500 text-white';
      case 'High Energy': return 'bg-orange-500 text-white';
      case 'Vegan': return 'bg-green-600 text-white';
              case 'New': return 'bg-primary text-primary-foreground';
      case 'Athlete Choice': return 'bg-purple-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStockColor = (stockLevel) => {
    switch (stockLevel) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="gold-black-motion">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our top-rated supplements trusted by athletes worldwide
          </p>
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <div className="text-center text-muted-foreground mb-6">Loading products…</div>
        )}
        {!isLoading && error && (
          <div className="text-center text-red-600 mb-6">Failed to load products: {error}</div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group hover-lift overflow-hidden border-0 shadow-lg bg-card/80 backdrop-blur-sm relative cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image */}
              <div className="relative h-64 bg-muted overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.badges.map((badge, index) => (
                    <Badge 
                      key={index} 
                      className={`text-xs flex items-center gap-1 ${getBadgeColor(badge)}`}
                    >
                      {getBadgeIcon(badge)}
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white" onClick={(e) => { e.stopPropagation(); console.log("Like clicked for product", product.id); }}>
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* Discount Badge */}
                {product.originalPrice && (
                  <Badge className="absolute bottom-3 left-3 bg-red-500 text-white">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                )}

                {/* Stock Indicator */}
                <div className={`absolute bottom-3 right-3 text-xs font-medium ${getStockColor(product.stockLevel)}`}>
                  {product.stock}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Category */}
                <div className="text-xs text-primary font-medium mb-2 uppercase tracking-wide">
                  {product.category}
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Flavors */}
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-1">Available Flavors:</div>
                  <div className="flex gap-1">
                    {product.flavors.slice(0, 3).map((flavor, index) => (
                      <div key={index} className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30"></div>
                    ))}
                    {product.flavors.length > 3 && (
                      <div className="text-xs text-primary">+{product.flavors.length - 3}</div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mb-4">
                  <Button 
                    className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all" 
                    onClick={(e) => handleAddToCart(product.id, e)}
                    disabled={loading[`cart_${product.id}`]}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => handleToggleWishlist(product.id, e)}
                    disabled={loading[`wishlist_${product.id}`]}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground gold-border-animation"
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
