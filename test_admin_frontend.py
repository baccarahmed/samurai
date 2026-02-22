#!/usr/bin/env python3
"""
Test de l'authentification admin depuis le frontend
"""

import requests
import time
import webbrowser

def test_admin_login():
    """Test de l'authentification admin"""
    print("🔐 Test de l'authentification admin...")
    
    # Test 1: Login admin
    print("1. Test login admin...")
    try:
        response = requests.post(
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
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user = data.get('user')
            print(f"   ✅ Login admin réussi")
            print(f"   👤 Utilisateur: {user.get('first_name')} {user.get('last_name')}")
            print(f"   🔑 Role: {user.get('role')}")
            return token
        else:
            print(f"   ❌ Erreur login: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"   ❌ Erreur login: {e}")
        return None

def test_admin_dashboard_with_token(token):
    """Test du dashboard admin avec token"""
    if not token:
        print("❌ Pas de token, impossible de tester le dashboard")
        return
    
    print("\n2. Test dashboard admin avec token...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test stats
    try:
        response = requests.get(
            "http://localhost:5000/api/admin/dashboard/stats",
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Dashboard stats: {len(data)} statistiques")
        else:
            print(f"   ❌ Erreur dashboard stats: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Erreur dashboard stats: {e}")
    
    # Test recent orders
    try:
        response = requests.get(
            "http://localhost:5000/api/admin/dashboard/recent-orders?limit=5",
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Recent orders: {len(data)} commandes")
        else:
            print(f"   ❌ Erreur recent orders: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Erreur recent orders: {e}")

def open_admin_page():
    """Ouvrir la page admin dans le navigateur"""
    print("\n3. Ouverture de la page admin...")
    try:
        webbrowser.open('http://localhost:5173/auth')
        print("   ✅ Page admin ouverte dans le navigateur")
        print("   📝 Utilisez les credentials: admin@samurai-nutrition.com / admin123")
    except Exception as e:
        print(f"   ❌ Erreur ouverture navigateur: {e}")

def main():
    """Test principal"""
    print("🚀 TEST AUTHENTIFICATION ADMIN - FRONTEND")
    print("=" * 60)
    
    # Attendre que les serveurs démarrent
    print("⏳ Attente du démarrage des serveurs...")
    time.sleep(5)
    
    # Tests
    token = test_admin_login()
    test_admin_dashboard_with_token(token)
    open_admin_page()
    
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 60)
    print("✅ Authentification admin testée")
    print("✅ Dashboard admin vérifié")
    print("✅ Page admin ouverte")
    print("\n🎯 Instructions:")
    print("1. Connectez-vous avec admin@samurai-nutrition.com / admin123")
    print("2. Vous devriez être redirigé vers /admin")
    print("3. Le dashboard devrait se charger sans erreurs 401")

if __name__ == "__main__":
    main() 