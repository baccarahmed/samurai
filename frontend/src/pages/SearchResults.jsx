import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  SlidersHorizontal
} from 'lucide-react';

// Import product images
import proteinImage from '@/assets/Elite Whey Protein.jpg';
import preworkoutImage from '@/assets/Pre-Workout Ignite.jpg';
import bcaaImage from '@/assets/BCAA Complex.jpg';
import creatineImage from '@/assets/Creatine Monohydrate.jpg';
import fatBurnerImage from '@/assets/Thermogenic Fat Burner.jpg';
import multivitaminImage from '@/assets/Daily Multivitamin.jpg';

const SearchResults = ({ searchQuery, onBack, onProductClick }) => {
  const [currentQuery, setCurrentQuery] = useState(searchQuery || '');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');

  // Sample product database - in a real app, this would come from an API
  const allProducts = [
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
      keywords: ['protein', 'whey', 'muscle', 'building', 'post-workout', 'isolate']
    },
    {
      id: 2,
      name: 'Pre-Workout Ignite',
      category: 'Pre-Workout',
      price: 39.99,
      rating: 4.8,
      reviews: 1923,
      image: preworkoutImage,
      badges: ['High Energy', 'Vegan'],
      description: 'Explosive energy and focus for intense training sessions',
      keywords: ['pre-workout', 'energy', 'focus', 'caffeine', 'performance', 'training']
    },
    {
      id: 3,
      name: 'Recovery Matrix',
      category: 'Recovery',
      price: 34.99,
      rating: 4.7,
      reviews: 1456,
      image: bcaaImage,
      badges: ['New', 'Athlete Choice'],
      description: 'Advanced recovery formula with BCAAs and glutamine',
      keywords: ['recovery', 'bcaa', 'glutamine', 'post-workout', 'muscle', 'repair']
    },
    {
      id: 4,
      name: 'Creatine Monohydrate',
      category: 'Strength',
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.9,
      reviews: 3421,
      image: creatineImage,
      badges: ['Pure', 'Tested'],
      description: 'Micronized creatine monohydrate for strength and power',
      keywords: ['creatine', 'strength', 'power', 'muscle', 'performance', 'monohydrate']
    },
    {
      id: 5,
      name: 'Fat Burner Extreme',
      category: 'Weight Management',
      price: 44.99,
      rating: 4.6,
      reviews: 892,
      image: fatBurnerImage,
      badges: ['Thermogenic'],
      description: 'Advanced thermogenic formula for weight management',
      keywords: ['fat burner', 'weight loss', 'thermogenic', 'metabolism', 'diet']
    },
    {
      id: 6,
      name: 'Multivitamin Elite',
      category: 'Health',
      price: 29.99,
      rating: 4.5,
      reviews: 1234,
      image: multivitaminImage,
      badges: ['Daily Essential'],
      description: 'Complete multivitamin for active individuals',
      keywords: ['multivitamin', 'vitamins', 'minerals', 'health', 'daily', 'essential']
    }
  ];

  const categories = ['all', 'Protein', 'Pre-Workout', 'Recovery', 'Strength', 'Weight Management', 'Health'];

  useEffect(() => {
    performSearch(currentQuery);
  }, [currentQuery, sortBy, filterCategory]);

  const performSearch = (query) => {
    let results = allProducts;

    // Filter by search query
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(product => {
        const searchableText = [
          product.name,
          product.category,
          product.description,
          ...product.keywords
        ].join(' ').toLowerCase();

        return searchTerms.some(term => searchableText.includes(term));
      });
    }

    // Filter by category
    if (filterCategory !== 'all') {
      results = results.filter(product => product.category === filterCategory);
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(results);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(currentQuery);
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
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">
            Search Results
            {currentQuery && (
              <span className="text-muted-foreground ml-2">
                for "{currentQuery}"
              </span>
            )}
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="Search for supplements, categories, or ingredients..." 
              className="pl-12 pr-4 py-3 text-lg"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Category:</span>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border rounded-md bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md bg-background"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {currentQuery && ` for "${currentQuery}"`}
          </p>
        </div>

        {/* Results Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group hover-lift overflow-hidden border-0 shadow-lg bg-card/80 backdrop-blur-sm relative cursor-pointer"
                onClick={() => onProductClick && onProductClick(product.id)}
              >
                {/* Product Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.badges.map((badge, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="text-xs bg-primary text-primary-foreground"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <Badge className="absolute bottom-3 left-3 bg-red-500 text-white">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
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

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-primary">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No products found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any products matching your search. Try adjusting your search terms or browse our categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setCurrentQuery('')} variant="outline">
                Clear Search
              </Button>
              <Button onClick={() => setFilterCategory('all')}>
                View All Products
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
