import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users,
  CheckCircle,
  Star
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with our nutrition experts',
      contact: '+1 (555) 123-4567',
      availability: '24/7 Available',
      color: 'bg-amber-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed answers to your questions',
      contact: 'support@samurainutrition.com',
      availability: 'Response within 2 hours',
      color: 'bg-green-500'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant help when you need it',
      contact: 'Available on website',
      availability: 'Mon-Fri 8AM-8PM EST',
      color: 'bg-purple-500'
    }
  ];

  const officeLocations = [
    {
      city: 'New York',
      address: '123 Fitness Avenue, NY 10001',
      phone: '+1 (555) 123-4567',
      type: 'Headquarters'
    },
    {
      city: 'Los Angeles',
      address: '456 Wellness Blvd, CA 90210',
      phone: '+1 (555) 987-6543',
      type: 'West Coast Office'
    },
    {
      city: 'Miami',
      address: '789 Health Street, FL 33101',
      phone: '+1 (555) 456-7890',
      type: 'Southeast Office'
    }
  ];

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking number sent to your email after purchase.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day money-back guarantee on all products. No questions asked.'
    },
    {
      question: 'Do you offer nutrition consultations?',
      answer: 'Yes! Our certified nutritionists are available for personalized consultations.'
    },
    {
      question: 'Are your products third-party tested?',
      answer: 'Absolutely. All our products undergo rigorous third-party testing for purity and potency.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      
        <div className="container mx-auto px-4 ">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gold-black-motion">Get in Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Have questions about our products or need personalized nutrition advice? 
              Our expert team is here to help you achieve your fitness goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-100 px-4 py-2">
                <Headphones className="w-4 h-4 mr-2" />
                24/7 Support
              </Badge>
              <Badge variant="secondary" className="bg-green-600/20 text-green-100 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Expert Team
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-100 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                5-Star Service
              </Badge>
            </div>
          </div>
        </div>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How Can We Help?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the contact method that works best for you. Our team is ready to assist.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover-lift cursor-pointer">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <p className="font-medium text-primary mb-2">{method.contact}</p>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {method.availability}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We'll respond within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name *</label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject *</label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What can we help you with?"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about your question or concern..."
                          rows={6}
                          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Office Locations */}
            <div>
              <h3 className="text-2xl font-bold mb-8">Our Locations</h3>
              <div className="space-y-6">
                {officeLocations.map((location, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-lg">{location.city}</h4>
                            <Badge variant="outline" className="text-xs">
                              {location.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{location.address}</p>
                          <p className="text-sm font-medium text-primary">{location.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Business Hours */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 8:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>24/7 Emergency Support:</strong> For urgent product-related questions, 
                      call our emergency hotline at +1 (555) 911-HELP
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team of certified nutritionists and customer service experts are standing by to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: +1 (555) 123-4567
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Live Chat
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

