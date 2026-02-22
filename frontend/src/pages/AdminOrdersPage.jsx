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
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, CreditCard, MapPin, Calendar, Hash, RefreshCcw, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusUpdateDialog, setShowStatusUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [page, perPage, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté en tant qu'administrateur",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      let url = `http://localhost:5000/api/admin/orders?page=${page}&per_page=${perPage}`;
      
      if (statusFilter && statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalPages(data.pagination.pages || 1);
      } else {
        const errorData = await response.json();
        console.error("Error fetching orders:", response.status, errorData);
        toast({
          title: "Erreur",
          description: errorData.error || "Impossible de récupérer les commandes",
          variant: "destructive"
        });
        
        // If unauthorized, clear token and redirect to login
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
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
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
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

  const updateOrderStatus = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          comment: statusComment 
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Statut de la commande mis à jour avec succès"
        });
        setShowStatusUpdateDialog(false);
        fetchOrders();
        
        // Si les détails de la commande sont affichés, les mettre à jour
        if (showOrderDetails && selectedOrder && selectedOrder.id === orderId) {
          fetchOrderDetails(orderId);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const openStatusUpdateDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusComment('');
    setShowStatusUpdateDialog(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <RefreshCcw className="w-4 h-4" />;
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
      case 'refunded': return 'bg-gray-100 text-gray-800';
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
      case 'refunded': return 'Remboursée';
      default: return status;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Le changement de searchQuery déclenchera fetchOrders via useEffect
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
          <h1 className="text-3xl font-bold text-amber-600">Gestion des Commandes</h1>
          <p className="text-amber-500 mt-2">Administration des commandes clients</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <Label htmlFor="search">Recherche</Label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input 
                  id="search" 
                  placeholder="Numéro de commande, email client..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="outline">
                  Rechercher
                </Button>
              </form>
            </div>
            
            <div className="w-full md:w-1/4">
              <Label htmlFor="status-filter">Filtrer par statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="processing">En préparation</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                  <SelectItem value="refunded">Remboursée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/4">
              <Label htmlFor="per-page">Commandes par page</Label>
              <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                <SelectTrigger id="per-page">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPage(1);
              }}
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-amber-600 mb-2">Aucune commande</h3>
            <p className="text-amber-500">Aucune commande ne correspond à vos critères.</p>
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
                    </div>
                    
                    {order.user && (
                      <div className="text-sm text-gray-600">
                        Client: {order.user.first_name} {order.user.last_name} ({order.user.email})
                      </div>
                    )}
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
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openStatusUpdateDialog(order)}
                    >
                      <RefreshCcw className="w-4 h-4 mr-1" />
                      Modifier statut
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
          >
            Précédent
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
          >
            Suivant
          </Button>
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
                  Détails complets de la commande
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
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStatusUpdateDialog(selectedOrder)}
                            className="w-full"
                          >
                            <RefreshCcw className="w-4 h-4 mr-1" />
                            Modifier le statut
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations client</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedOrder.user ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Nom:</span>
                              <span>{selectedOrder.user.first_name} {selectedOrder.user.last_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span>{selectedOrder.user.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Téléphone:</span>
                              <span>{selectedOrder.user.phone || 'Non spécifié'}</span>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-600">Informations client non disponibles</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Adresse de livraison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {selectedOrder.shipping_address || 'Non spécifiée'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Adresse de facturation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {selectedOrder.billing_address || 'Non spécifiée'}
                        </p>
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
                          Suivi détaillé de l'évolution de la commande
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

      {/* Dialog de mise à jour du statut */}
      <Dialog open={showStatusUpdateDialog} onOpenChange={setShowStatusUpdateDialog}>
        <DialogContent>
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Modifier le statut de la commande</DialogTitle>
                <DialogDescription>
                  Commande #{selectedOrder.order_number}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Nouveau statut</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="processing">En préparation</SelectItem>
                      <SelectItem value="shipped">Expédiée</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                      <SelectItem value="refunded">Remboursée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comment">Commentaire (optionnel)</Label>
                  <Textarea 
                    id="comment" 
                    placeholder="Ajouter un commentaire sur ce changement de statut" 
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowStatusUpdateDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={() => updateOrderStatus(selectedOrder.id)}>
                  Mettre à jour
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersPage;
