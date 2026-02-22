import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Filter,
  BookOpen,
  TrendingUp,
  Star
} from 'lucide-react';

// Import article and author images
import article1 from '@/assets/article-1.svg';
import article2 from '@/assets/article-2.svg';
import article3 from '@/assets/article-3.svg';
import author1 from '@/assets/author-1.svg';
import author2 from '@/assets/author-2.svg';
import author3 from '@/assets/author-3.svg';

const Articles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Sample articles data - in a real app, this would come from a CMS or API
  const articles = [
    {
      id: 1,
      title: 'The Science Behind Creatine: Why Every Athlete Needs It',
      excerpt: 'Discover the research-backed benefits of creatine supplementation and how it can enhance your athletic performance.',
      content: 'Creatine is one of the most researched supplements in sports nutrition...',
      author: 'Dr. Sarah Mitchell',
      authorImage: author1,
      category: 'Science',
      readTime: '8 min read',
      publishDate: '2024-01-15',
      image: article1,
      tags: ['Creatine', 'Performance', 'Research'],
      featured: true,
      views: 15420
    },
    {
      id: 2,
      title: 'Pre-Workout Timing: When and How Much to Take',
      excerpt: 'Learn the optimal timing and dosage for pre-workout supplements to maximize your training intensity.',
      content: 'The timing of your pre-workout supplement can make or break your training session...',
      author: 'Marcus Johnson',
      authorImage: author2,
      category: 'Training',
      readTime: '6 min read',
      publishDate: '2024-01-12',
      image: article2,
      tags: ['Pre-Workout', 'Timing', 'Performance'],
      featured: false,
      views: 12350
    },
    {
      id: 3,
      title: 'Recovery Nutrition: The Key to Consistent Progress',
      excerpt: 'Understanding the importance of post-workout nutrition and how to optimize your recovery window.',
      content: 'Recovery is where the magic happens. Without proper recovery nutrition...',
      author: 'Dr. James Chen',
      authorImage: author3,
      category: 'Recovery',
      readTime: '10 min read',
      publishDate: '2024-01-10',
      image: article3,
      tags: ['Recovery', 'Nutrition', 'Post-Workout'],
      featured: true,
      views: 18750
    },
    {
      id: 4,
      title: 'Protein Powder Guide: Whey vs Casein vs Plant-Based',
      excerpt: 'A comprehensive comparison of different protein types to help you choose the right one for your goals.',
      content: 'Not all proteins are created equal. Understanding the differences...',
      author: 'Dr. Sarah Mitchell',
      authorImage: author1,
      category: 'Nutrition',
      readTime: '12 min read',
      publishDate: '2024-01-08',
      image: article3,
      tags: ['Protein', 'Whey', 'Casein', 'Plant-Based'],
      featured: false,
      views: 9840
    },
    {
      id: 5,
      title: 'Fat Loss Supplements: What Actually Works?',
      excerpt: 'Separating fact from fiction in the world of fat loss supplements with evidence-based analysis.',
      content: 'The fat loss supplement industry is filled with bold claims...',
      author: 'Dr. Lisa Rodriguez',
      authorImage: author3,
      category: 'Weight Loss',
      readTime: '9 min read',
      publishDate: '2024-01-05',
      image: article2,
      tags: ['Fat Loss', 'Supplements', 'Evidence'],
      featured: false,
      views: 11200
    },
    {
      id: 6,
      title: 'BCAAs vs EAAs: Which Amino Acids Do You Really Need?',
      excerpt: 'A detailed breakdown of branched-chain amino acids versus essential amino acids for muscle building.',
      content: 'Amino acids are the building blocks of protein and muscle...',
      author: 'Dr. Michael Thompson',
      authorImage: author2,
      category: 'Science',
      readTime: '7 min read',
      publishDate: '2024-01-03',
      image: article1,
      tags: ['BCAAs', 'EAAs', 'Amino Acids', 'Muscle Building'],
      featured: false,
      views: 8760
    }
  ];

  // Filter articles based on search and category
  React.useEffect(() => {
    let filtered = [...articles];

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const categories = [
    { id: 'all', name: 'All Articles', count: articles.length },
    { id: 'Science', name: 'Science', count: articles.filter(a => a.category === 'Science').length },
    { id: 'Training', name: 'Training', count: articles.filter(a => a.category === 'Training').length },
    { id: 'Recovery', name: 'Recovery', count: articles.filter(a => a.category === 'Recovery').length },
    { id: 'Nutrition', name: 'Nutrition', count: articles.filter(a => a.category === 'Nutrition').length },
    { id: 'Weight Loss', name: 'Weight Loss', count: articles.filter(a => a.category === 'Weight Loss').length }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gold-black-motion">Educational Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert insights, research-backed articles, and practical tips for your fitness journey
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-3">Search Articles</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Stats */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Hub Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>{articles.length} Articles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>{articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()} Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>{articles.filter(a => a.featured).length} Featured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Articles */}
            {selectedCategory === 'all' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.filter(article => article.featured).map((article) => (
                    <Card key={article.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => handleArticleClick(article.id)}>
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{article.readTime}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={article.authorImage}
                              alt={article.author}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm font-medium">{article.author}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory} Articles`}
              </h2>
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => handleArticleClick(article.id)}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-48 lg:h-32 flex-shrink-0">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-32 lg:h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{article.readTime}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{article.views.toLocaleString()} views</span>
                          </div>
                          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={article.authorImage}
                                alt={article.author}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium">{article.author}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(article.publishDate)}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
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
    </div>
  );
};

export default Articles;

