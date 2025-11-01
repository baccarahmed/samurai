#!/usr/bin/env python3
"""
Test simple pour vérifier l'authentification
"""

import requests
import time

BASE_URL = "http://localhost:5000"

def test_auth():
    """Test simple d'authentification"""
    print("🔐 Test d'authentification...")
    
    # Test de connexion admin
    login_data = {
        "email": "admin@samurai-nutrition.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connexion réussie!")
            print(f"Token: {data.get('token', '')[:20]}...")
            print(f"User: {data.get('user', {}).get('email')}")
            print(f"Role: {data.get('user', {}).get('role')}")
            return True
        else:
            print(f"❌ Erreur: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Test simple d'authentification")
    print("=" * 40)
    
    # Attendre que le serveur démarre
    print("⏳ Attente du serveur...")
    time.sleep(2)
    
    success = test_auth()
    
    if success:
        print("\n✅ Test réussi!")
    else:
        print("\n❌ Test échoué!") 