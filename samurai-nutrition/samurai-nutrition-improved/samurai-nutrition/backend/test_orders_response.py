from src.main_fixed import app
from src.extensions import db
from flask import request, jsonify
import traceback
import json

# Fonction pour simuler une requête à la route des commandes
def test_orders_route():
    with app.app_context():
        try:
            # Importer la fonction get_orders depuis le module orders
            from src.routes.orders import get_orders
            
            # Créer un contexte de requête simulé
            with app.test_request_context('/api/orders', method='GET'):
                # Simuler un utilisateur authentifié avec des permissions admin
                request.user_id = 1  # ID de l'administrateur
                request.user_role = 'admin'  # Rôle administrateur
                
                # Appeler directement la fonction get_orders
                try:
                    response = get_orders()
                    print("\nRéponse de la route des commandes:")
                    if isinstance(response, tuple):
                        print(f"Status code: {response[1]}")
                        print(f"Contenu: {response[0].data.decode('utf-8')}")
                    else:
                        print(f"Status code: 200")
                        print(f"Contenu: {response.data.decode('utf-8')}")
                    return response
                except Exception as e:
                    print(f"\nErreur lors de l'appel à get_orders: {str(e)}")
                    traceback.print_exc()
        except Exception as e:
            print(f"\nErreur lors du test de la route: {str(e)}")
            traceback.print_exc()

# Exécuter le test
if __name__ == '__main__':
    test_orders_route()