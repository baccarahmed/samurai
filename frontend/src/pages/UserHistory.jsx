import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Activity, Filter, Trash2, Eye, ShoppingCart, Heart, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';

const UserHistory = () => {
  const navigate = useNavigate();
  const { getAuthHeaders, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [currentPage, filter]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchHistory = async () => {
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 20
      });
      
      if (filter !== 'all') {
        params.append('action_type', filter);
      }

      const response = await fetch(`http://localhost:5000/api/user/history?${params}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setTotalPages(data.pages || 1);
      } else {
        throw new Error('Failed to fetch history');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:5000/api/user/history/stats', {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all your history?')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:5000/api/user/history/clear', {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setHistory([]);
        setStats({});
        alert('History cleared successfully');
      } else {
        throw new Error('Failed to clear history');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'login':
        return <LogIn className="h-4 w-4" />;
      case 'logout':
        return <LogOut className="h-4 w-4" />;
      case 'register':
        return <User className="h-4 w-4" />;
      case 'add_to_cart':
        return <ShoppingCart className="h-4 w-4" />;
      case 'remove_from_cart':
        return <ShoppingCart className="h-4 w-4" />;
      case 'add_to_wishlist':
        return <Heart className="h-4 w-4" />;
      case 'remove_from_wishlist':
        return <Heart className="h-4 w-4" />;
      case 'view_product':
        return <Eye className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'login':
      case 'register':
        return 'bg-green-500 text-white';
      case 'logout':
        return 'bg-gray-500 text-white';
      case 'add_to_cart':
      case 'add_to_wishlist':
        return 'bg-blue-500 text-white';
      case 'remove_from_cart':
      case 'remove_from_wishlist':
        return 'bg-red-500 text-white';
      case 'view_product':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Mon <span className="gold-black-motion">Historique</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Suivi de toutes vos activités sur la plateforme
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </div>
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="p-4">
              <p className="text-destructive font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Actions</p>
                  <p className="text-2xl font-bold">{stats.total_actions || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actions Récentes</p>
                  <p className="text-2xl font-bold">{stats.recent_actions || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Types d'Actions</p>
                  <p className="text-2xl font-bold">{stats.action_stats?.length || 0}</p>
                </div>
                <Filter className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-border rounded-md px-3 py-1 bg-background"
            >
              <option value="all">Toutes les actions</option>
              <option value="login">Connexions</option>
              <option value="register">Inscriptions</option>
              <option value="add_to_cart">Ajouts au panier</option>
              <option value="remove_from_cart">Retraits du panier</option>
              <option value="add_to_wishlist">Ajouts à la wishlist</option>
              <option value="remove_from_wishlist">Retraits de la wishlist</option>
              <option value="view_product">Consultations de produits</option>
            </select>
          </div>

          <Button
            variant="outline"
            onClick={clearHistory}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Effacer l'historique
          </Button>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Aucun historique</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Votre historique d'activités apparaîtra ici
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getActionColor(item.action_type)}`}>
                        {getActionIcon(item.action_type)}
                      </div>
                      <div>
                        <p className="font-medium">{item.action_description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.action_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHistory;