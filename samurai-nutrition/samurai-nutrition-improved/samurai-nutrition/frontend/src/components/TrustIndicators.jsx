import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Award, 
  Users, 
  Star,
  CheckCircle,
  Truck,
  RefreshCw,
  Phone,
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Import testimonial images
import testimonialJennifer from '@/assets/testimonial-jennifer.svg';
import testimonialMichael from '@/assets/testimonial-michael.svg';
import testimonialSarah from '@/assets/testimonial-sarah.svg';
import testimonialDavid from '@/assets/testimonial-david.svg';

const TrustIndicators = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const guarantees = [
    {
      icon: Shield,
      title: '100% Money-Back Guarantee',
      description: 'Not satisfied? Get a full refund within 30 days, no questions asked.',
      color: 'text-green-500'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $75. Fast delivery nationwide.',
      color: 'text-amber-500'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: 'Simple return process with prepaid shipping labels included.',
      color: 'text-purple-500'
    },
    {
      icon: Phone,
      title: '24/7 Expert Support',
      description: 'Certified nutrition specialists available around the clock.',
      color: 'text-orange-500'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Jennifer Martinez',
      role: 'Fitness Enthusiast',
      location: 'Miami, FL',
      rating: 5,
      text: "I've tried countless supplement brands, but SAMURAï Nutrition is in a league of its own. The quality is exceptional, and I've seen real results in my training. The customer service is also top-notch!",
      image: testimonialJennifer,
      verified: true,
      product: 'Elite Whey Protein'
    },
    {
      id: 2,
      name: 'Michael Thompson',
      role: 'Personal Trainer',
      location: 'Austin, TX',
      rating: 5,
      text: "As a personal trainer, I recommend SAMURAï to all my clients. The transparency in ingredients and third-party testing gives me confidence. My clients love the taste and see amazing results.",
      image: testimonialMichael,
      verified: true,
      product: 'Pre-Workout Ignite'
    },
    {
      id: 3,
      name: 'Sarah Kim',
      role: 'Marathon Runner',
      location: 'Seattle, WA',
      rating: 5,
      text: "The recovery supplements have been game-changing for my marathon training. I recover faster and feel stronger for each training session. Plus, the shipping is always super fast!",
      image: testimonialSarah,
      verified: true,
      product: 'Recovery Matrix'
    },
    {
      id: 4,
      name: 'David Chen',
      role: 'Bodybuilder',
      location: 'Los Angeles, CA',
      rating: 5,
      text: "The protein quality is unmatched. I've been using SAMURAï for over a year now and the consistency in quality and taste keeps me coming back. Highly recommend to serious athletes.",
      image: testimonialDavid,
      verified: true,
      product: 'Elite Whey Protein'
    }
  ];

  const stats = [
    {
      number: '50,000+',
      label: 'Happy Customers',
      icon: Users
    },
    {
      number: '4.9/5',
      label: 'Average Rating',
      icon: Star
    },
    {
      number: '98%',
      label: 'Satisfaction Rate',
      icon: CheckCircle
    },
    {
      number: '500+',
      label: 'Five-Star Reviews',
      icon: Award
    }
  ];

  const certifications = [
    {
      name: 'NSF Certified',
      description: 'Third-party tested for purity and potency',
      logo: 'NSF'
    },
    {
      name: 'GMP Certified',
      description: 'Good Manufacturing Practices certified',
      logo: 'GMP'
    },
    {
      name: 'FDA Registered',
      description: 'Manufactured in FDA registered facilities',
      logo: 'FDA'
    },
    {
      name: 'Informed Sport',
      description: 'Tested for banned substances',
      logo: 'IS'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by <span className="gold-black-motion">Athletes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SAMURAï Nutrition for their performance goals
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="relative">
                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={prevTestimonial}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={nextTestimonial}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Testimonial Content */}
                <div className="text-center">
                  <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
                  
                  <blockquote className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed mb-8">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <img 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-lg">{testimonials[currentTestimonial].name}</h4>
                        {testimonials[currentTestimonial].verified && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 text-yellow-400 fill-current" 
                        />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Verified Purchase: {testimonials[currentTestimonial].product}
                    </Badge>
                  </div>
                </div>

                {/* Testimonial Indicators */}
                <div className="flex justify-center space-x-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentTestimonial 
                          ? 'bg-primary w-8' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {guarantees.map((guarantee, index) => (
            <Card key={index} className="text-center hover-lift bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-muted/50`}>
                  <guarantee.icon className={`w-8 h-8 ${guarantee.color}`} />
                </div>
                <h3 className="font-bold mb-3">{guarantee.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {guarantee.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Quality Certifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                  {cert.logo}
                </div>
                <h4 className="font-semibold mb-2">{cert.name}</h4>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Thousands of Satisfied Athletes?</h3>
            <p className="text-muted-foreground mb-6">
              Experience the SAMURAï difference with our premium supplements and exceptional service
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Shop Now - 30 Day Guarantee
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;

