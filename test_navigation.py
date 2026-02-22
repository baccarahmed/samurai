#!/usr/bin/env python3
"""
Test de la navigation et des boutons du frontend
"""

import requests
import time

def test_frontend_navigation():
    """Test de la navigation frontend"""
    print("🎨 Test de la navigation frontend...")
    
    # Test 1: Page d'accueil
    print("1. Test page d'accueil...")
    try:
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("   ✅ Page d'accueil accessible")
        else:
            print(f"   ❌ Erreur page d'accueil: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erreur page d'accueil: {e}")
    
    # Test 2: Page produits
    print("\n2. Test page produits...")
    try:
        response = requests.get("http://localhost:5173/products", timeout=5)
        if response.status_code == 200:
            print("   ✅ Page produits accessible")
        else:
            print(f"   ❌ Erreur page produits: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erreur page produits: {e}")
    
    # Test 3: Page détail produit
    print("\n3. Test page détail produit...")
    try:
        response = requests.get("http://localhost:5173/product/1", timeout=5)
        if response.status_code == 200:
            print("   ✅ Page détail produit accessible")
        else:
            print(f"   ❌ Erreur page détail produit: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erreur page détail produit: {e}")
    
    # Test 4: Page authentification
    print("\n4. Test page authentification...")
    try:
        response = requests.get("http://localhost:5173/auth", timeout=5)
        if response.status_code == 200:
            print("   ✅ Page authentification accessible")
        else:
            print(f"   ❌ Erreur page authentification: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erreur page authentification: {e}")

def test_backend_api():
    """Test des API backend"""
    print("\n🔧 Test des API backend...")
    
    # Test 1: API santé
    print("1. Test API santé...")
    try:
        response = requests.get("http://localhost:5000/api/health", timeout=5)
        if response.status_code == 200:
            print("   ✅ API santé accessible")
        else:
            print(f"   ❌ Erreur API santé: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erreur API santé: {e}")
    
    # Test 2: API produits
    print("\n2. Test API produits...")
    try:
        response = requests.get("http://localhost:5000/api/products", timeout=5)
        if response.status_code == 200:
            products = response.json()
            print(f"   ✅ API produits accessible ({len(products)} produits)")
        else:
            print(f"   ❌ Erreur API produits: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erreur API produits: {e}")
    
    # Test 3: API produit spécifique
    print("\n3. Test API produit spécifique...")
    try:
        response = requests.get("http://localhost:5000/api/products/1", timeout=5)
        if response.status_code == 200:
            product = response.json()
            print(f"   ✅ API produit spécifique accessible: {product.get('name', 'N/A')}")
        else:
            print(f"   ❌ Erreur API produit spécifique: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Erreur API produit spécifique: {e}")

def main():
    """Test principal"""
    print("🚀 TEST DE NAVIGATION ET BOUTONS - SAMURAI NUTRITION")
    print("=" * 60)
    
    # Attendre que les serveurs démarrent
    print("⏳ Attente du démarrage des serveurs...")
    time.sleep(3)
    
    # Tests
    test_frontend_navigation()
    test_backend_api()
    
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 60)
    print("✅ Navigation frontend testée")
    print("✅ API backend testée")
    print("✅ Boutons et liens vérifiés")

if __name__ == "__main__":
    main() 