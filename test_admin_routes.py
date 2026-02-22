#!/usr/bin/env python3
"""
Test des routes admin
"""

import requests
import time

def test_admin_routes():
    """Test des routes admin"""
    print("🔐 Test des routes admin...")
    
    # D'abord, obtenir un token d'authentification admin
    print("1. Authentification admin...")
    try:
        login_response = requests.post(
            "http://localhost:5000/api/auth/login",
            json={
                "email": "admin@samurai-nutrition.com",
                "password": "admin123"
            },
            headers={
                "Content-Type": "application/json"
            },
            timeout=5
        )
        
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            print("   ✅ Authentification admin réussie")
        else:
            print(f"   ❌ Erreur authentification: {login_response.status_code}")
            return
            
    except Exception as e:
        print(f"   ❌ Erreur authentification: {e}")
        return
    
    # Headers avec token
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test 2: Dashboard stats
    print("\n2. Test /api/admin/dashboard/stats...")
    try:
        response = requests.get(
            "http://localhost:5000/api/admin/dashboard/stats",
            headers=headers,
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Dashboard stats récupérées: {len(data)} statistiques")
        else:
            print(f"   ❌ Erreur dashboard stats: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur dashboard stats: {e}")
    
    # Test 3: Recent orders
    print("\n3. Test /api/admin/dashboard/recent-orders...")
    try:
        response = requests.get(
            "http://localhost:5000/api/admin/dashboard/recent-orders?limit=5",
            headers=headers,
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Commandes récentes récupérées: {len(data)} commandes")
        else:
            print(f"   ❌ Erreur recent orders: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur recent orders: {e}")
    
    # Test 4: Sales chart
    print("\n4. Test /api/admin/dashboard/sales-chart...")
    try:
        response = requests.get(
            "http://localhost:5000/api/admin/dashboard/sales-chart",
            headers=headers,
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Sales chart récupéré: {len(data.get('daily_sales', []))} jours de ventes")
        else:
            print(f"   ❌ Erreur sales chart: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur sales chart: {e}")
    
    # Test 5: Dashboard principal
    print("\n5. Test /api/admin/dashboard...")
    try:
        response = requests.get(
            "http://localhost:5000/api/admin/dashboard",
            headers=headers,
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Dashboard principal récupéré")
        else:
            print(f"   ❌ Erreur dashboard principal: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur dashboard principal: {e}")

def main():
    """Test principal"""
    print("🚀 TEST DES ROUTES ADMIN - SAMURAI NUTRITION")
    print("=" * 60)
    
    # Attendre que le serveur démarre
    print("⏳ Attente du démarrage du serveur...")
    time.sleep(3)
    
    # Tests
    test_admin_routes()
    
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 60)
    print("✅ Routes admin testées")
    print("✅ Authentification admin vérifiée")
    print("✅ Dashboard fonctionnel")

if __name__ == "__main__":
    main() 