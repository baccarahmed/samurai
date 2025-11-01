import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Timer, Zap, Target, Trophy } from 'lucide-react';
import logoImage from '../assets/logo410.png';

const HeroSection = ({ navigateTo }) => {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  const benefits = [
    "Unleash Your Potential",
    "Fuel Your Performance", 
    "Optimize Recovery",
    "Build Elite Strength",
    "Maximize Endurance"
  ];

  const stats = [
    { icon: Trophy, value: "50K+", label: "Athletes Trust Us" },
    { icon: Zap, value: "98%", label: "Performance Boost" },
    { icon: Target, value: "24/7", label: "Expert Support" }
  ];

  // Rotate benefits every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 japanese-pattern">
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
          

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors samurai-glow">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Promotion Countdown */}
          <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Timer className="w-5 h-5 text-primary mr-2" />
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Limited Time Offer
              </Badge>
            </div>
            
            <div className="text-2xl font-bold mb-2">25% OFF First Order</div>
            
            <div className="flex justify-center space-x-4 text-center">
              <div className="bg-primary/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="bg-primary/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl font-bold text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-primary/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl font-bold text-primary">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default HeroSection;

