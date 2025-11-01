import requests
import json
import sys
import time

# Configuration
BASE_URL = 'http://localhost:5000/api'

def login(email, password):
    """Connexion et récupération du token"""
    response = requests.post(
        f'{BASE_URL}/auth/login',
        json={'email': email, 'password': password}
    )
    
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print(f"Échec de connexion: {response.status_code} - {response.text}")
        return None

def get_order_details(order_id, token):
    """Récupérer les détails d'une commande"""
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/orders/{order_id}', headers=headers)
    
    print(f"Statut de la réponse: {response.status_code}")
    print(f"Contenu de la réponse: {response.text}")
    
    return response

def update_order_status(order_id, new_status, token):
    """Mettre à jour le statut d'une commande"""
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.put(
        f'{BASE_URL}/orders/{order_id}/status',
        headers=headers,
        json={'status': new_status}
    )
    
    print(f"Statut de la mise à jour: {response.status_code}")
    print(f"Contenu de la réponse: {response.text}")
    
    return response

def main():
    # 1. Test avec un utilisateur admin
    print("\n=== TEST AVEC ADMIN ===")
    admin_token = login('admin@samurai-nutrition.com', 'admin123')
    if not admin_token:
        print("Impossible de continuer sans token admin")
        return
    
    # Récupérer une commande (ID 17 par exemple)
    order_id = 17
    print(f"\nRécupération des détails de la commande {order_id} (avant mise à jour):")
    response_before = get_order_details(order_id, admin_token)
    
    if response_before.status_code == 200:
        # Mettre à jour le statut
        print(f"\nMise à jour du statut de la commande {order_id} à 'processing':")
        update_response = update_order_status(order_id, 'processing', admin_token)
        
        # Attendre un peu pour s'assurer que la mise à jour est prise en compte
        time.sleep(1)
        
        # Vérifier les détails après mise à jour
        print(f"\nRécupération des détails de la commande {order_id} (après mise à jour):")
        response_after = get_order_details(order_id, admin_token)
        
        # Remettre le statut à 'pending'
        print(f"\nRemise du statut de la commande {order_id} à 'pending':")
        reset_response = update_order_status(order_id, 'pending', admin_token)
    
    # 2. Test avec un utilisateur client (propriétaire de la commande)
    print("\n=== TEST AVEC CLIENT (PROPRIÉTAIRE) ===")
    # Récupérer l'ID du client propriétaire de la commande
    if response_before.status_code == 200:
        order_data = response_before.json().get('order', {})
        user_id = order_data.get('user_id')
        print(f"ID du client propriétaire: {user_id}")
        
        # Connexion en tant que client (à adapter selon les données disponibles)
        client_token = login('client@example.com', 'password123')
        if client_token:
            print(f"\nRécupération des détails de la commande {order_id} par le client:")
            client_response = get_order_details(order_id, client_token)
    
    # 3. Test avec un autre client (non propriétaire)
    print("\n=== TEST AVEC CLIENT (NON PROPRIÉTAIRE) ===")
    other_client_token = login('other@example.com', 'password123')
    if other_client_token:
        print(f"\nTentative d'accès à la commande {order_id} par un autre client:")
        other_response = get_order_details(order_id, other_client_token)
        # Devrait retourner une erreur 403 (Permission insuffisante)

if __name__ == "__main__":
    main()