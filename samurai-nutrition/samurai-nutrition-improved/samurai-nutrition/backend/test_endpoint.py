import requests
import json

# Configuration
BASE_URL = 'http://localhost:5000/api'

def login(email, password):
    """Connexion et récupération du token"""
    print(f"Tentative de connexion avec {email}")
    response = requests.post(
        f'{BASE_URL}/auth/login',
        json={'email': email, 'password': password}
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('token') or data.get('access_token')
        if token:
            print("✅ Token récupéré avec succès")
            return token
        else:
            print("❌ Token non trouvé dans la réponse")
            return None
    else:
        print(f"❌ Échec de connexion: {response.status_code} - {response.text}")
        return None

def test_direct_endpoint(token):
    """Tester l'endpoint direct dans main_fixed.py"""
    print("\nTest de l'endpoint direct dans main_fixed.py:")
    for order_id in range(1, 20):
        print(f"\nTest de /api/orders/{order_id}:")
        response = requests.get(
            f'{BASE_URL}/orders/{order_id}',
            headers={'Authorization': f'Bearer {token}'}
        )
        print(f"Statut: {response.status_code}")
        print(f"Réponse: {response.text[:200]}" + ("..." if len(response.text) > 200 else ""))
        
        if response.status_code == 200:
            print(f"✅ L'endpoint fonctionne pour la commande {order_id}")
            break
    else:
        print("❌ L'endpoint ne fonctionne pour aucune des commandes testées")

def main():
    print("\n" + "-" * 80 + "\n")
    print("TEST DE L'ENDPOINT DIRECT")
    
    # Connexion admin
    token = login('admin@samurai-nutrition.com', 'admin123')
    if not token:
        print("Impossible de continuer sans token admin")
        return
    
    # Test de l'endpoint direct
    test_direct_endpoint(token)

if __name__ == "__main__":
    main()