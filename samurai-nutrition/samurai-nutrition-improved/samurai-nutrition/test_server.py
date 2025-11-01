#!/usr/bin/env python3
"""
Test simple du serveur
"""

import requests
import time

def test_server():
    """Test simple du serveur"""
    print("🔍 Test du serveur...")
    
    # Attendre que le serveur démarre
    for i in range(10):
        try:
            response = requests.get("http://localhost:5000/health", timeout=5)
            if response.status_code == 200:
                print("✅ Serveur accessible!")
                return True
        except:
            print(f"⏳ Tentative {i+1}/10...")
            time.sleep(2)
    
    print("❌ Serveur non accessible")
    return False

if __name__ == "__main__":
    test_server() 