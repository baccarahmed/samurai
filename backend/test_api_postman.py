import requests
import json
import time

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
    
    print(f"Statut: {response.status_code}")
    print(f"Réponse: {response.text[:200]}" + ("..." if len(response.text) > 200 else ""))
    
    if response.status_code == 200:
        # Vérifier si le token est dans la réponse
        data = response.json()
        token = data.get('token') or data.get('access_token')
        if token:
            print("✅ Token récupéré avec succès")
            return token
        else:
            print("❌ Token non trouvé dans la réponse")
            return None
    else:
        return None

def get_order_details(order_id, token):
    """Récupérer les détails d'une commande"""
    print(f"Récupération des détails de la commande {order_id}")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/orders/{order_id}', headers=headers)
    
    print(f"Statut: {response.status_code}")
    print(f"Réponse: {response.text[:500]}" + ("..." if len(response.text) > 500 else ""))
    
    return response

def update_order_status(order_id, new_status, token):
    """Mettre à jour le statut d'une commande"""
    print(f"Mise à jour du statut de la commande {order_id} à '{new_status}'")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.put(
        f'{BASE_URL}/orders/{order_id}/status',
        headers=headers,
        json={'status': new_status}
    )
    
    print(f"Statut: {response.status_code}")
    print(f"Réponse: {response.text}")
    
    return response

def get_all_orders(token):
    """Récupérer toutes les commandes"""
    print("Récupération de toutes les commandes")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/orders-all', headers=headers)
    
    print(f"Statut: {response.status_code}")
    if response.status_code == 200:
        orders = response.json().get('orders', [])
        print(f"Nombre de commandes: {len(orders)}")
        if orders:
            print("Premières commandes:")
            for i, order in enumerate(orders[:3]):
                print(f"  {i+1}. ID: {order.get('id')}, Status: {order.get('status')}, User ID: {order.get('user_id')}")
    else:
        print(f"Réponse: {response.text}")
    
    return response

def main():
    # 1. Connexion en tant qu'admin
    print_separator()
    print("ÉTAPE 1: CONNEXION ADMIN")
    admin_token = login('admin@samurai-nutrition.com', 'admin123')
    if not admin_token:
        print("Échec de connexion admin. Impossible de continuer.")
        return
    
    # 2. Récupérer toutes les commandes pour trouver un ID valide
    print_separator()
    print("ÉTAPE 2: RÉCUPÉRATION DE TOUTES LES COMMANDES")
    orders_response = get_all_orders(admin_token)
    if orders_response.status_code != 200:
        print("Échec de récupération des commandes. Impossible de continuer.")
        return
    
    # Sélectionner une commande pour les tests
    orders = orders_response.json().get('orders', [])
    if not orders:
        print("Aucune commande trouvée. Impossible de continuer.")
        return
    
    order_id = orders[0].get('id')
    original_status = orders[0].get('status')
    print(f"Commande sélectionnée pour les tests: ID {order_id}, statut initial '{original_status}'")
    
    # 3. Récupérer les détails de la commande avant modification
    print_separator()
    print("ÉTAPE 3: DÉTAILS DE LA COMMANDE AVANT MODIFICATION")
    before_response = get_order_details(order_id, admin_token)
    if before_response.status_code != 200:
        print(f"Échec de récupération des détails de la commande {order_id}. Impossible de continuer.")
        return
    
    # 4. Mettre à jour le statut de la commande
    print_separator()
    print("ÉTAPE 4: MISE À JOUR DU STATUT")
    new_status = 'processing' if original_status != 'processing' else 'shipped'
    update_response = update_order_status(order_id, new_status, admin_token)
    if update_response.status_code != 200:
        print(f"Échec de mise à jour du statut de la commande {order_id}. Impossible de continuer.")
        return
    
    # 5. Récupérer les détails de la commande après modification
    print_separator()
    print("ÉTAPE 5: DÉTAILS DE LA COMMANDE APRÈS MODIFICATION")
    # Attendre un peu pour s'assurer que la mise à jour est prise en compte
    time.sleep(1)
    after_response = get_order_details(order_id, admin_token)
    
    # 6. Vérifier si la mise à jour a été prise en compte
    print_separator()
    print("ÉTAPE 6: VÉRIFICATION DE LA MISE À JOUR")
    if after_response.status_code == 200:
        after_data = after_response.json()
        after_status = after_data.get('order', {}).get('status')
        print(f"Statut après mise à jour: '{after_status}'")
        if after_status == new_status:
            print("✅ La mise à jour du statut a été correctement appliquée et est visible via l'API.")
        else:
            print(f"❌ La mise à jour du statut n'a pas été correctement appliquée. Attendu: '{new_status}', Obtenu: '{after_status}'")
    else:
        print(f"❌ Impossible de vérifier la mise à jour. Statut de la réponse: {after_response.status_code}")
    
    # 7. Remettre le statut d'origine
    print_separator()
    print("ÉTAPE 7: REMISE À L'ÉTAT INITIAL")
    reset_response = update_order_status(order_id, original_status, admin_token)
    if reset_response.status_code == 200:
        print(f"✅ Statut remis à '{original_status}'")
    else:
        print(f"❌ Échec de la remise à l'état initial. Statut de la réponse: {reset_response.status_code}")

if __name__ == "__main__":
    main()