import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  Eye,
  Star
} from 'lucide-react';

// Import article and author images
import article1 from '@/assets/article-1.svg';
import article2 from '@/assets/article-2.svg';
import article3 from '@/assets/article-3.svg';
import author1 from '@/assets/author-1.svg';
import author2 from '@/assets/author-2.svg';
import author3 from '@/assets/author-3.svg';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample articles data - in a real app, this would come from an API
  const articles = [
    {
      id: 1,
      title: 'The Science Behind Creatine: Why Every Athlete Needs It',
      excerpt: 'Discover the research-backed benefits of creatine supplementation and how it can enhance your athletic performance.',
      content: `
        <p>Creatine is one of the most researched supplements in sports nutrition, with over 500 studies demonstrating its effectiveness for improving strength, power, and muscle mass.</p>
        
        <h2>What is Creatine?</h2>
        <p>Creatine is a naturally occurring compound found in muscle cells that helps produce energy during high-intensity exercise. It's particularly effective for activities that require short bursts of intense effort, such as weightlifting, sprinting, and jumping.</p>
        
        <h2>How Does Creatine Work?</h2>
        <p>Creatine works by increasing the availability of phosphocreatine in your muscles, which helps regenerate ATP (adenosine triphosphate) - the primary energy source for muscle contractions. This allows you to perform more work during high-intensity exercise and recover faster between sets.</p>
        
        <h2>Benefits of Creatine Supplementation</h2>
        <ul>
          <li><strong>Increased Strength:</strong> Studies show 5-15% improvements in strength performance</li>
          <li><strong>Enhanced Power Output:</strong> Better performance in explosive movements</li>
          <li><strong>Muscle Mass Gains:</strong> 2-5 pounds of lean muscle mass in the first month</li>
          <li><strong>Improved Recovery:</strong> Faster recovery between high-intensity bouts</li>
          <li><strong>Brain Function:</strong> May improve cognitive performance and reduce mental fatigue</li>
        </ul>
        
        <h2>Dosage and Timing</h2>
        <p>The most effective protocol is a loading phase of 20g per day (split into 4 doses) for 5-7 days, followed by a maintenance dose of 3-5g per day. Timing is flexible - you can take it before or after your workout, or at any time during the day.</p>
        
        <h2>Safety and Side Effects</h2>
        <p>Creatine is one of the safest supplements available, with no serious side effects reported in healthy individuals. Some people may experience minor gastrointestinal discomfort during the loading phase, which can be minimized by taking smaller doses throughout the day.</p>
        
        <h2>Conclusion</h2>
        <p>Creatine supplementation is a safe, effective, and well-researched way to improve athletic performance. Whether you're a strength athlete, endurance athlete, or just looking to improve your overall fitness, creatine can be a valuable addition to your supplement regimen.</p>
      `,
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
      content: `
        <p>The timing of your pre-workout supplement can make or break your training session. Understanding when and how much to take is crucial for maximizing the benefits while minimizing potential side effects.</p>
        
        <h2>Optimal Timing</h2>
        <p>Most pre-workout supplements should be taken 20-30 minutes before your workout. This allows enough time for the ingredients to be absorbed and reach peak effectiveness when you start training.</p>
        
        <h2>Key Ingredients and Their Timing</h2>
        <ul>
          <li><strong>Caffeine:</strong> Takes 15-45 minutes to peak, lasts 3-6 hours</li>
          <li><strong>Creatine:</strong> Can be taken anytime, timing doesn't matter</li>
          <li><strong>Beta-Alanine:</strong> Takes 30-60 minutes to peak</li>
          <li><strong>Citrulline Malate:</strong> Takes 30-60 minutes to peak</li>
        </ul>
        
        <h2>Dosage Guidelines</h2>
        <p>Start with half the recommended dose to assess tolerance, then gradually increase to the full dose. Never exceed the recommended dosage, and always read the label carefully.</p>
      `,
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
      content: `
        <p>Recovery is where the magic happens. Without proper recovery nutrition, all your hard work in the gym goes to waste. Understanding the recovery window and what to eat can dramatically improve your results.</p>
        
        <h2>The Anabolic Window</h2>
        <p>The 30-60 minutes after your workout is often called the "anabolic window" - a period when your muscles are most receptive to nutrients for repair and growth.</p>
        
        <h2>What to Eat Post-Workout</h2>
        <ul>
          <li><strong>Protein:</strong> 20-30g of high-quality protein</li>
          <li><strong>Carbohydrates:</strong> 30-60g to replenish glycogen</li>
          <li><strong>Fluids:</strong> Rehydrate with water or electrolyte drinks</li>
        </ul>
        
        <h2>Timing Matters</h2>
        <p>While the anabolic window isn't as narrow as once thought, consuming nutrients within 2 hours of your workout is still beneficial for optimal recovery and muscle growth.</p>
      `,
      author: 'Dr. James Chen',
      authorImage: author3,
      category: 'Recovery',
      readTime: '10 min read',
      publishDate: '2024-01-10',
      image: article3,
      tags: ['Recovery', 'Nutrition', 'Post-Workout'],
      featured: true,
      views: 18750
    }
  ];

  const article = articles.find(a => a.id === parseInt(id));

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/articles')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/articles')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{article.category}</Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{article.readTime}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{article.views.toLocaleString()} views</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              {article.excerpt}
            </p>
            
            <div className="flex items-center gap-4">
              <img
                src={article.authorImage}
                alt={article.author}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium">{article.author}</p>
                <p className="text-sm text-muted-foreground">{formatDate(article.publishDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <div className="relative h-64 md:h-96 overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Article Actions */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Button className="w-full" variant="outline">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save Article
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Article Stats */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Article Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(article.publishDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Related Articles</h3>
                    <div className="space-y-3">
                      {articles
                        .filter(a => a.id !== article.id && a.category === article.category)
                        .slice(0, 3)
                        .map((relatedArticle) => (
                          <div 
                            key={relatedArticle.id}
                            className="cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                            onClick={() => navigate(`/article/${relatedArticle.id}`)}
                          >
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              {relatedArticle.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{relatedArticle.readTime}</span>
                              <span>•</span>
                              <span>{relatedArticle.views.toLocaleString()} views</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

