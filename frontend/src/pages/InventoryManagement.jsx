import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ArrowLeft,
  Save,
  X,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const InventoryManagement = ({ onBack }) => {
  // Move the hook inside the component
  const { getAuthHeaders } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    stock_quantity: '',
    low_stock_threshold: '10',
    sku: '',
    weight: '',
    dimensions: '',
    rating: '0',
    review_count: '0',
    image_url: '',
    featured: false,
    is_active: true,
    product_benefits: '',
    directions: '',
    ingredients: '',
    nutrition_facts: {}
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:5000/api/admin/products', {
        headers
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch categories');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders();
      
      // Traiter les nutrition_facts pour s'assurer qu'ils sont au bon format
      let processedNutritionFacts = {};
      if (newProduct.nutrition_facts) {
        try {
          // Si c'est une chaîne, on essaie de la parser
          if (typeof newProduct.nutrition_facts === 'string') {
            processedNutritionFacts = JSON.parse(newProduct.nutrition_facts);
          } else {
            // Sinon on utilise l'objet tel quel
            processedNutritionFacts = newProduct.nutrition_facts;
          }
        } catch (error) {
          console.error('Erreur lors du traitement des nutrition facts:', error);
          // En cas d'erreur, on utilise un objet vide
          processedNutritionFacts = {};
        }
      }
      
      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
          stock_quantity: parseInt(newProduct.stock_quantity),
          low_stock_threshold: parseInt(newProduct.low_stock_threshold),
          weight: newProduct.weight ? parseFloat(newProduct.weight) : null,
          rating: parseFloat(newProduct.rating),
          review_count: parseInt(newProduct.review_count),
          nutrition_facts: processedNutritionFacts
        }),
      });

      if (response.ok) {
        await fetchProducts();
        setShowAddForm(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          original_price: '',
          category: '',
          stock_quantity: '',
          low_stock_threshold: '10',
          sku: '',
          weight: '',
          dimensions: '',
          rating: '0',
          review_count: '0',
          image_url: '',
          featured: false,
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      const headers = getAuthHeaders();
      
      // Traiter les nutrition_facts pour s'assurer qu'ils sont au bon format
      let processedNutritionFacts = {};
      if (updatedData.nutrition_facts) {
        try {
          // Si c'est une chaîne, on essaie de la parser
          if (typeof updatedData.nutrition_facts === 'string') {
            processedNutritionFacts = JSON.parse(updatedData.nutrition_facts);
          } else {
            // Sinon on utilise l'objet tel quel
            processedNutritionFacts = updatedData.nutrition_facts;
          }
        } catch (error) {
          console.error('Erreur lors du traitement des nutrition facts:', error);
          // En cas d'erreur, on utilise un objet vide
          processedNutritionFacts = {};
        }
      }
      
      // Convertir les valeurs numériques
      const processedData = {
        ...updatedData,
        price: parseFloat(updatedData.price),
        original_price: updatedData.original_price ? parseFloat(updatedData.original_price) : null,
        stock_quantity: parseInt(updatedData.stock_quantity),
        low_stock_threshold: parseInt(updatedData.low_stock_threshold),
        weight: updatedData.weight ? parseFloat(updatedData.weight) : null,
        rating: parseFloat(updatedData.rating),
        review_count: parseInt(updatedData.review_count),
        nutrition_facts: processedNutritionFacts
      };
      
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const headers = getAuthHeaders();
        const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers
        });

        if (response.ok) {
          await fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="gold-black-motion">Inventory Management</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your product catalog and stock levels
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
         <div className="flex justify-between items-center mb-6">
           <Button variant="ghost" onClick={onBack}>
             <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
           </Button>
           <Button onClick={() => setShowAddForm(true)}>
             <Plus className="w-4 h-4 mr-2" />
             Add Product
           </Button>
         </div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Add New Product</span>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">Original Price (Optional)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={newProduct.original_price}
                    onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={newProduct.low_stock_threshold}
                    onChange={(e) => setNewProduct({...newProduct, low_stock_threshold: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input
                    id="weight"
                    value={newProduct.weight}
                    onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="L x W x H"
                    value={newProduct.dimensions}
                    onChange={(e) => setNewProduct({...newProduct, dimensions: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="product_benefits">Product Benefits</Label>
                  <Textarea
                    id="product_benefits"
                    value={newProduct.product_benefits}
                    onChange={(e) => setNewProduct({...newProduct, product_benefits: e.target.value})}
                    rows={3}
                    placeholder="List the benefits of this product"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="directions">Directions</Label>
                  <Textarea
                    id="directions"
                    value={newProduct.directions}
                    onChange={(e) => setNewProduct({...newProduct, directions: e.target.value})}
                    rows={3}
                    placeholder="How to use this product"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    value={newProduct.ingredients}
                    onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                    rows={3}
                    placeholder="List of ingredients"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="nutrition_facts">Nutrition Facts (JSON)</Label>
                  <Textarea
                    id="nutrition_facts"
                    value={newProduct.nutrition_facts ? 
                      (typeof newProduct.nutrition_facts === 'string' ? 
                        newProduct.nutrition_facts : 
                        JSON.stringify(newProduct.nutrition_facts, null, 2)) : 
                      '{}'}
                    onChange={(e) => {
                      try {
                        // On stocke la valeur brute comme une chaîne
                        setNewProduct({...newProduct, nutrition_facts: e.target.value});
                      } catch (error) {
                        console.error('Error updating nutrition facts:', error);
                      }
                    }}
                    rows={5}
                    placeholder='{"calories": 100, "protein": "25g", "carbs": "5g", "fat": "2g"}'
                  />
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newProduct.is_active}
                    onChange={(e) => setNewProduct({...newProduct, is_active: e.target.checked})}
                  />
                  <Label htmlFor="is_active">Active Product</Label>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="mr-2">
                    <Save className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">${product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.original_price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stock:</span>
                    <span className={`text-sm font-medium ${
                      product.stock_quantity <= 10 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.stock_quantity} units
                      {product.stock_quantity <= 10 && (
                        <AlertTriangle className="inline w-4 h-4 ml-1" />
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sales:</span>
                    <span className="text-sm">{product.sales_count || 0} sold</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rating:</span>
                    <span className="text-sm">{product.rating}/5 ({product.review_count} reviews)</span>
                  </div>
                  {product.is_featured && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Featured
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Start by adding your first product'}
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-amber-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit Product</span>
                <Button variant="ghost" size="sm" onClick={() => setEditingProduct(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  price: parseFloat(formData.get('price')),
                  original_price: formData.get('original_price') ? parseFloat(formData.get('original_price')) : null,
                  category: formData.get('category'),
                  stock_quantity: parseInt(formData.get('stock_quantity')),
                  low_stock_threshold: parseInt(formData.get('low_stock_threshold')),
                  sku: formData.get('sku'),
                  weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
                  dimensions: formData.get('dimensions'),
                  rating: parseFloat(formData.get('rating') || 0),
                  review_count: parseInt(formData.get('review_count') || 0),
                  image_url: formData.get('image_url'),
                  featured: formData.get('featured') === 'on',
                  is_active: formData.get('is_active') === 'on',
                  product_benefits: formData.get('product_benefits') || '',
                  directions: formData.get('directions') || '',
                  ingredients: formData.get('ingredients') || '',
                  nutrition_facts: formData.get('nutrition_facts') ? JSON.parse(formData.get('nutrition_facts')) : {}
                };
                handleUpdateProduct(editingProduct.id, updatedData);
              }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_name">Product Name</Label>
                  <Input
                    id="edit_name"
                    name="name"
                    defaultValue={editingProduct.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_category">Category</Label>
                  <Input
                    id="edit_category"
                    name="category"
                    defaultValue={editingProduct.category}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_price">Price</Label>
                  <Input
                    id="edit_price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.price}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_original_price">Original Price (Optional)</Label>
                  <Input
                    id="edit_original_price"
                    name="original_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.original_price || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_stock">Stock Quantity</Label>
                  <Input
                    id="edit_stock"
                    name="stock_quantity"
                    type="number"
                    defaultValue={editingProduct.stock_quantity}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_low_stock_threshold">Low Stock Threshold</Label>
                  <Input
                    id="edit_low_stock_threshold"
                    name="low_stock_threshold"
                    type="number"
                    defaultValue={editingProduct.low_stock_threshold || 10}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_sku">SKU</Label>
                  <Input
                    id="edit_sku"
                    name="sku"
                    defaultValue={editingProduct.sku || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_weight">Weight (g)</Label>
                  <Input
                    id="edit_weight"
                    name="weight"
                    defaultValue={editingProduct.weight || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_dimensions">Dimensions</Label>
                  <Input
                    id="edit_dimensions"
                    name="dimensions"
                    placeholder="L x W x H"
                    defaultValue={editingProduct.dimensions || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_rating">Rating</Label>
                  <Input
                    id="edit_rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    defaultValue={editingProduct.rating || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_review_count">Review Count</Label>
                  <Input
                    id="edit_review_count"
                    name="review_count"
                    type="number"
                    defaultValue={editingProduct.review_count || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_image_url">Image URL</Label>
                  <Input
                    id="edit_image_url"
                    name="image_url"
                    defaultValue={editingProduct.image_url || ''}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit_description">Description</Label>
                  <Textarea
                    id="edit_description"
                    name="description"
                    defaultValue={editingProduct.description || ''}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit_product_benefits">Product Benefits</Label>
                  <Textarea
                    id="edit_product_benefits"
                    name="product_benefits"
                    defaultValue={editingProduct.product_benefits || ''}
                    rows={3}
                    placeholder="List the benefits of this product"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit_directions">Directions</Label>
                  <Textarea
                    id="edit_directions"
                    name="directions"
                    defaultValue={editingProduct.directions || ''}
                    rows={3}
                    placeholder="How to use this product"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit_ingredients">Ingredients</Label>
                  <Textarea
                    id="edit_ingredients"
                    name="ingredients"
                    defaultValue={editingProduct.ingredients || ''}
                    rows={3}
                    placeholder="List of ingredients"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit_nutrition_facts">Nutrition Facts (JSON)</Label>
                  <Textarea
                    id="edit_nutrition_facts"
                    name="nutrition_facts"
                    defaultValue={editingProduct.nutrition_facts ? JSON.stringify(editingProduct.nutrition_facts, null, 2) : '{}'}
                    rows={5}
                    placeholder='{"calories": 100, "protein": "25g", "carbs": "5g", "fat": "2g"}'
                  />
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_featured"
                    name="featured"
                    defaultChecked={editingProduct.featured}
                  />
                  <Label htmlFor="edit_featured">Featured Product</Label>
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_is_active"
                    name="is_active"
                    defaultChecked={editingProduct.is_active}
                  />
                  <Label htmlFor="edit_is_active">Active Product</Label>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="mr-2">
                    <Save className="w-4 h-4 mr-2" />
                    Update Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
