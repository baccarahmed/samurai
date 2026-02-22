import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, CreditCard, MapPin, Truck, Package, CheckCircle, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import product images
import proteinImage from '@/assets/Elite Whey Protein.jpg';
import preworkoutImage from '@/assets/Pre-Workout Ignite.jpg';
import bcaaImage from '@/assets/BCAA Complex.jpg';
import creatineImage from '@/assets/Creatine Monohydrate.jpg';
import recoveryImage from '@/assets/Recovery Matrix.jpg';
import massGainerImage from '@/assets/Mass Gainer Extreme.jpg';
import fatBurnerImage from '@/assets/Thermogenic Fat Burner.jpg';
import multivitaminImage from '@/assets/Daily Multivitamin.jpg';
import fishOilImage from '@/assets/Omega-3 Fish Oil.jpg';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Function to get product image based on product name
  const getProductImage = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('protein') || name.includes('whey')) return proteinImage;
    if (name.includes('pre-workout') || name.includes('preworkout')) return preworkoutImage;
    if (name.includes('bcaa')) return bcaaImage;
    if (name.includes('recovery')) return recoveryImage;
    if (name.includes('creatine')) return creatineImage;
    if (name.includes('mass gainer') || name.includes('weight gainer')) return massGainerImage;
    if (name.includes('fat burner') || name.includes('thermogenic')) return fatBurnerImage;
    if (name.includes('vitamin') || name.includes('multivitamin')) return multivitaminImage;
    if (name.includes('fish oil') || name.includes('omega')) return fishOilImage;
    return proteinImage; // Default image
  };
  
  const [orderData, setOrderData] = useState({
    // Informations de livraison
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    // Informations de facturation
    billing: {
      sameAsShipping: true,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    // Méthodes de livraison et paiement
    shippingMethod: '',
    paymentMethod: '',
    notes: ''
  });

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Livraison Standard',
      description: '3-5 jours ouvrés',
      price: 9.99,
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'express',
      name: 'Livraison Express',
      description: '1-2 jours ouvrés',
      price: 19.99,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'pickup',
      name: 'Retrait en magasin',
      description: 'Disponible sous 2h',
      price: 0,
      icon: <MapPin className="w-5 h-5" />
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement sécurisé via PayPal',
      icon: <CreditCard className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
        } else if (response.status === 404) {
          setCartItems([]);
          toast({
            title: "Panier vide",
            description: "Votre panier est vide. Ajoutez des produits avant de passer à la caisse.",
            variant: "destructive"
          });
          navigate('/cart');
        } else {
          throw new Error('Impossible de récupérer le panier');
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: err.message,
          variant: "destructive"
        });
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate, toast]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cart/update_quantity/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart.items || []);
      } else {
        throw new Error('Impossible de mettre à jour la quantité');
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setCartItems(items => items.filter(item => item.product_id !== productId));
      } else {
        throw new Error('Impossible de supprimer l\'article du panier');
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.product_price === 'string' ? parseFloat(item.product_price) : item.product_price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateShipping = () => {
    const method = shippingMethods.find(m => m.id === orderData.shippingMethod);
    return method ? method.price : 0;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.20; // TVA 20%
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return cartItems.length > 0;
      case 2:
        {
          const { shipping } = orderData;
          return shipping.firstName && shipping.lastName && shipping.email && 
                shipping.address && shipping.city && shipping.postalCode;
        }
      case 3:
        return orderData.shippingMethod && orderData.paymentMethod;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Préparer les données de commande
      const orderPayload = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.product_price),
          name: item.product_name
        })),
        shipping_address: `${orderData.shipping.firstName} ${orderData.shipping.lastName}\n${orderData.shipping.address}\n${orderData.shipping.postalCode} ${orderData.shipping.city}\n${orderData.shipping.country}`,
        billing_address: orderData.billing.sameAsShipping 
          ? `${orderData.shipping.firstName} ${orderData.shipping.lastName}\n${orderData.shipping.address}\n${orderData.shipping.postalCode} ${orderData.shipping.city}\n${orderData.shipping.country}`
          : `${orderData.billing.firstName} ${orderData.billing.lastName}\n${orderData.billing.address}\n${orderData.billing.postalCode} ${orderData.billing.city}\n${orderData.billing.country}`,
        payment_method: orderData.paymentMethod,
        shipping_method: orderData.shippingMethod,
        shipping_cost: calculateShipping(),
        tax_amount: calculateTax(),
        discount_amount: 0,
        notes: orderData.notes
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Commande confirmée !",
          description: `Votre commande ${data.order.order_number} a été créée avec succès.`
        });
        
        // Vider le panier
        try {
          const emptyCartResponse = await fetch('http://localhost:5000/api/cart/empty', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!emptyCartResponse.ok) {
            console.error('Erreur lors de la vidange du panier');
          }
        } catch (error) {
          console.error('Erreur lors de la vidange du panier:', error);
        }
        
        setCartItems([]);
        
        // Rediriger vers la page de confirmation
        navigate(`/orders`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la commande');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Panier', icon: <ShoppingCart className="w-5 h-5" /> },
    { number: 2, title: 'Livraison', icon: <MapPin className="w-5 h-5" /> },
    { number: 3, title: 'Paiement', icon: <CreditCard className="w-5 h-5" /> },
    { number: 4, title: 'Confirmation', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec étapes */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-600 mb-6">Finaliser la commande</h1>
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-yellow-600 border-yellow-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-yellow-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Étape 1: Panier */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Votre panier ({cartItems.length} articles)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-amber-500">Votre panier est vide</p>
                      <Button 
                        onClick={() => navigate('/products')} 
                        className="mt-4 bg-yellow-600 hover:bg-yellow-700"
                      >
                        Continuer les achats
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img 
                            src={getProductImage(item.product_name)} 
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = getProductImage(item.product_name);
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.product_name}</h3>
                            <p className="text-sm text-amber-500">SKU: {item.product_sku || 'N/A'}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="font-semibold">{item.product_price}€</span>
                              {item.product_original_price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {item.product_original_price}€
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {(parseFloat(item.product_price) * item.quantity).toFixed(2)}€
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product_id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Étape 2: Informations de livraison */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Informations de livraison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={orderData.shipping.firstName}
                        onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={orderData.shipping.lastName}
                        onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={orderData.shipping.email}
                        onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={orderData.shipping.phone}
                        onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={orderData.shipping.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={orderData.shipping.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={orderData.shipping.postalCode}
                        onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays *</Label>
                      <Select 
                        value={orderData.shipping.country} 
                        onValueChange={(value) => handleInputChange('shipping', 'country', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Belgique">Belgique</SelectItem>
                          <SelectItem value="Suisse">Suisse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Adresse de facturation */}
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAsShipping"
                        checked={orderData.billing.sameAsShipping}
                        onCheckedChange={(checked) => handleInputChange('billing', 'sameAsShipping', checked)}
                      />
                      <Label htmlFor="sameAsShipping">
                        L'adresse de facturation est identique à l'adresse de livraison
                      </Label>
                    </div>

                    {!orderData.billing.sameAsShipping && (
                      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-semibold">Adresse de facturation</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingFirstName">Prénom *</Label>
                            <Input
                              id="billingFirstName"
                              value={orderData.billing.firstName}
                              onChange={(e) => handleInputChange('billing', 'firstName', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingLastName">Nom *</Label>
                            <Input
                              id="billingLastName"
                              value={orderData.billing.lastName}
                              onChange={(e) => handleInputChange('billing', 'lastName', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="billingAddress">Adresse *</Label>
                          <Input
                            id="billingAddress"
                            value={orderData.billing.address}
                            onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
                            className="mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="billingCity">Ville *</Label>
                            <Input
                              id="billingCity"
                              value={orderData.billing.city}
                              onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingPostalCode">Code postal *</Label>
                            <Input
                              id="billingPostalCode"
                              value={orderData.billing.postalCode}
                              onChange={(e) => handleInputChange('billing', 'postalCode', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingCountry">Pays *</Label>
                            <Select 
                              value={orderData.billing.country} 
                              onValueChange={(value) => handleInputChange('billing', 'country', value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="Belgique">Belgique</SelectItem>
                                <SelectItem value="Suisse">Suisse</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 3: Livraison et paiement */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Méthodes de livraison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Truck className="w-5 h-5" />
                      <span>Méthode de livraison</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={orderData.shippingMethod} 
                      onValueChange={(value) => setOrderData(prev => ({...prev, shippingMethod: value}))}
                    >
                      {shippingMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center space-x-3 flex-1">
                            {method.icon}
                            <div className="flex-1">
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-amber-500">{method.description}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">
                                {method.price === 0 ? 'Gratuit' : `${method.price}€`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Méthodes de paiement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Méthode de paiement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={orderData.paymentMethod} 
                      onValueChange={(value) => setOrderData(prev => ({...prev, paymentMethod: value}))}
                    >
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center space-x-3 flex-1">
                            {method.icon}
                            <div>
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-amber-500">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notes de commande (optionnel)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Instructions spéciales pour la livraison..."
                      value={orderData.notes}
                      onChange={(e) => setOrderData(prev => ({...prev, notes: e.target.value}))}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Étape 4: Confirmation */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirmation de commande</span>
                  </CardTitle>
                  <CardDescription>
                    Vérifiez vos informations avant de finaliser la commande
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Récapitulatif des articles */}
                  <div>
                    <h3 className="font-semibold mb-3">Articles commandés</h3>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{item.product_name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-semibold">{(parseFloat(item.product_price) * item.quantity).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Adresse de livraison</h3>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p>{orderData.shipping.firstName} {orderData.shipping.lastName}</p>
                        <p>{orderData.shipping.address}</p>
                        <p>{orderData.shipping.postalCode} {orderData.shipping.city}</p>
                        <p>{orderData.shipping.country}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Adresse de facturation</h3>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {orderData.billing.sameAsShipping ? (
                          <p className="text-amber-500">Identique à l'adresse de livraison</p>
                        ) : (
                          <>
                            <p>{orderData.billing.firstName} {orderData.billing.lastName}</p>
                            <p>{orderData.billing.address}</p>
                            <p>{orderData.billing.postalCode} {orderData.billing.city}</p>
                            <p>{orderData.billing.country}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Méthodes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Livraison</h3>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {shippingMethods.find(m => m.id === orderData.shippingMethod)?.name}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Paiement</h3>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {paymentMethods.find(m => m.id === orderData.paymentMethod)?.name}
                      </div>
                    </div>
                  </div>

                  {orderData.notes && (
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {orderData.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Récapitulatif de commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{calculateSubtotal().toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{calculateShipping().toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%)</span>
                    <span>{calculateTax().toFixed(2)}€</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{calculateTotal().toFixed(2)}€</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentStep > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                  )}
                  
                  {currentStep < 4 ? (
                    <Button 
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                    >
                      Continuer
                    </Button>
                  ) : (
                    <Button 
                      onClick={submitOrder}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {loading ? 'Traitement...' : 'Confirmer la commande'}
                    </Button>
                  )}
                </div>

                {/* Badges de sécurité */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-center space-x-2 text-sm text-amber-500">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Paiement sécurisé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
