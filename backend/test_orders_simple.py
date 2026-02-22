from src.main_fixed import app
from src.extensions import db
import traceback
import json
from flask import Flask, request

# Fonction pour tester directement la logique de récupération des commandes
def test_orders_direct():
    with app.app_context():
        try:
            # Importer les modules nécessaires
            from src.routes.orders import get_orders
            
            # Créer un contexte de requête simulé
            with app.test_request_context('/api/orders', method='GET'):
                # Simuler un utilisateur authentifié avec des permissions admin
                request.user_id = 1  # ID de l'administrateur
                request.user_role = 'admin'  # Rôle administrateur
                
                # Appeler la fonction
                try:
                    # Contourner la vérification JWT en appelant directement la fonction
                    # Définir manuellement l'identité de l'utilisateur
                    import flask_jwt_extended
                    flask_jwt_extended.utils._get_jwt_identity = lambda: 1
                    
                    response = get_orders()
                    print("\nRéponse de la route des commandes:")
                    if isinstance(response, tuple):
                        print(f"Status code: {response[1]}")
                        print(f"Contenu: {response[0].data.decode('utf-8')}")
                    else:
                        print(f"Status code: 200")
                        print(f"Contenu: {response.data.decode('utf-8')}")
                except Exception as e:
                    print(f"\nErreur lors de l'appel à get_orders: {str(e)}")
                    traceback.print_exc()
        except Exception as e:
            print(f"\nErreur lors du test de la route: {str(e)}")
            traceback.print_exc()

# Exécuter le test
if __name__ == '__main__':
    test_orders_direct()