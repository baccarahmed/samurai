import React, { useEffect } from 'react';
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductCategories from './components/ProductCategories';
import FeaturedProducts from './components/FeaturedProducts';
import EducationalHub from './components/EducationalHub';
import TrustIndicators from './components/TrustIndicators';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollReset from './components/ScrollReset';
import AuthPage from './components/AuthPage';
import { AllProducts, AdminDashboard, InventoryManagement, Wishlist, Cart, CheckoutPage, OrdersPage, AdminUsers, AdminAnalytics } from './pages';
import AdminOrdersPage from './pages/AdminOrdersPage';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import UserHistory from './pages/UserHistory';
import SmokeyBackground from './components/lightswind/smokey-background';
import AdminBundles from './pages/AdminBundles';

// Composant pour la page d'accueil
const HomePage = () => (
  <main>
    <HeroSection />
    <ProductCategories />
    <FeaturedProducts />
    <EducationalHub />
  </main>
);

// Composant principal de l'application avec routage
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Force le mode sombre comme design principal
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className="App relative">
      {/* Global background */}
      <div className="fixed inset-0 z-0">
        <SmokeyBackground color="#6a5d1de6" backdropBlurAmount="none" />
      </div>
      
      <div className="relative z-10">
        <Header 
          darkMode={true} 
          toggleDarkMode={() => {}} // Fonction vide car pas de toggle
          onSearch={handleSearch}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<OrdersPage />} /> {/* Ajoutez cette ligne */}
          <Route path="/history" element={<UserHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/inventory" element={<InventoryManagement />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/bundles" element={<AdminBundles />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {isHomePage && <Footer />}
        <ScrollToTop />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollReset />
        <AppContent />
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
