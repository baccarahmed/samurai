import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Trophy,
  Target
} from 'lucide-react';
import logoImage from '../assets/logo.PNG';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const benefits = [
    {
      icon: Trophy,
      title: 'Exclusive Member Rewards',
      description: 'Earn points on every purchase and unlock special discounts'
    },
    {
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'Get supplement suggestions tailored to your fitness goals'
    },
    {
      icon: Star,
      title: 'Early Access',
      description: 'Be the first to try new products and exclusive releases'
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: '24/7 access to our expert nutrition specialists'
    }
  ];

  const testimonials = [
    {
      name: 'Marcus Johnson',
      role: 'Professional Powerlifter',
      text: 'The personalized recommendations helped me optimize my supplement stack perfectly.',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      role: 'Marathon Runner',
      text: 'Member rewards program is amazing - I save so much on my monthly orders!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute inset-0 bg-center opacity-10 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${logoImage})` }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Benefits & Branding */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <img src={logoImage} alt="Samurai Nutrition Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="gold-black-motion">SAMURAï</h1>
                    <p className="text-sm text-muted-foreground -mt-1">NUTRITION</p>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Join the <span className="gold-black-motion">Elite</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Unlock exclusive benefits, personalized nutrition plans, and join thousands of athletes achieving their peak performance.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What Our Members Say</h3>
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-card/60 backdrop-blur-sm border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">"{testimonial.text}"</p>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex justify-center">
            <Card className="samurai-card border-primary/20 backdrop-blur-sm bg-background/30 bg-transparent">
              <CardHeader className="text-center ">
                  <div className="flex justify-center space-x-1 ">
                    <Button
                      variant={isLogin ? 'default' : 'ghost'}
                      onClick={() => setIsLogin(true)}
                      className="flex-1"
                    >
                      Sign In
                    </Button>
                    <Button
                      variant={!isLogin ? 'default' : 'ghost'}
                      onClick={() => setIsLogin(false)}
                      className="flex-1"
                    >
                      Sign Up
                    </Button>
                  </div>
                  
                  <h2 className="text-2xl font-bold">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isLogin 
                      ? 'Sign in to access your account and exclusive benefits'
                      : 'Join thousands of athletes achieving peak performance'
                    }
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Social Login - Removed due to import issues */}
                  {/* <div className="space-y-3">
                    <Button variant="outline" className="w-full" type="button">
                      <Google className="w-4 h-4 mr-2" />
                      Continue with Google
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" type="button">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button variant="outline" type="button">
                        <Apple className="w-4 h-4 mr-2" />
                        Apple
                      </Button>
                    </div>
                  </div> */}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields (Sign Up Only) */}
                    {!isLogin && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John"
                              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                              required={!isLogin}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Doe"
                              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                              required={!isLogin}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {!isLogin && (
                        <p className="text-xs text-muted-foreground">
                          Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                      )}
                    </div>

                    {/* Confirm Password (Sign Up Only) */}
                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-12 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            required={!isLogin}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Remember Me / Forgot Password */}
                    {isLogin && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                          />
                          <span className="text-sm">Remember me</span>
                        </label>
                        <button
                          type="button"
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Terms & Newsletter (Sign Up Only) */}
                    {!isLogin && (
                      <div className="space-y-3">
                        <label className="flex items-start space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20 mt-0.5"
                            required
                          />
                          <span className="text-sm text-muted-foreground">
                            I agree to the{' '}
                            <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                          </span>
                        </label>
                        
                        <label className="flex items-start space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="subscribeNewsletter"
                            checked={formData.subscribeNewsletter}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20 mt-0.5"
                          />
                          <span className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for exclusive offers and nutrition tips
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full btn-magnetic">
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>

                  {/* Footer */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </button>
                    </p>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Your data is protected with 256-bit SSL encryption</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

