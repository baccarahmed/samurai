import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Settings,
  BarChart3,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Wifi,
  WifiOff,
  PackagePlus
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, getAuthHeaders, logout } = useAuth();
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    recent_orders: 0,
    monthly_revenue: 0,
    low_stock_products: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!isAdmin) {
      navigate('/auth');
      return;
    }
    
    fetchDashboardData();
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = getAuthHeaders();
      console.log('Fetching dashboard data with headers:', headers);
      
      // Debug: Check if we have a token
      if (!headers.Authorization) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      // Check if backend is reachable first
      const healthCheck = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => null);
      
      if (!healthCheck) {
        throw new Error('Backend server is not responding. Please check if the server is running on port 5000.');
      }
      
      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers
      });
      
      if (!statsResponse.ok) {
        if (statsResponse.status === 401) {
          // Token expiré ou invalide
          logout();
          navigate('/auth');
          return;
        } else if (statsResponse.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (statsResponse.status === 404) {
          throw new Error('API endpoint not found. Please check your backend implementation.');
        } else if (statsResponse.status === 500) {
          throw new Error('Server error. Please check backend logs and database connection.');
        }
        throw new Error(`Request failed with status: ${statsResponse.status}`);
      }
      
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent orders (non-critical, continue on error)
      try {
        const ordersResponse = await fetch('http://localhost:5000/api/admin/dashboard/recent-orders?limit=5', {
          headers
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData);
        }
      } catch (ordersError) {
        console.warn('Failed to fetch recent orders:', ordersError);
      }

      // Fetch sales chart data (non-critical, continue on error)
      try {
        const salesResponse = await fetch('http://localhost:5000/api/admin/dashboard/sales-chart', {
          headers
        });
        
        if (salesResponse.ok) {
          const salesChartData = await salesResponse.json();
          setSalesData(salesChartData);
        }
      } catch (salesError) {
        console.warn('Failed to fetch sales data:', salesError);
      }

      setRetryCount(0); // Reset retry count on success

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchDashboardData();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className={`flex items-center gap-2 text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
      {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4">
            <RefreshCw className="h-12 w-12 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
          <ConnectionStatus />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Dashboard Error</h2>
          <p className="text-destructive mb-4 text-sm">{error}</p>
          
          {retryCount > 2 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              <p className="font-medium">Troubleshooting Tips:</p>
              <ul className="mt-2 text-left list-disc list-inside space-y-1">
                <li>Check if your backend server is running on port 5000</li>
                <li>Verify database connection</li>
                <li>Check server logs for detailed error information</li>
                <li>Ensure the API endpoint '/api/admin/dashboard/stats' exists</li>
              </ul>
            </div>
          )}
          
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRetry} disabled={!isOnline}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry {retryCount > 0 && `(${retryCount})`}
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
          
          <div className="mt-4">
            <ConnectionStatus />
          </div>
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
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="gold-black-motion">Admin Dashboard</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Welcome back, {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ConnectionStatus />
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_revenue}</div>
              <p className="text-xs text-muted-foreground">
                ${stats.monthly_revenue} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_orders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recent_orders} in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_products}</div>
              <p className="text-xs text-muted-foreground">
                {stats.low_stock_products} low stock
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.length > 0 ? (
                  salesData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(data.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{data.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${data.revenue}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No sales data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.user_name}</p>
                        <p className="text-xs text-muted-foreground">{order.created_at}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total_amount}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No recent orders</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('inventory')}
          >
            <Package className="w-6 h-6" />
            <span>Manage Inventory</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('users')}
          >
            <Users className="w-6 h-6" />
            <span>View Users</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('orders')}
          >
            <ShoppingCart className="w-6 h-6" />
            <span>View Orders</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('analytics')}
          >
            <BarChart3 className="w-6 h-6" />
            <span>Analytics</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('bundles')}
          >
            <PackagePlus className="w-6 h-6" />
            <span>Manage Bundles</span>
          </Button>
        </div>

        {/* Alerts */}
        {stats.low_stock_products > 0 && (
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700">
                {stats.low_stock_products} product(s) are running low on stock. 
                <Button variant="link" className="p-0 ml-2 text-orange-800" onClick={() => navigate('inventory')}>
                  Manage inventory →
                </Button>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
