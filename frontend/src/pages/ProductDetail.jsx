import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ArrowLeft,
  Zap,
  Leaf,
  Shield,
  Award,
  TrendingUp,
  Truck,
  RotateCcw,
  Phone,
  CheckCircle,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
// Import product images
import eliteWheyProteinImg from '@/assets/Elite Whey Protein.jpg';
import creatineMonohydrateImg from '@/assets/Creatine Monohydrate.jpg';
import bcaaComplexImg from '@/assets/BCAA Complex.jpg';
import preWorkoutIgniteImg from '@/assets/Pre-Workout Ignite.jpg';
import recoveryMatrixImg from '@/assets/Recovery Matrix.jpg';
import massGainerImg from '@/assets/Mass Gainer Extreme.jpg';
import fatBurnerImg from '@/assets/Thermogenic Fat Burner.jpg';
import multivitaminImg from '@/assets/Daily Multivitamin.jpg';
import fishOilImg from '@/assets/Omega-3 Fish Oil.jpg';

// Function to get product image based on product name
const getProductImage = (productName) => {
  switch(productName) {
    case 'Elite Whey Protein':
      return eliteWheyProteinImg;
    case 'Creatine Monohydrate':
      return creatineMonohydrateImg;
    case 'BCAA Complex':
      return bcaaComplexImg;
    case 'Pre-Workout Ignite':
      return preWorkoutIgniteImg;
    case 'Recovery Matrix':
      return recoveryMatrixImg;
    case 'Mass Gainer Extreme':
      return massGainerImg;
    case 'Thermogenic Fat Burner':
      return fatBurnerImg;
    case 'Daily Multivitamin':
      return multivitaminImg;
    case 'Omega-3 Fish Oil':
      return fishOilImg;
    default:
      return null; // Will use fallback image if no match
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Sample reviews data - defined at the top level to avoid conditional hook calls
  const sampleReviews = [
    {
      id: 1,
      name: 'Mike Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing protein powder! Mixes well and tastes great. Definitely noticed improved recovery.',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Chen',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good quality protein. The chocolate flavor is my favorite. Will order again.',
      verified: true
    },
    {
      id: 3,
      name: 'David Rodriguez',
      rating: 5,
      date: '2024-01-08',
      comment: 'Best pre-workout I\'ve tried. Clean energy without the crash. Highly recommend!',
      verified: true
    }
  ];
  
  // All hooks must be called at the top level, before any conditional returns
  // Hook for setting reviews
  useEffect(() => {
    setReviews(sampleReviews);
  }, []);
  
  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data to match our component's expected format
        const processedProduct = {
          id: data.id,
          name: data.name,
          category: data.category,
          price: data.price,
          originalPrice: data.original_price || null,
          rating: data.rating || 4.5,
          reviews: Math.floor(Math.random() * 3000) + 500, // Placeholder for now
          images: getProductImage(data.name) ? [
            getProductImage(data.name),
            getProductImage(data.name), // Utiliser la même image pour tous les angles
            getProductImage(data.name),
            getProductImage(data.name)
          ] : data.image_url ? [
            data.image_url,
            getProductImage(data.name),
            getProductImage(data.name),
            getProductImage(data.name)
          ] : [
            getProductImage(data.name),
            getProductImage(data.name),
            getProductImage(data.name),
            getProductImage(data.name)
          ],
          badges: determineBadges(data),
          description: data.description,
          flavors: data.flavors || ['Unflavored'],
          stock: data.stock_quantity > 10 ? 'In Stock' : data.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock',
          stockLevel: determineStockLevel(data.stock_quantity),
          stockCount: data.stock_quantity,
          features: determineFeatures(data),
          nutritionFacts: {
            servingSize: '1 scoop (30g)',
            servingsPerContainer: 30,
            calories: 120,
            protein: '25g',
            carbs: '2g',
            fat: '1g',
            sugar: '1g'
          },
          ingredients: 'Whey Protein Isolate, Natural Flavors, Lecithin, Stevia Extract, Digestive Enzymes',
          directions: 'Mix 1 scoop with 8-10 oz of water or milk. Consume within 30 minutes post-workout for optimal results.',
          benefits: [
            'Supports muscle growth and recovery',
            'Fast-absorbing whey protein isolate',
            'Third-party tested for purity',
            'No artificial fillers or additives',
            'Grass-fed source'
          ]
        };
        
        setProduct(processedProduct);
        
        // Fetch related products (products in the same category)
        fetchRelatedProducts(data.category);
        
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
        // Use fallback data if API fails
        setProduct(getFallbackProduct(id));
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchRelatedProducts = async (category) => {
      try {
        const response = await fetch(`/api/products/category/${encodeURIComponent(category)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data and filter out the current product
        const processedProducts = data
          .filter(p => p.id !== parseInt(id))
          .map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.original_price || null,
            rating: product.rating || 4.5,
            reviews: Math.floor(Math.random() * 1000) + 100,
            image: getProductImage(product.name) || product.image_url,
            badges: determineBadges(product),
            description: product.description,
            flavors: product.flavors || ['Unflavored'],
            stock: product.stock_quantity > 10 ? 'In Stock' : product.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock',
            stockLevel: determineStockLevel(product.stock_quantity),
            features: determineFeatures(product)
          }));
        
        // Limit to 4 related products
        setRelatedProducts(processedProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching related products:', error);
        // Use fallback related products
        setRelatedProducts([
          {
            id: 3,
            name: 'Recovery Matrix',
            category: 'Recovery',
            price: 34.99,
            originalPrice: null,
            rating: 4.7,
            reviews: 1456,
            image: recoveryMatrixImg,
            badges: ['New', 'Athlete Choice'],
            description: 'Advanced recovery formula with BCAAs and glutamine',
            flavors: ['Lemon-Lime', 'Orange', 'Grape'],
            stock: 'In Stock',
            stockLevel: 'medium',
            features: ['Muscle Recovery', 'Reduce Fatigue', 'Anti-Inflammatory']
          },
          {
            id: 4,
            name: 'Creatine Monohydrate',
            category: 'Strength',
            price: 24.99,
            originalPrice: 29.99,
            rating: 4.9,
            reviews: 3421,
            image: creatineMonohydrateImg,
            badges: ['Pure', 'Tested'],
            description: 'Micronized creatine monohydrate for strength and power',
            flavors: ['Unflavored'],
            stock: 'In Stock',
            stockLevel: 'high',
            features: ['Strength Gains', 'Power Output', 'Muscle Volume']
          }
        ]);
      }
    };
    
    fetchProductData();
  }, [id]);
  
  // Helper functions for processing product data
  const determineStockLevel = (stockQuantity) => {
    if (stockQuantity > 50) return 'high';
    if (stockQuantity > 10) return 'medium';
    return 'low';
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
  
  // Fallback product data in case API fails
  const getFallbackProduct = (productId) => {
    const fallbackProducts = {
      1: {
        id: 1,
        name: 'Elite Whey Protein',
        category: 'Protein',
        price: 49.99,
        originalPrice: 59.99,
        rating: 4.9,
        reviews: 2847,
        images: [
          getProductImage('Elite Whey Protein'),
          getProductImage('Elite Whey Protein'),
          getProductImage('Elite Whey Protein'),
          getProductImage('Elite Whey Protein')
        ],
        badges: ['Best Seller', 'NSF Certified'],
        description: 'Premium whey protein isolate with 25g protein per serving. Our Elite Whey Protein is sourced from grass-fed cows and undergoes rigorous third-party testing to ensure the highest quality and purity.',
        flavors: ['Vanilla', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
        stock: 'In Stock',
        stockLevel: 'high',
        stockCount: 150,
        features: ['Fast Absorption', 'Muscle Building', 'Post-Workout'],
        nutritionFacts: {
          servingSize: '1 scoop (30g)',
          servingsPerContainer: 30,
          calories: 120,
          protein: '25g',
          carbs: '2g',
          fat: '1g',
          sugar: '1g'
        },
        ingredients: 'Whey Protein Isolate, Natural Flavors, Lecithin, Stevia Extract, Digestive Enzymes',
        directions: 'Mix 1 scoop with 8-10 oz of water or milk. Consume within 30 minutes post-workout for optimal results.',
        benefits: [
          'Supports muscle growth and recovery',
          'Fast-absorbing whey protein isolate',
          'Third-party tested for purity',
          'No artificial fillers or additives',
          'Grass-fed source'
        ]
      },
      2: {
        id: 2,
        name: 'Pre-Workout Ignite',
        category: 'Pre-Workout',
        price: 39.99,
        originalPrice: null,
        rating: 4.8,
        reviews: 1923,
        images: [
          getProductImage('Pre-Workout Ignite'),
          getProductImage('Pre-Workout Ignite'),
          getProductImage('Pre-Workout Ignite')
        ],
        badges: ['High Energy', 'Vegan'],
        description: 'Explosive energy and focus for intense training sessions. Our scientifically formulated pre-workout delivers sustained energy without the crash.',
        flavors: ['Blue Raspberry', 'Fruit Punch', 'Green Apple', 'Watermelon'],
        stock: 'Low Stock',
        stockLevel: 'low',
        stockCount: 8,
        features: ['Energy Boost', 'Focus Enhancement', 'Pump Formula'],
        nutritionFacts: {
          servingSize: '1 scoop (12g)',
          servingsPerContainer: 40,
          calories: 5,
          protein: '0g',
          carbs: '1g',
          fat: '0g',
          sugar: '0g'
        },
        ingredients: 'Caffeine, Beta-Alanine, Citrulline Malate, Taurine, Natural Flavors, Stevia Extract',
        directions: 'Mix 1 scoop with 8-10 oz of water. Consume 20-30 minutes before workout.',
        benefits: [
          'Explosive energy without crash',
          'Enhanced mental focus',
          'Improved blood flow and pumps',
          'Increased endurance',
          'No artificial colors or dyes'
        ]
      }
    };
    
    return fallbackProducts[productId] || fallbackProducts[1];
  };

  // Product data is now fetched from the API in the useEffect

  // If product is still loading, show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // If there was an error loading the product, show error message
  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/products')}>View All Products</Button>
        </div>
      </div>
    );
  }
  
  // If no product was found, show not found message
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/products')}>View All Products</Button>
        </div>
      </div>
    );
  }

  // Reviews data is now defined at the top of the component
  /* Sample reviews data and useEffect for setting reviews have been moved to the top of the component
  const sampleReviews = [
    {
      id: 1,
      name: 'Mike Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing protein powder! Mixes well and tastes great. Definitely noticed improved recovery.',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Chen',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good quality protein. The chocolate flavor is my favorite. Will order again.',
      verified: true
    },
    {
      id: 3,
      name: 'David Rodriguez',
      rating: 5,
      date: '2024-01-08',
      comment: 'Best pre-workout I\'ve tried. Clean energy without the crash. Highly recommend!',
      verified: true
    }
  ];

  // Related products are now fetched from the API in the useEffect
  
  // Always call hooks at the top level, not conditionally
  useEffect(() => {
    // Only set reviews if the component is still mounted
    if (sampleReviews) {
      setReviews(sampleReviews);
    }
  }, []);
  */

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add items to cart",
          variant: "warning",
          className: "bg-yellow-500 text-white border-none"
        });
        return;
      }

      const response = await fetch(`/api/cart/add/${product.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Added ${quantity} x ${product.name} to cart!`,
          variant: "success",
          className: "bg-green-500 text-white border-none"
        });
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      alert('Error adding to cart: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage wishlist",
          variant: "warning",
          className: "bg-yellow-500 text-white border-none"
        });
        return;
      }

      const url = isInWishlist 
        ? `http://localhost:5000/api/wishlist/remove/${product.id}` 
        : `http://localhost:5000/api/wishlist/add/${product.id}`;
      const method = isInWishlist ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        toast({
          title: "Success",
          description: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
          variant: "success"
        });
      } else if (response.status === 409) {
        toast({
          title: "Already in Wishlist",
          description: "This product is already in your wishlist",
          variant: "warning"
        });
      } else {
        throw new Error('Failed to update wishlist');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                onClick={() => setIsImageZoomed(true)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setIsImageZoomed(true)}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              {/* Navigation arrows for main image */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageNavigation('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageNavigation('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer border-2 transition-all ${
                    selectedImageIndex === index ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Zoom Modal */}
          {isImageZoomed && (
            <div className="fixed inset-0 bg-amber-900/90 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl max-h-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setIsImageZoomed(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Title and Category */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <CheckCircle className={`w-5 h-5 ${product.stockLevel === 'high' ? 'text-green-500' : 'text-yellow-500'}`} />
              <span className={`font-medium ${product.stockLevel === 'high' ? 'text-green-600' : 'text-yellow-600'}`}>
                {product.stock} ({product.stockCount} units available)
              </span>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="border-primary text-primary">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Flavor Selection */}
            <div>
              <h3 className="font-semibold mb-3">Available Flavors:</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.flavors.map((flavor, index) => (
                  <Button
                    key={index}
                    variant={selectedFlavor === index ? "default" : "outline"}
                    onClick={() => setSelectedFlavor(index)}
                    className="justify-start"
                  >
                    {flavor}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleToggleWishlist}
                  disabled={loading}
                  className={isInWishlist ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Orders over $75</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">Money back guarantee</p>
              </div>
              <div className="text-center">
                <Phone className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Expert assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {['description', 'nutrition', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'nutrition' ? 'Nutrition Facts' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Product Benefits</h3>
                  {product.product_benefits ? (
                    <div className="text-muted-foreground whitespace-pre-line">{product.product_benefits}</div>
                  ) : (
                    <ul className="space-y-2">
                      {(product.benefits || []).map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Directions</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.directions || product.directions || "No directions available for this product."}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.ingredients || product.ingredients || "No ingredients information available for this product."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="max-w-md">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Nutrition Facts</h3>
                    {(() => {
                      // Traiter les nutrition_facts pour l'affichage
                      let nutritionData = {};
                      
                      if (product.nutrition_facts) {
                        try {
                          // Si c'est une chaîne, on essaie de la parser
                          if (typeof product.nutrition_facts === 'string') {
                            nutritionData = JSON.parse(product.nutrition_facts);
                          } else {
                            // Sinon on utilise l'objet tel quel
                            nutritionData = product.nutrition_facts;
                          }
                        } catch (error) {
                          console.error('Erreur lors du parsing des nutrition facts:', error);
                          // En cas d'erreur, on utilise un objet vide
                          nutritionData = {};
                        }
                      } else if (product.nutritionFacts) {
                        // Compatibilité avec l'ancien format
                        nutritionData = product.nutritionFacts;
                      }
                      
                      // Si nous avons des données à afficher
                      if (Object.keys(nutritionData).length > 0) {
                        return (
                          <div className="space-y-3">
                            {Object.entries(nutritionData).map(([key, value]) => (
                              <div key={key} className="flex justify-between border-b pb-2">
                                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        // Valeurs par défaut si aucune donnée n'est disponible
                        return (
                          <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2">
                              <span className="font-medium">Serving Size</span>
                              <span>{product.nutritionFacts?.servingSize || "1 scoop (30g)"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                              <span className="font-medium">Servings Per Container</span>
                              <span>{product.nutritionFacts?.servingsPerContainer || "30"}</span>
                            </div>
                          </div>
                        );
                      }
                    })()} 
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold">{product.rating}</div>
                  <div>
                    <div className="flex">{renderStars(product.rating)}</div>
                    <p className="text-muted-foreground">{product.reviews.toLocaleString()} reviews</p>
                  </div>
                </div>
                
                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold">{review.name}</h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {relatedProduct.badges.slice(0, 2).map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">{renderStars(relatedProduct.rating)}</div>
                      <span className="text-sm text-muted-foreground">
                        ({relatedProduct.reviews})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">${relatedProduct.price}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
