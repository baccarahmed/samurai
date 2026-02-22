import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Timer, Zap, Target, Trophy } from 'lucide-react';
import logoImage from '../assets/logo410.png';
import ProductBundles from './ProductBundles';

const HeroSection = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0);

  const benefits = [
    "Unleash Your Potential",
    "Fuel Your Performance", 
    "Optimize Recovery",
    "Build Elite Strength",
    "Maximize Endurance"
  ];

  

  // Rotate benefits every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [benefits.length]);

  

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-visible bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 japanese-pattern">
      {/* Background Overlay */}
      <div className="absolute inset-0">
        <img src={logoImage} alt="Samurai Nutrition Logo" className="w-full h-full object-contain mx-auto" />
      </div>

      {/* Samurai Organic Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-samurai-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/20 organic-shape blur-2xl animate-bounce"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-primary/30 rounded-full blur-lg animate-samurai-pulse delay-1000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading with Animated Benefits */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="gold-black-motion">SAMURAï</span>
              <br />
              <span className="gold-black-motion">NUTRITION</span>
            </h1>
            
            <div className="h-16 flex items-center justify-center">
              <p className="text-2xl md:text-3xl font-semibold ">
                {benefits[currentBenefit]}
              </p>
            </div>
          </div>

          {/* Subtitle */}
          

          {/* CTA Buttons */}
          
        </div>
        <div className="mt-10">
          <ProductBundles />
        </div>
      </div>

      
    </section>
  );
};

export default HeroSection;
