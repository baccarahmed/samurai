#!/usr/bin/env python3
"""
Test des routes d'authentification et CORS
"""

import requests
import time

def test_auth_routes():
    """Test des routes d'authentification"""
    print("🔐 Test des routes d'authentification...")
    
    # Test 1: Requête OPTIONS pour /api/auth/register
    print("1. Test OPTIONS /api/auth/register...")
    try:
        response = requests.options(
            "http://localhost:5000/api/auth/register",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type,Authorization"
            },
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("   ✅ OPTIONS /api/auth/register réussie")
        else:
            print(f"   ❌ Erreur OPTIONS /api/auth/register: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Erreur OPTIONS /api/auth/register: {e}")
    
    # Test 2: Requête OPTIONS pour /api/auth/login
    print("\n2. Test OPTIONS /api/auth/login...")
    try:
        response = requests.options(
            "http://localhost:5000/api/auth/login",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type,Authorization"
            },
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("   ✅ OPTIONS /api/auth/login réussie")
        else:
            print(f"   ❌ Erreur OPTIONS /api/auth/login: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Erreur OPTIONS /api/auth/login: {e}")
    
    # Test 3: Requête POST pour /api/auth/register
    print("\n3. Test POST /api/auth/register...")
    try:
        response = requests.post(
            "http://localhost:5000/api/auth/register",
            json={
                "first_name": "Test",
                "last_name": "User",
                "email": "test@example.com",
                "password": "password123"
            },
            headers={
                "Origin": "http://localhost:5173",
                "Content-Type": "application/json"
            },
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"   ✅ POST /api/auth/register réussie: {data.get('message', 'N/A')}")
        else:
            print(f"   ❌ Erreur POST /api/auth/register: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur POST /api/auth/register: {e}")
    
    # Test 4: Requête POST pour /api/auth/login
    print("\n4. Test POST /api/auth/login...")
    try:
        response = requests.post(
            "http://localhost:5000/api/auth/login",
            json={
                "email": "admin@samurai-nutrition.com",
                "password": "admin123"
            },
            headers={
                "Origin": "http://localhost:5173",
                "Content-Type": "application/json"
            },
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ POST /api/auth/login réussie: {data.get('message', 'N/A')}")
        else:
            print(f"   ❌ Erreur POST /api/auth/login: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur POST /api/auth/login: {e}")

def test_cors_headers():
    """Test des en-têtes CORS"""
    print("\n🌐 Test des en-têtes CORS...")
    
    try:
        response = requests.get("http://localhost:5000/api/health", timeout=5)
        headers = response.headers
        
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers'
        ]
        
        for header in cors_headers:
            if header in headers:
                print(f"   ✅ {header}: {headers[header]}")
            else:
                print(f"   ❌ {header} manquant")
                
    except Exception as e:
        print(f"   ❌ Erreur vérification CORS: {e}")

def main():
    """Test principal"""
    print("🚀 TEST DES ROUTES D'AUTHENTIFICATION ET CORS")
    print("=" * 60)
    
    # Attendre que le serveur démarre
    print("⏳ Attente du démarrage du serveur...")
    time.sleep(3)
    
    # Tests
    test_auth_routes()
    test_cors_headers()
    
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 60)
    print("✅ Routes d'authentification testées")
    print("✅ En-têtes CORS vérifiés")
    print("✅ Requêtes OPTIONS testées")

if __name__ == "__main__":
    main() 