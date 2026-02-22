import requests
import json
import time
import sqlite3
import os

# Configuration
BASE_URL = 'http://localhost:5000/api'
DB_PATH = 'src/nutrition.db'

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

def get_order_from_db(order_id):
    """Récupérer les détails d'une commande directement depuis la base de données"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Récupérer les informations de base de la commande
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        order = cursor.fetchone()
        
        if order:
            # Convertir en dictionnaire
            order_dict = {key: order[key] for key in order.keys()}
            
            # Récupérer l'historique des statuts
            cursor.execute("SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at DESC", (order_id,))
            status_history = [dict(row) for row in cursor.fetchall()]
            order_dict['status_history'] = status_history
            
            return order_dict
        else:
            return None
    except Exception as e:
        print(f"Erreur lors de l'accès à la base de données: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_order_via_api(order_id, token):
    """Récupérer les détails d'une commande via l'API"""
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/orders/{order_id}', headers=headers)
    return response

def update_order_status(order_id, new_status, token):
    """Mettre à jour le statut d'une commande via l'API"""
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.put(
        f'{BASE_URL}/orders/{order_id}/status',
        headers=headers,
        json={'status': new_status}
    )
    return response

def update_order_status_in_db(order_id, new_status):
    """Mettre à jour le statut d'une commande directement dans la base de données"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Mettre à jour le statut dans la table orders
        cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (new_status, order_id))
        
        # Ajouter une entrée dans l'historique des statuts
        cursor.execute(
            "INSERT INTO order_status_history (order_id, status, created_at) VALUES (?, ?, datetime('now'))",
            (order_id, new_status)
        )
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Erreur lors de la mise à jour dans la base de données: {e}")
        return False
    finally:
        if conn:
            conn.close()

def main():
    # Se connecter en tant qu'admin
    admin_token = login('admin@samurai-nutrition.com', 'admin123')
    if not admin_token:
        print("Impossible de continuer sans token admin")
        return
    
    order_id = 17  # ID de commande à tester
    
    # 1. Vérifier l'état initial
    print("\n=== ÉTAT INITIAL ===")
    db_order = get_order_from_db(order_id)
    print(f"Statut dans la DB: {db_order['status']}")
    
    api_response = get_order_via_api(order_id, admin_token)
    if api_response.status_code == 200:
        api_order = api_response.json().get('order', {})
        print(f"Statut via API: {api_order.get('status')}")
    else:
        print(f"Erreur API: {api_response.status_code} - {api_response.text}")
    
    # 2. Mettre à jour via API
    print("\n=== MISE À JOUR VIA API ===")
    update_response = update_order_status(order_id, 'processing', admin_token)
    print(f"Réponse de mise à jour: {update_response.status_code} - {update_response.text}")
    
    # Attendre un peu pour s'assurer que la mise à jour est prise en compte
    time.sleep(1)
    
    # Vérifier après mise à jour API
    db_order = get_order_from_db(order_id)
    print(f"Statut dans la DB après mise à jour API: {db_order['status']}")
    
    api_response = get_order_via_api(order_id, admin_token)
    if api_response.status_code == 200:
        api_order = api_response.json().get('order', {})
        print(f"Statut via API après mise à jour API: {api_order.get('status')}")
    else:
        print(f"Erreur API: {api_response.status_code} - {api_response.text}")
    
    # 3. Mettre à jour directement dans la DB
    print("\n=== MISE À JOUR DIRECTE DANS LA DB ===")
    update_success = update_order_status_in_db(order_id, 'shipped')
    print(f"Mise à jour DB réussie: {update_success}")
    
    # Vérifier après mise à jour DB
    db_order = get_order_from_db(order_id)
    print(f"Statut dans la DB après mise à jour directe: {db_order['status']}")
    
    api_response = get_order_via_api(order_id, admin_token)
    if api_response.status_code == 200:
        api_order = api_response.json().get('order', {})
        print(f"Statut via API après mise à jour directe DB: {api_order.get('status')}")
    else:
        print(f"Erreur API: {api_response.status_code} - {api_response.text}")
    
    # 4. Remettre à l'état initial
    print("\n=== REMISE À L'ÉTAT INITIAL ===")
    update_response = update_order_status(order_id, 'pending', admin_token)
    print(f"Réponse de remise à l'état initial: {update_response.status_code}")

if __name__ == "__main__":
    main()