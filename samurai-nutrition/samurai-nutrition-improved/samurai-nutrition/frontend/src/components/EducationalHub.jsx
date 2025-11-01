import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  BookOpen, 
  Play, 
  Clock, 
  User, 
  ArrowRight,
  Beaker,
  Brain,
  Dumbbell,
  Heart,
  Search,
  Filter
} from 'lucide-react';

// Import article images
import article1 from '@/assets/article-1.svg';
import article2 from '@/assets/article-2.svg';
import article3 from '@/assets/article-3.svg';

const EducationalHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('articles');

  const articles = [
    {
      id: 1,
      title: 'The Science Behind Creatine: Why Every Athlete Needs It',
      excerpt: 'Discover the research-backed benefits of creatine supplementation and how it can enhance your athletic performance.',
      category: 'Science',
      author: 'Dr. Sarah Mitchell',
      readTime: '8 min read',
      publishDate: '2 days ago',
      image: article1,
      tags: ['Creatine', 'Performance', 'Research']
    },
    {
      id: 2,
      title: 'Pre-Workout Timing: When and How Much to Take',
      excerpt: 'Learn the optimal timing and dosage for pre-workout supplements to maximize your training intensity.',
      category: 'Training',
      author: 'Marcus Johnson',
      readTime: '6 min read',
      publishDate: '5 days ago',
      image: article2,
      tags: ['Pre-Workout', 'Timing', 'Dosage']
    },
    {
      id: 3,
      title: 'Recovery Nutrition: The Key to Consistent Progress',
      excerpt: 'Understanding the importance of post-workout nutrition and how to optimize your recovery window.',
      category: 'Recovery',
      author: 'Dr. James Chen',
      readTime: '10 min read',
      publishDate: '1 week ago',
      image: article3,
      tags: ['Recovery', 'Nutrition', 'Post-Workout']
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Supplement Stack for Beginners',
      description: 'Learn how to build an effective supplement stack for your fitness goals.',
      duration: '12:34',
      thumbnail: article1,
      category: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced Training Techniques',
      description: 'Master advanced training techniques to break through plateaus.',
      duration: '18:45',
      thumbnail: article3,
      category: 'Advanced'
    },
    {
      id: 3,
      title: 'Nutrition for Muscle Building',
      description: 'Complete guide to nutrition for optimal muscle growth.',
      duration: '15:20',
      thumbnail: article2,
      category: 'Nutrition'
    }
  ];

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const handleViewAllArticles = () => {
    navigate('/articles');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Science': 'bg-blue-500 text-white',
      'Training': 'bg-green-500 text-white',
      'Recovery': 'bg-purple-500 text-white',
      'Nutrition': 'bg-orange-500 text-white',
      'Beginner': 'bg-blue-500 text-white',
      'Advanced': 'bg-red-500 text-white'
    };
    return colors[category] || 'bg-gray-500 text-white';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Science': <Beaker className="w-3 h-3" />,
      'Training': <Dumbbell className="w-3 h-3" />,
      'Recovery': <Heart className="w-3 h-3" />,
      'Nutrition': <Brain className="w-3 h-3" />,
      'Beginner': <BookOpen className="w-3 h-3" />,
      'Advanced': <Dumbbell className="w-3 h-3" />
    };
    return icons[category] || <BookOpen className="w-3 h-3" />;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 japanese-pattern">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Knowledge <span className="gold-black-motion">Hub</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Expert insights, research-backed articles, and comprehensive guides to optimize your nutrition and performance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'articles'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-blue-100 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Articles
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-blue-100 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Play className="w-4 h-4" />
              Videos
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div className="space-y-8">
              {/* Featured Article */}
              <Card className="overflow-hidden hover-lift bg-card/80 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto">
                    <img 
                      src={articles[0].image} 
                      alt={articles[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:hidden"></div>
                    <Badge className={`absolute top-4 left-4 ${getCategoryColor(articles[0].category)} flex items-center gap-1`}>
                      {getCategoryIcon(articles[0].category)}
                      {articles[0].category}
                    </Badge>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4 bg-primary text-primary-foreground">
                      Featured Article
                    </Badge>
                    <h3 
                      className="text-2xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => handleArticleClick(articles[0].id)}
                    >
                      {articles[0].title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {articles[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {articles[0].author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {articles[0].readTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {articles[0].tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-fit group"
                      onClick={() => handleArticleClick(articles[0].id)}
                    >
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </div>
              </Card>

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.slice(1).map((article) => (
                  <Card key={article.id} className="group hover-lift overflow-hidden bg-card/60 backdrop-blur-sm cursor-pointer" onClick={() => handleArticleClick(article.id)}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <Badge className={`absolute top-4 left-4 ${getCategoryColor(article.category)} flex items-center gap-1`}>
                        {getCategoryIcon(article.category)}
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArticleClick(article.id);
                        }}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* View All Articles Button */}
              <div className="text-center pt-8">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={handleViewAllArticles}
                >
                  View All Articles
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <Card key={video.id} className="group hover-lift overflow-hidden bg-card/60 backdrop-blur-sm cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-amber-700/40 group-hover:bg-amber-700/20 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <Badge className={`absolute top-4 left-4 ${getCategoryColor(video.category)} flex items-center gap-1`}>
                        {getCategoryIcon(video.category)}
                        {video.category}
                      </Badge>
                      <Badge variant="secondary" className="absolute bottom-4 right-4 bg-amber-700/60 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {video.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationalHub;

