#!/usr/bin/env python3
"""
Test complet du système Samurai Nutrition
"""

import requests
import time
import webbrowser

BASE_URL = "http://localhost:5000"
FRONTEND_URL = "http://localhost:5173"

def test_backend_health():
    """Test de santé du backend"""
    print("🔍 Test de santé du backend...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend en ligne")
            return True
        else:
            print(f"❌ Backend erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend inaccessible: {e}")
        return False

def test_auth_system():
    """Test du système d'authentification"""
    print("\n🔐 Test du système d'authentification...")
    
    # Test connexion admin
    admin_data = {
        "email": "admin@samurai-nutrition.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=admin_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user = data.get('user')
            print(f"✅ Admin connecté: {user.get('email')} (Role: {user.get('role')})")
            
            # Test vérification token
            verify_response = requests.post(f"{BASE_URL}/api/auth/verify-token", 
                                         json={"token": token})
            if verify_response.status_code == 200:
                print("✅ Token vérifié avec succès")
                return token
            else:
                print("❌ Échec vérification token")
                return None
        else:
            print(f"❌ Échec connexion admin: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erreur authentification: {e}")
        return None

def test_admin_routes(token):
    """Test des routes admin"""
    if not token:
        print("❌ Pas de token pour tester les routes admin")
        return
    
    print("\n👑 Test des routes admin...")
    headers = {"Authorization": f"Bearer {token}"}
    
    routes_to_test = [
        "/api/admin/dashboard/stats",
        "/api/admin/dashboard/recent-orders?limit=5",
        "/api/admin/dashboard/sales-chart"
    ]
    
    for route in routes_to_test:
        try:
            response = requests.get(f"{BASE_URL}{route}", headers=headers)
            if response.status_code == 200:
                print(f"✅ {route}")
            else:
                print(f"❌ {route}: {response.status_code}")
        except Exception as e:
            print(f"❌ {route}: {e}")

def test_product_routes():
    """Test des routes de produits"""
    print("\n📦 Test des routes de produits...")
    
    routes_to_test = [
        "/api/products",
        "/api/products/categories"
    ]
    
    for route in routes_to_test:
        try:
            response = requests.get(f"{BASE_URL}{route}")
            if response.status_code == 200:
                data = response.json()
                if route == "/api/products":
                    print(f"✅ {route}: {len(data)} produits")
                else:
                    print(f"✅ {route}: {len(data)} catégories")
            else:
                print(f"❌ {route}: {response.status_code}")
        except Exception as e:
            print(f"❌ {route}: {e}")

def test_cors():
    """Test CORS"""
    print("\n🌐 Test CORS...")
    try:
        response = requests.options(f"{BASE_URL}/api/auth/login")
        if response.status_code == 200:
            cors_headers = response.headers.get('Access-Control-Allow-Origin')
            if cors_headers:
                print(f"✅ CORS configuré: {cors_headers}")
            else:
                print("⚠️ CORS headers manquants")
        else:
            print(f"❌ CORS erreur: {response.status_code}")
    except Exception as e:
        print(f"❌ CORS test échoué: {e}")

def open_frontend():
    """Ouvre le frontend dans le navigateur"""
    print(f"\n🌐 Ouverture du frontend: {FRONTEND_URL}")
    try:
        webbrowser.open(FRONTEND_URL)
        print("✅ Frontend ouvert dans le navigateur")
    except Exception as e:
        print(f"❌ Impossible d'ouvrir le navigateur: {e}")

def main():
    """Test principal"""
    print("🚀 TEST COMPLET DU SYSTÈME SAMURAI NUTRITION")
    print("=" * 60)
    
    # Tests backend
    if not test_backend_health():
        print("❌ Backend non accessible - arrêt des tests")
        return
    
    test_cors()
    token = test_auth_system()
    test_admin_routes(token)
    test_product_routes()
    
    # Ouverture frontend
    open_frontend()
    
    print("\n" + "=" * 60)
    print("✅ TESTS TERMINÉS!")
    print("\n📋 Instructions:")
    print("1. Le frontend devrait s'ouvrir automatiquement")
    print("2. Allez sur http://localhost:5173/auth")
    print("3. Connectez-vous avec admin@samurai-nutrition.com / admin123")
    print("4. Vous devriez être redirigé vers le dashboard admin")
    print("5. Testez l'inscription d'un nouveau compte client")

if __name__ == "__main__":
    main() 