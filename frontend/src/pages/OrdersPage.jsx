import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, CreditCard, MapPin, Calendar, Hash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour voir vos commandes",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      console.log("Fetching orders with token:", token.substring(0, 10) + "...");
      const response = await fetch('http://localhost:5000/api/orders-all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Orders fetched successfully:", data);
        setOrders(data.orders || []);
      } else {
        const errorData = await response.json();
        console.error("Error fetching orders:", response.status, errorData);
        toast({
          title: "Erreur",
          description: errorData.error || "Impossible de récupérer les commandes",
          variant: "destructive"
        });
        
        // If unauthorized, clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data.order);
        
        // Récupérer l'historique
        const historyResponse = await fetch(`http://localhost:5000/api/orders/${orderId}/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setOrderHistory(historyData.history || []);
        }
        
        setShowOrderDetails(true);
      } else {
        throw new Error('Erreur lors du chargement des détails');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // La fonction createOrder a été supprimée car le bouton "Passer Commande" a été supprimé

  const cancelOrder = async (orderId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Commande annulée avec succès"
        });
        fetchOrders();
        setShowOrderDetails(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const canCancelOrder = (status) => {
    return ['pending', 'confirmed'].includes(status);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-600">Mes Commandes</h1>
          <p className="text-amber-500 mt-2">Suivez et gérez vos commandes</p>
        </div>
        
        {/* Le bouton "Passer Commande" et le dialogue de création de commande ont été supprimés */}

      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-amber-600 mb-2">Aucune commande</h3>
            <p className="text-amber-500">Vous n'avez pas encore passé de commande.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </Badge>
                      <span className="text-sm text-gray-500">#{order.order_number}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4" />
                        <span>{order.total_amount}€</span>
                      </div>
                      {order.order_items && (
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>{order.order_items.length} article{order.order_items.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                    
                    {canCancelOrder(order.status) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <XCircle className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Annuler la commande</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir annuler cette commande ? Cette action ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Non, garder</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cancelOrder(order.id, 'Annulée par le client')}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Oui, annuler
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog des détails de commande */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Hash className="w-5 h-5" />
                  <span>Commande {selectedOrder.order_number}</span>
                </DialogTitle>
                <DialogDescription>
                  Détails complets de votre commande
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  {/* Statut et informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations générales</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut:</span>
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {getStatusText(selectedOrder.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date de commande:</span>
                          <span>{new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Méthode de paiement:</span>
                          <span>{selectedOrder.payment_method || 'Non spécifiée'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Méthode de livraison:</span>
                          <span>{selectedOrder.shipping_method || 'Non spécifiée'}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Adresses</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-amber-600 mb-1">Livraison</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {selectedOrder.shipping_address}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-amber-600 mb-1">Facturation</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {selectedOrder.billing_address}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Articles commandés */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Articles commandés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedOrder.items && selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium">{item.product_name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                              {item.product_sku && (
                                <span className="text-xs text-gray-400 ml-2">({item.product_sku})</span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{item.total_price}€</div>
                              <div className="text-sm text-gray-500">{item.unit_price}€ / unité</div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Récapitulatif des coûts */}
                        <div className="border-t pt-3 mt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Sous-total:</span>
                            <span>{(selectedOrder.total_amount - selectedOrder.shipping_cost - selectedOrder.tax_amount + selectedOrder.discount_amount).toFixed(2)}€</span>
                          </div>
                          {selectedOrder.shipping_cost > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Frais de port:</span>
                              <span>{selectedOrder.shipping_cost}€</span>
                            </div>
                          )}
                          {selectedOrder.tax_amount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Taxes:</span>
                              <span>{selectedOrder.tax_amount}€</span>
                            </div>
                          )}
                          {selectedOrder.discount_amount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Réduction:</span>
                              <span>-{selectedOrder.discount_amount}€</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>{selectedOrder.total_amount}€</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 whitespace-pre-line">{selectedOrder.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg">Historique de la commande</CardTitle>
                        <CardDescription>
                          Suivi détaillé de l'évolution de votre commande
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={() => window.print()}
                      >
                        Imprimer l'historique
                      </Button>
                    </CardHeader>
                        <CardContent>
                      <div className="space-y-4">
                        {orderHistory.map((entry) => (
                          <div key={entry.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(entry.status)}`}>
                                {getStatusIcon(entry.status)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-amber-600">
                                  {getStatusText(entry.status)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(entry.created_at).toLocaleString('fr-FR')}
                                </p>
                              </div>
                              {entry.comment && (
                                <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                              )}
                              {entry.created_by_user && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Par {entry.created_by_user.first_name} {entry.created_by_user.last_name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
