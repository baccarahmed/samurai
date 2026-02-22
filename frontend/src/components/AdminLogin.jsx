import React, { useState } from 'react';
import adminBackground from '@/assets/admin-background.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Trophy,
  Target,
  AlertTriangle
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@samurai-nutrition.com',
    password: 'admin123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        if (result.user.role === 'admin') {
          setMessage('Connexion admin réussie ! Redirection...');
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        } else {
          setMessage('Accès refusé. Privilèges administrateur requis.');
        }
      } else {
        setMessage(result.error || 'Échec de la connexion');
      }
    } catch {
      setMessage('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Trophy,
      title: 'Gestion Complète',
      description: 'Contrôlez tous les aspects de votre boutique en ligne'
    },
    {
      icon: Target,
      title: 'Analytics Avancées',
      description: 'Suivez les performances et optimisez vos ventes'
    },
    {
      icon: Star,
      title: 'Accès Prioritaire',
      description: 'Accédez aux fonctionnalités admin exclusives'
    },
    {
      icon: Shield,
      title: 'Sécurité Renforcée',
      description: 'Protection complète de vos données et transactions'
    }
  ];

  const testimonials = [
    {
      name: 'Admin Samurai',
      role: 'Administrateur Principal',
      text: 'Le dashboard admin offre une vue d\'ensemble complète et intuitive de toutes les opérations.',
      rating: 5
    },
    {
      name: 'Manager Nutrition',
      role: 'Gestionnaire Produits',
      text: 'Interface moderne et fonctionnelle pour gérer efficacement l\'inventaire et les commandes.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${adminBackground})` }}></div>
        
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
                    <Shield className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gradient">ADMIN</h1>
                    <p className="text-sm text-muted-foreground -mt-1">SAMURAï NUTRITION</p>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Accès <span className="text-gradient">Administrateur</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Gérez votre boutique Samurai Nutrition avec des outils puissants et une interface intuitive pour optimiser vos performances commerciales.
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
                <h3 className="font-semibold text-lg">Témoignages d'administrateurs</h3>
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
            <div className="relative">
              <Card className="samurai-card border-primary/20 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold warrior-strength">ADMIN</h1>
                      <p className="text-xs text-muted-foreground -mt-1">SAMURAï NUTRITION</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Badge variant="secondary" className="samurai-badge">
                      <Shield className="w-3 h-3 mr-1" />
                      Accès Administrateur
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Administrateur</label>
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
                      <label className="block text-sm font-medium mb-2">Mot de passe</label>
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

                    {message && (
                      <div className={`p-3 rounded-lg text-sm ${
                        message.includes('réussie') 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : message.includes('refusé') || message.includes('échec')
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
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
                          Connexion...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Accéder au Dashboard Admin
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      )}
                    </Button>

                    <div className="text-center space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Credentials de démonstration pré-remplies
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        ← Retour à l'accueil
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

export default AdminLogin;
