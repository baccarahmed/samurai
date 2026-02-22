import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  Award, 
  Heart,
  Shield,
  Zap,
  Leaf,
  Trophy,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// Import team member images
import teamMember1 from '@/assets/team-member-1.svg';
import teamMember2 from '@/assets/team-member-2.svg';
import teamMember3 from '@/assets/team-member-3.svg';
import articleImage from '@/assets/article-1.svg';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every product undergoes rigorous third-party testing to ensure purity, potency, and safety.'
    },
    {
      icon: Leaf,
      title: 'Natural Excellence',
      description: 'We source the finest natural ingredients from trusted suppliers worldwide.'
    },
    {
      icon: Trophy,
      title: 'Performance Driven',
      description: 'Our formulations are designed by sports scientists to maximize athletic performance.'
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Your success is our mission. We provide 24/7 support and guidance.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Athletes Served' },
    { number: '98%', label: 'Customer Satisfaction' },
    { number: '15+', label: 'Years Experience' },
    { number: '100+', label: 'Products Tested' }
  ];

  const team = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Chief Scientific Officer',
      image: teamMember1,
      credentials: 'PhD in Sports Nutrition, Former Olympic Nutritionist'
    },
    {
      name: 'Marcus Chen',
      role: 'Head of Product Development',
      image: teamMember2,
      credentials: 'MS Exercise Science, 20+ Years Industry Experience'
    },
    {
      name: 'Dr. James Rodriguez',
      role: 'Quality Assurance Director',
      image: teamMember3,
      credentials: 'PhD Biochemistry, Former FDA Consultant'
    }
  ];

  const certifications = [
    { name: 'NSF Certified', description: 'Third-party tested for sport' },
    { name: 'GMP Certified', description: 'Good Manufacturing Practices' },
    { name: 'FDA Registered', description: 'FDA registered facilities' },
    { name: 'Informed Sport', description: 'Tested for banned substances' }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gold-black-motion">About SAMURAï</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Forging the future of athletic nutrition through science, innovation, and unwavering commitment to excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-100 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Industry Leader
              </Badge>
              <Badge variant="secondary" className="bg-green-600/20 text-green-100 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Science-Backed
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-100 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Athlete Trusted
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At SAMURAï Nutrition, we believe that every athlete deserves access to the highest quality supplements 
                that can help them achieve their peak performance. Our mission is to bridge the gap between cutting-edge 
                sports science and practical nutrition solutions.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Founded by a team of sports scientists, nutritionists, and former athletes, we understand the unique 
                challenges faced by those who push their bodies to the limit. That's why we've dedicated ourselves to 
                creating products that not only meet but exceed the highest standards of quality and effectiveness.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Target className="w-5 h-5 mr-2" />
                Learn Our Story
              </Button>
            </div>
            <div className="relative">
              <img 
                src={articleImage} 
                alt="Athletes training"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Meet Our Experts</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our team combines decades of experience in sports science, nutrition, and product development.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.credentials}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Quality Certifications</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest standards through rigorous testing and certification processes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the SAMURAï Family?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the difference that quality, science, and dedication can make in your athletic journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Shop Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

