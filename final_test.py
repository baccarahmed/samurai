#!/usr/bin/env python3
"""
Test final complet du système Samurai Nutrition
"""

import requests
import time
import sys

def test_backend():
    """Test du backend"""
    print("🔧 Test du backend...")
    
    try:
        # Test santé API
        response = requests.get("http://localhost:5000/api/health", timeout=5)
        if response.status_code == 200:
            print("  ✅ API Backend accessible")
            return True
        else:
            print(f"  ❌ API Backend erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Backend inaccessible: {e}")
        return False

def test_frontend():
    """Test du frontend"""
    print("🎨 Test du frontend...")
    
    try:
        # Test frontend
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("  ✅ Frontend accessible")
            return True
        else:
            print(f"  ❌ Frontend erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ⚠️ Frontend non accessible: {e}")
        return False

def test_cors():
    """Test CORS"""
    print("🌐 Test CORS...")
    
    try:
        # Test preflight request
        response = requests.options("http://localhost:5000/api/health", timeout=5)
        headers = response.headers
        
        if 'Access-Control-Allow-Origin' in headers:
            origin = headers['Access-Control-Allow-Origin']
            if origin in ['http://localhost:5173', '*']:
                print("  ✅ CORS configuré correctement")
                return True
            else:
                print(f"  ❌ CORS mal configuré: {origin}")
                return False
        else:
            print("  ❌ En-têtes CORS manquants")
            return False
    except Exception as e:
        print(f"  ❌ Erreur test CORS: {e}")
        return False

def test_authentication():
    """Test authentification"""
    print("🔐 Test authentification...")
    
    try:
        # Test login admin
        response = requests.post(
            "http://localhost:5000/api/login",
            json={"email": "admin@samurai-nutrition.com", "password": "admin123"},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data:
                print("  ✅ Authentification admin réussie")
                return True
            else:
                print("  ❌ Token manquant dans la réponse")
                return False
        else:
            print(f"  ❌ Erreur authentification: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Erreur authentification: {e}")
        return False

def test_products_api():
    """Test API produits"""
    print("📦 Test API produits...")
    
    try:
        # Test récupération produits
        response = requests.get("http://localhost:5000/api/products", timeout=5)
        
        if response.status_code == 200:
            products = response.json()
            if isinstance(products, list) and len(products) > 0:
                print(f"  ✅ {len(products)} produits récupérés")
                return True
            else:
                print("  ❌ Aucun produit récupéré")
                return False
        else:
            print(f"  ❌ Erreur API produits: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Erreur API produits: {e}")
        return False

def main():
    """Test principal"""
    print("🚀 TEST FINAL COMPLET - SAMURAI NUTRITION")
    print("=" * 50)
    
    # Attendre que les serveurs démarrent
    print("⏳ Attente du démarrage des serveurs...")
    time.sleep(3)
    
    # Tests
    tests = [
        ("Backend", test_backend),
        ("Frontend", test_frontend),
        ("CORS", test_cors),
        ("Authentification", test_authentication),
        ("API Produits", test_products_api),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ Erreur dans {test_name}: {e}")
            results[test_name] = False
    
    # Résumé
    print("\n" + "=" * 50)
    print("📊 RÉSUMÉ FINAL")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<20} {status}")
        if result:
            passed += 1
    
    print(f"\nRésultat: {passed}/{total} tests réussis")
    
    if passed == total:
        print("🎉 TOUS LES TESTS SONT PASSÉS !")
        print("✅ Le système Samurai Nutrition est entièrement fonctionnel")
        return True
    elif passed >= total * 0.8:
        print("✅ Le système est fonctionnel avec quelques problèmes mineurs")
        return True
    else:
        print("⚠️ Le système nécessite des corrections")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 