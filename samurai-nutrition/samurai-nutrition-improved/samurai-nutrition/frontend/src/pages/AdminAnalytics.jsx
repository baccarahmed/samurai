import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  ArrowLeft,
  Calendar,
  RefreshCw,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { isAdmin, getAuthHeaders } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(30); // 30 days by default

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!isAdmin) {
      navigate('/auth');
      return;
    }
    
    fetchAnalyticsData();
  }, [isAdmin, navigate, period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      // Fetch sales chart data
      const salesResponse = await fetch(`http://localhost:5000/api/admin/dashboard/sales-chart?days=${period}`, {
        headers
      });
      
      if (!salesResponse.ok) {
        throw new Error(`Request failed with status: ${salesResponse.status}`);
      }
      
      const salesChartData = await salesResponse.json();
      setSalesData(salesChartData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error.message || 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (days) => {
    setPeriod(days);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={period === 7 ? "default" : "outline"}
                onClick={() => handlePeriodChange(7)}
              >
                7 Days
              </Button>
              <Button 
                variant={period === 30 ? "default" : "outline"}
                onClick={() => handlePeriodChange(30)}
              >
                30 Days
              </Button>
              <Button 
                variant={period === 90 ? "default" : "outline"}
                onClick={() => handlePeriodChange(90)}
              >
                90 Days
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchAnalyticsData}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">Loading analytics data...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            {/* Sales Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.daily_sales && salesData.daily_sales.length > 0 ? (
                    salesData.daily_sales.map((data, index) => (
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

            {/* Top Products */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.top_products && salesData.top_products.length > 0 ? (
                    salesData.top_products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{product.total_sold} units sold</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No product data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;