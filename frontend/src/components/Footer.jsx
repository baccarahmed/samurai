import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Shield,
  Award,
  Truck,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import logoImage from '../assets/logo.PNG';

const Footer = () => {
  const footerLinks = {
    'Shop': [
      'Protein Powders',
      'Pre-Workouts',
      'Recovery',
      'Weight Management',
      'Vitamins',

    ],
    'Support': [
      'Contact Us',
    ],
    'Company': [
      'About Us',
      'Our Story',
      
    ],
    'Legal': [
      'Privacy Policy',
      'Terms of Service',
      
    ]
  };

  const certifications = [
    { name: 'NSF Certified', icon: Shield },
    { name: 'GMP Certified', icon: Award },
    { name: 'Third-Party Tested', icon: Shield },
    { name: 'FDA Registered', icon: Award }
  ];

  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <img src={logoImage} alt="Samurai Nutrition Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="gold-black-motion">SAMURAï</h1>
                <p className="text-xs text-muted-foreground -mt-1">NUTRITION</p>
              </div>
            </div>
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <span>+216 56 704 241</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span>support@samurainutrition.com</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                <span>Tunis,6km rue mateur Manouba daouar hicher</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Youtube, label: 'YouTube' }
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-foreground">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ">
            <div>
              <h4 className="font-semibold mb-4">Quality Certifications</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <cert.icon className="w-5 h-5 text-green-500" />
                    <span className="text-muted-foreground">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 SAMURAï Nutrition. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for athletes</span>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
