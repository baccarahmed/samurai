import requests
import json
import time
import os
import sys

# Configuration
BASE_URL = 'http://localhost:5000/api'

def print_separator():
    print("\n" + "-" * 80 + "\n")

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

def check_file_usage():
    """Vérifier quels fichiers sont utilisés par l'application"""
    print("Vérification des fichiers utilisés par l'application...")
    
    # Vérifier si run.py utilise main.py ou main_fixed.py
    run_py_path = "run.py"
    if os.path.exists(run_py_path):
        with open(run_py_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if "from src.main import" in content:
                print("✅ run.py utilise src.main")
            elif "from src.main_fixed import" in content:
                print("✅ run.py utilise src.main_fixed")
            else:
                print("❓ Impossible de déterminer quel fichier main est utilisé")
    else:
        print(f"❌ Fichier {run_py_path} non trouvé")
    
    # Vérifier si main.py ou main_fixed.py importe orders.py ou orders_fixed.py
    main_py_path = "src/main.py"
    main_fixed_py_path = "src/main_fixed.py"
    
    if os.path.exists(main_py_path):
        with open(main_py_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if "from src.routes.orders import" in content:
                print("✅ main.py importe src.routes.orders")
            elif "from src.routes.orders_fixed import" in content:
                print("✅ main.py importe src.routes.orders_fixed")
            else:
                print("❓ Impossible de déterminer quel fichier orders est importé dans main.py")
    else:
        print(f"❌ Fichier {main_py_path} non trouvé")
    
    if os.path.exists(main_fixed_py_path):
        with open(main_fixed_py_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if "from src.routes.orders import" in content:
                print("✅ main_fixed.py importe src.routes.orders")
            elif "from src.routes.orders_fixed import" in content:
                print("✅ main_fixed.py importe src.routes.orders_fixed")
            else:
                print("❓ Impossible de déterminer quel fichier orders est importé dans main_fixed.py")
    else:
        print(f"❌ Fichier {main_fixed_py_path} non trouvé")

def test_endpoints(token):
    """Tester les différents endpoints pour voir lesquels fonctionnent"""
    print("Test des endpoints...")
    
    # Test de l'endpoint /orders-all
    print("\nTest de /orders-all:")
    response = requests.get(f'{BASE_URL}/orders-all', headers={'Authorization': f'Bearer {token}'})
    print(f"Statut: {response.status_code}")
    if response.status_code == 200:
        orders = response.json().get('orders', [])
        print(f"Nombre de commandes: {len(orders)}")
        if orders:
            order_id = orders[0].get('id')
            print(f"ID de la première commande: {order_id}")
            return order_id
    else:
        print(f"Réponse: {response.text}")
    
    return None

def test_order_detail(order_id, token):
    """Tester l'endpoint de détail d'une commande"""
    print(f"\nTest de /orders/{order_id}:")
    response = requests.get(f'{BASE_URL}/orders/{order_id}', headers={'Authorization': f'Bearer {token}'})
    print(f"Statut: {response.status_code}")
    print(f"Réponse: {response.text[:200]}" + ("..." if len(response.text) > 200 else ""))
    
    return response.status_code == 200

def test_order_status_update(order_id, token):
    """Tester la mise à jour du statut d'une commande"""
    print(f"\nTest de /orders/{order_id}/status:")
    response = requests.put(
        f'{BASE_URL}/orders/{order_id}/status',
        headers={'Authorization': f'Bearer {token}'},
        json={'status': 'processing'}
    )
    print(f"Statut: {response.status_code}")
    print(f"Réponse: {response.text}")
    
    return response.status_code == 200

def main():
    print_separator()
    print("VÉRIFICATION DE LA COHÉRENCE DES FICHIERS")
    check_file_usage()
    
    print_separator()
    print("CONNEXION ADMIN")
    token = login('admin@samurai-nutrition.com', 'admin123')
    if not token:
        print("Impossible de continuer sans token admin")
        return
    
    print_separator()
    print("TEST DES ENDPOINTS")
    order_id = test_endpoints(token)
    if not order_id:
        print("Impossible de continuer sans ID de commande")
        return
    
    print_separator()
    print("TEST DE DÉTAIL DE COMMANDE")
    detail_success = test_order_detail(order_id, token)
    
    print_separator()
    print("TEST DE MISE À JOUR DE STATUT")
    update_success = test_order_status_update(order_id, token)
    
    print_separator()
    print("RÉSUMÉ DES TESTS")
    print(f"Détail de commande: {'✅ Fonctionne' if detail_success else '❌ Ne fonctionne pas'}")
    print(f"Mise à jour de statut: {'✅ Fonctionne' if update_success else '❌ Ne fonctionne pas'}")
    
    if not detail_success and update_success:
        print("\n⚠️ PROBLÈME DÉTECTÉ: La mise à jour du statut fonctionne mais pas la récupération des détails.")
        print("Cela suggère une incohérence entre les fichiers orders.py et orders_fixed.py.")
        print("Recommandation: Utiliser uniquement orders.py ou orders_fixed.py, mais pas les deux.")

if __name__ == "__main__":
    main()