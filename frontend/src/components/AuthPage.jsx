import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logoImage from '@/assets/logo4.png';
import logoImag from '@/assets/logo.png';


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
// Import already declared above
import SmokeyBackground from './lightswind/smokey-background';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      let result;
      
      if (isLogin) {
        // Login
        result = await login(formData.email, formData.password);
        
        if (result.success) {
          if (result.user.role === 'admin') {
            setMessage('Admin login successful! Redirecting to dashboard...');
            setTimeout(() => {
              navigate('/admin');
            }, 1500);
          } else {
            setMessage('Login successful! Redirecting...');
            setTimeout(() => {
              navigate('/');
            }, 1500);
          }
        } else {
          setMessage(result.error || 'Login failed');
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const userData = {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName
        };

        result = await register(userData);
        
        if (result.success) {
          setMessage('Registration successful! Redirecting...');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setMessage(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      setMessage('An error occurred');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Trophy,
      title: 'Exclusive Rewards',
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
      text: 'The personalized recommendations helped me perfectly optimize my supplement stack.',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      role: 'Marathon Runner',
      text: 'The member rewards program is amazing - I save so much on my monthly orders!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={logoImage} alt="Samurai Nutrition Logo" className="w-full h-full object-contain mx-auto" />
      </div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse z-10"></div>
        <div className="absolute bottom-32 right-32 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse delay-1000 z-10"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse delay-500 z-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Benefits & Branding */}
            <div className="space-y-8">
              <div>
              
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center">
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
                  <Card key={index} className=" border-0">
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
            <div className="relative">
              <Card className="samurai-card border-primary/20 backdrop-blur-sm bg-background/30">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-12 h-12 lg:w-15 lg:h-15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img src={logoImag} alt="Samurai Nutrition Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h1 className="gold-black-motion">SAMURAï</h1>
                      <p className="text-xs text-muted-foreground -mt-1">NUTRITION</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-1 ">
                    <Button
                      variant={isLogin ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setIsLogin(true)}
                      className={isLogin ? "samurai-button" : ""}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant={!isLogin ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setIsLogin(false)}
                      className={!isLogin ? "samurai-button" : ""}
                    >
                      Sign Up
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="px-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                    </div>

                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
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

                    {!isLogin && (
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            className="rounded border-border focus:ring-primary/20"
                            required
                          />
                          <span className="text-sm text-muted-foreground">
                            I agree to the <a href="#" className="text-primary hover:underline">terms of service</a>
                          </span>
                        </label>
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="subscribeNewsletter"
                            checked={formData.subscribeNewsletter}
                            onChange={handleInputChange}
                            className="rounded border-border focus:ring-primary/20"
                          />
                          <span className="text-sm text-muted-foreground">
                            Receive newsletters and exclusive offers
                          </span>
                        </label>
                      </div>
                    )}

                    {message && (
                      <div className={`p-3 rounded-lg text-sm ${
                        message.includes('réussie') 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full samurai-button py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {isLogin ? 'Signing in...' : 'Signing up...'}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {isLogin ? 'Sign in' : 'Create account'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {isLogin 
                          ? "Don't have an account? Sign up" 
                          : "Already have an account? Sign in"
                        }
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

