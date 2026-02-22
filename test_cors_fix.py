#!/usr/bin/env python3
"""
Test de la correction CORS
"""

import requests
import json

def test_cors_fix():
    """Test de la correction CORS"""
    print("🔧 Test de la correction CORS...")
    
    # Test 1: Requête OPTIONS (preflight)
    print("1. Test requête OPTIONS...")
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
            print("   ✅ Requête OPTIONS réussie")
        else:
            print(f"   ❌ Erreur OPTIONS: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Erreur OPTIONS: {e}")
    
    # Test 2: Requête POST réelle
    print("\n2. Test requête POST...")
    try:
        response = requests.post(
            "http://localhost:5000/api/auth/login",
            json={"email": "admin@samurai-nutrition.com", "password": "admin123"},
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
            print(f"   ✅ Login réussi: {data.get('message', 'N/A')}")
        else:
            print(f"   ❌ Erreur login: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur POST: {e}")
    
    # Test 3: Vérification CORS headers
    print("\n3. Vérification en-têtes CORS...")
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

if __name__ == "__main__":
    test_cors_fix() 