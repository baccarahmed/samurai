from src.main_fixed import app
from src.extensions import db
from flask import request, jsonify
import traceback
import json
from unittest.mock import patch

# Fonction pour simuler une requête à la route des commandes
def test_orders_route():
    with app.app_context():
        try:
            # Importer les modules nécessaires
            from src.routes.orders import Order, db
            from src.models.order import Order as OrderModel
            
            # Récupérer directement les commandes depuis la base de données
            try:
                # Récupérer toutes les commandes
                orders = db.session.query(OrderModel).all()
                print(f"Nombre de commandes trouvées: {len(orders)}")
                
                # Convertir les commandes en dictionnaires
                orders_dict_list = []
                for order in orders:
                    try:
                        order_dict = order.to_dict()
                        orders_dict_list.append(order_dict)
                        print(f"Commande {order.id} convertie avec succès")
                    except Exception as e:
                        print(f"Erreur lors de la conversion de la commande {order.id}: {str(e)}")
                        traceback.print_exc()
                        return
                
                # Créer une réponse similaire à celle de l'API
                response_data = {
                    'orders': orders_dict_list,
                    'pagination': {
                        'page': 1,
                        'per_page': 10,
                        'total': len(orders),
                        'pages': 1,
                        'has_next': False,
                        'has_prev': False
                    }
                }
                
                # Afficher la réponse
                print("\nRéponse simulée de la route des commandes:")
                print(f"Nombre de commandes: {len(orders_dict_list)}")
                print(json.dumps(response_data, indent=2))
                
            except Exception as e:
                print(f"\nErreur lors de la récupération des commandes: {str(e)}")
                traceback.print_exc()
        except Exception as e:
            print(f"\nErreur lors du test de la route: {str(e)}")
            traceback.print_exc()

# Exécuter le test
if __name__ == '__main__':
    test_orders_route()