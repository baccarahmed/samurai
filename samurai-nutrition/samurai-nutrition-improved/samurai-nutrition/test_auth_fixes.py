#!/usr/bin/env python3
"""
Test script pour vérifier les corrections d'authentification et de routes
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_health():
    """Test de santé du serveur"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_auth_routes():
    """Test des routes d'authentification"""
    print("\n🔐 Test des routes d'authentification...")
    
    # Test de connexion admin
    admin_login_data = {
        "email": "admin@samurai-nutrition.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=admin_login_data)
        print(f"✅ Admin login: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user = data.get('user')
            print(f"   Token: {token[:20]}...")
            print(f"   User role: {user.get('role')}")
            
            # Test de vérification de token
            verify_response = requests.post(f"{BASE_URL}/api/auth/verify-token", 
                                         json={"token": token})
            print(f"✅ Token verification: {verify_response.status_code}")
            
            return token, user
        else:
            print(f"   Error: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Auth test failed: {e}")
        return None, None

def test_admin_routes(token):
    """Test des routes admin avec token"""
    if not token:
        print("❌ No token available for admin tests")
        return
    
    print("\n👑 Test des routes admin...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test dashboard stats
    try:
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/stats", headers=headers)
        print(f"✅ Dashboard stats: {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard stats failed: {e}")
    
    # Test recent orders
    try:
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/recent-orders?limit=5", headers=headers)
        print(f"✅ Recent orders: {response.status_code}")
    except Exception as e:
        print(f"❌ Recent orders failed: {e}")
    
    # Test sales chart
    try:
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/sales-chart", headers=headers)
        print(f"✅ Sales chart: {response.status_code}")
    except Exception as e:
        print(f"❌ Sales chart failed: {e}")

def test_product_routes():
    """Test des routes de produits"""
    print("\n📦 Test des routes de produits...")
    
    # Test des catégories
    try:
        response = requests.get(f"{BASE_URL}/api/products/categories")
        print(f"✅ Product categories: {response.status_code}")
        if response.status_code == 200:
            categories = response.json()
            print(f"   Categories: {categories}")
    except Exception as e:
        print(f"❌ Product categories failed: {e}")
    
    # Test des produits
    try:
        response = requests.get(f"{BASE_URL}/api/products")
        print(f"✅ Products: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"   Products count: {len(products)}")
    except Exception as e:
        print(f"❌ Products failed: {e}")

def test_cors():
    """Test CORS"""
    print("\n🌐 Test CORS...")
    
    try:
        # Test OPTIONS request
        response = requests.options(f"{BASE_URL}/api/auth/login")
        print(f"✅ CORS OPTIONS: {response.status_code}")
        
        # Vérifier les headers CORS
        cors_headers = response.headers.get('Access-Control-Allow-Origin')
        if cors_headers:
            print(f"   CORS Origin: {cors_headers}")
        else:
            print("   ⚠️ No CORS headers found")
            
    except Exception as e:
        print(f"❌ CORS test failed: {e}")

def main():
    """Fonction principale de test"""
    print("🚀 Test des corrections d'authentification et de routes")
    print("=" * 60)
    
    # Attendre que le serveur démarre
    print("⏳ Attente du démarrage du serveur...")
    time.sleep(3)
    
    # Tests
    if not test_health():
        print("❌ Serveur non accessible")
        return
    
    test_cors()
    token, user = test_auth_routes()
    test_admin_routes(token)
    test_product_routes()
    
    print("\n" + "=" * 60)
    print("✅ Tests terminés!")

if __name__ == "__main__":
    main() 