import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ArrowUpDown,
  X,
  CheckCircle,
  Target
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

const AllProducts = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get URL parameters for filtering
  const location = useLocation();
  const [isRecommended, setIsRecommended] = useState(false);
  const [recommendedProgram, setRecommendedProgram] = useState('');
  
  // Récupérer les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const products = await response.json();
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/categories');
        if (response.ok) {
          const cats = await response.json();
          setCategories(cats);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories:', err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);
  
  // Handle URL parameters for filtering
  useEffect(() => {
    // Parse URL search params
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    const recommendedParam = searchParams.get('recommended');
    const programParam = searchParams.get('program');
    
    // If category param exists and is in our categories list, set it as selected
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }

    // Check if these are recommended products from the quiz
    if (recommendedParam === 'true') {
      setIsRecommended(true);
      if (programParam) {
        setRecommendedProgram(decodeURIComponent(programParam));
      }
    } else {
      setIsRecommended(false);
      setRecommendedProgram('');
    }
  }, [location.search, categories]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceRange, sortBy, allProducts]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  
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

  const ProductCard = ({ product, isListView = false }) => (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isListView ? 'flex' : ''}`} onClick={() => handleProductClick(product.id)}>
      <CardContent className={`p-4 ${isListView ? 'flex gap-4 w-full' : ''}`}>
        {/* Product Image */}
        <div className={`relative mb-4 ${isListView ? 'w-32 h-32 flex-shrink-0' : ''}`}>
          <img
            src={getProductImage(product.name)}
            alt={product.name}
            className={`w-full h-48 object-cover rounded-lg ${isListView ? 'w-32 h-32' : ''}`}
          />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.featured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            {product.stock_quantity <= product.low_stock_threshold && (
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className={`${isListView ? 'flex-1' : ''}`}>
          <div className="mb-2">
            <h3 className={`font-semibold ${isListView ? 'text-lg' : 'text-base'} mb-1`}>
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold">${product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.original_price}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.review_count || 0})
            </span>
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            <span className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              disabled={product.stock_quantity <= 0}
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic here
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product.id);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Erreur: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
               <span className="gold-black-motion">All Products</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our complete range of premium athletic nutrition supplements
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Recommended Products Banner */}
        {isRecommended && (
          <div className="mb-8 bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{recommendedProgram}</h2>
            <p className="text-lg mb-4">Here are your personalized product recommendations based on your quiz results</p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-sm bg-primary/5 border-primary/30">
                <CheckCircle className="w-4 h-4 mr-2" />
                Personalized Selection
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm bg-primary/5 border-primary/30">
                <Target className="w-4 h-4 mr-2" />
                Goal-Specific
              </Badge>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    All Categories
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} products
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-6'
            }>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isListView={viewMode === 'list'} 
                />
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 200]);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
