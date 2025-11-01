import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dumbbell, 
  Zap, 
  Heart, 
  Target, 
  ArrowRight,
  Flame,
  Shield,
  Trophy,
  CheckCircle,
  X
} from 'lucide-react';
import { SeasonalHoverCards } from '@/components/lightswind/seasonal-hover-cards';

// Import local images
import buildStrengthImg from '@/assets/build-strength.jpg';
import boostEnduranceImg from '@/assets/boost-endurance.jpg';
import recoveryImg from '@/assets/recovery.jpg';

const ProductCategories = () => {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Quiz questions
  const quizQuestions = [
    {
      question: "What is your main training goal?",
      options: [
        { text: "Build muscle mass", value: "strength" },
        { text: "Improve endurance", value: "endurance" },
        { text: "Optimize recovery", value: "recovery" },
        { text: "Lose weight", value: "weight-loss" }
      ]
    },
    {
      question: "How often do you train?",
      options: [
        { text: "1-2 times per week", value: "low" },
        { text: "3-4 times per week", value: "medium" },
        { text: "5+ times per week", value: "high" },
        { text: "I'm just starting out", value: "beginner" }
      ]
    },
    {
      question: "Do you have any dietary restrictions?",
      options: [
        { text: "Vegetarian/Vegan", value: "plant-based" },
        { text: "Lactose-free", value: "lactose-free" },
        { text: "Gluten-free", value: "gluten-free" },
        { text: "No restrictions", value: "none" }
      ]
    }
  ];

  // Handle answer selection
  const handleAnswerSelect = (answerValue) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerValue;
    setAnswers(newAnswers);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  // Get product recommendations based on answers
  const getRecommendations = () => {
    // Simple recommendation logic based on first answer (primary goal)
    const primaryGoal = answers[0];
    
    if (primaryGoal === 'strength') {
      return {
        title: 'Muscle Building Program',
        products: ['Whey Protein Isolate', 'Creatine Monohydrate', 'BCAA'],
        category: 'Protein'
      };
    } else if (primaryGoal === 'endurance') {
      return {
        title: 'Endurance Program',
        products: ['Pre-Workout Energy', 'Electrolyte Formula', 'Beta-Alanine'],
        category: 'Pre-Workout'
      };
    } else if (primaryGoal === 'recovery') {
      return {
        title: 'Optimal Recovery Program',
        products: ['Post-Workout Recovery', 'ZMA Sleep Formula', 'Collagen Peptides'],
        category: 'Recovery'
      };
    } else {
      return {
        title: 'Weight Loss Program',
        products: ['Thermogenic Formula', 'CLA', 'Protein Isolate Low-Carb'],
        category: 'Weight-Management'
      };
    }
  };
  
  // Format categories for SeasonalHoverCards - using local images for strength, endurance and recovery categories
  const seasonalCards = [
    {
      title: 'Build Strength',
      subtitle: 'Whey Protein • Creatine Monohydrate',
      description: 'Premium protein powders, creatine, and mass gainers for serious muscle building',
      imageSrc: buildStrengthImg,
      imageAlt: 'Build Strength - Muscle building supplements',
      category: 'Protein' // Category name that matches backend category
    },
    {
      title: 'Boost Endurance',
      subtitle: 'Pre-Workout • Energy Drinks',
      description: 'High-performance pre-workouts and energy supplements for peak performance',
      imageSrc: boostEnduranceImg,
      imageAlt: 'Boost Endurance - Performance supplements',
      category: 'Pre-Workout' // Category name that matches backend category
    },
    {
      title: 'Optimize Recovery',
      subtitle: 'Post-Workout • Sleep Support',
      description: 'Advanced recovery formulas to reduce fatigue and enhance muscle repair',
      imageSrc: recoveryImg,
      imageAlt: 'Optimize Recovery - Recovery supplements',
      category: 'Recovery' // Category name that matches backend category
    }
  ]

  const featuredCollections = [
    {
      title: 'Athlete Endorsed',
      description: 'Products trusted by professional athletes',
      icon: Trophy,
      count: '25+ Products'
    },
    {
      title: 'New Arrivals',
      description: 'Latest innovations in sports nutrition',
      icon: Flame,
      count: '12 New Items'
    },
    {
      title: 'Certified Safe',
      description: 'NSF and third-party tested supplements',
      icon: Shield,
      count: '100% Tested'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Shop by <span className="gold-black-motion">Goal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect supplements tailored to your specific fitness objectives and training goals
          </p>
        </div>

        {/* Seasonal Hover Cards for Main Categories */}
        <div className="mb-16">
          <SeasonalHoverCards 
            cards={seasonalCards} 
            className="mb-8" 
            onCardClick={(card) => {
              // Navigate to products page with the selected category
              navigate(`/products?category=${card.category}`);
            }}
          />
          
          {/* Shop Now Button */}
          <div className="flex justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gold-border-animation" 
              onClick={() => navigate("/products")}
            >
              Shop All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Featured Collections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCollections.map((collection, index) => (
            <Card key={index} className="group hover-lift bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <collection.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{collection.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{collection.description}</p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {collection.count}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            {!showQuiz && !showResults && (
              <>
                <h3 className="text-2xl font-bold mb-4">Not Sure Where to Start?</h3>
                <p className="text-muted-foreground mb-6">
                  Take our personalized quiz to get recommendations tailored to your goals
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gold-border-animation"
                  onClick={() => setShowQuiz(true)}
                >
                  Start Quiz
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </>
            )}

            {showQuiz && !showResults && (
              <div className="quiz-container">
                <h3 className="text-2xl font-bold mb-6">{quizQuestions[currentQuestion].question}</h3>
                <div className="progress-bar mb-6 bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300" 
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="p-4 h-auto text-left flex justify-between items-center hover:bg-primary/10 hover:text-primary transition-all"
                      onClick={() => handleAnswerSelect(option.value)}
                    >
                      <span>{option.text}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : setShowQuiz(false)}
                  >
                    Back
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </div>
                </div>
              </div>
            )}

            {showResults && (
              <div className="results-container">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-500 w-8 h-8 mr-2" />
                  <h3 className="text-2xl font-bold">Your Results</h3>
                </div>
                
                <div className="bg-card p-6 rounded-xl mb-6 shadow-sm">
                  <h4 className="text-xl font-semibold mb-4">{getRecommendations().title}</h4>
                  <p className="text-muted-foreground mb-4">Based on your answers, we recommend these products:</p>
                  
                  <ul className="space-y-2 mb-6">
                    {getRecommendations().products.map((product, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="text-primary w-5 h-5 mr-2" />
                        <span>{product}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gold-border-animation"
                      onClick={() => navigate(`/products?category=${getRecommendations().category}&recommended=true&program=${encodeURIComponent(getRecommendations().title)}`)}
                    >
                      View Recommended Products
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={resetQuiz}
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;

