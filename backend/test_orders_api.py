from src.main_fixed import app
from src.extensions import db
from flask import jsonify, request
import traceback
import json
import logging
from flask_jwt_extended import create_access_token

# Configuration du logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('test_orders_api')

def test_orders_api():
    with app.app_context():
        try:
            # Importer les modèles nécessaires
            from src.models.order import Order, OrderItem, OrderStatusHistory
            from src.models.user import User
            from src.routes.orders import orders_bp
            
            logger.info("Début du test de l'API des commandes")
            
            # Vérifier l'utilisateur admin
            admin = User.query.filter_by(email='admin@samurai-nutrition.com').first()
            logger.info(f"Admin trouvé: {admin.id if admin else 'Non trouvé'}")
            
            # Créer un token JWT pour l'admin
            access_token = create_access_token(identity=admin.id)
            logger.info(f"Token créé")
            
            # Vérifier les routes enregistrées dans le Blueprint
            logger.info("Routes enregistrées dans orders_bp:")
            for rule in app.url_map.iter_rules():
                if rule.endpoint.startswith('orders_bp.'):
                    logger.info(f"  {rule} -> {rule.endpoint}")
            
            # Tester directement avec le client de test Flask
            logger.info("Test avec le client de test Flask")
            with app.test_client() as client:
                # Faire la requête avec le token
                headers = {'Authorization': f'Bearer {access_token}'}
                response = client.get('/api/orders', headers=headers)
                
                logger.info(f"Statut de la réponse: {response.status_code}")
                logger.info(f"En-têtes de la réponse: {response.headers}")
                
                try:
                    data = response.get_json()
                    logger.info(f"Contenu JSON: {json.dumps(data, indent=2)}")
                except Exception as json_error:
                    logger.error(f"Erreur lors du décodage JSON: {str(json_error)}")
                    logger.info(f"Contenu brut: {response.data.decode('utf-8')}")
                
                return response
                
        except Exception as e:
            logger.error(f"Erreur: {str(e)}")
            logger.error(traceback.format_exc())
            return {"error": str(e)}

def test_direct_serialization():
    with app.app_context():
        try:
            # Importer les modèles nécessaires
            from src.models.order import Order
            from src.routes.orders import get_orders
            
            logger.info("Test de sérialisation directe des commandes")
            
            # Récupérer toutes les commandes
            orders = Order.query.all()
            logger.info(f"Nombre de commandes trouvées: {len(orders)}")
            
            # Tester la sérialisation manuelle
            orders_list = []
            for order in orders:
                try:
                    # Vérifier les attributs de la commande
                    logger.info(f"Commande ID: {order.id}")
                    logger.info(f"Attributs disponibles: {dir(order)}")
                    
                    # Vérifier si order_items existe
                    if hasattr(order, 'order_items'):
                        logger.info(f"order_items existe avec {len(order.order_items)} éléments")
                    else:
                        logger.error("L'attribut order_items n'existe pas!")
                    
                    # Vérifier si status_history existe
                    if hasattr(order, 'status_history'):
                        logger.info(f"status_history existe avec {len(order.status_history)} éléments")
                    else:
                        logger.error("L'attribut status_history n'existe pas!")
                    
                    # Essayer d'accéder à la méthode to_dict si elle existe
                    if hasattr(order, 'to_dict'):
                        logger.info("Méthode to_dict trouvée, essai d'utilisation...")
                        order_dict = order.to_dict()
                        orders_list.append(order_dict)
                    else:
                        logger.error("La méthode to_dict n'existe pas!")
                        
                except Exception as order_error:
                    logger.error(f"Erreur lors du traitement de la commande {order.id}: {str(order_error)}")
                    logger.error(traceback.format_exc())
            
            # Essayer de sérialiser en JSON
            try:
                json_data = json.dumps({"orders": orders_list})
                logger.info("Sérialisation JSON réussie!")
                return {"success": True, "orders_count": len(orders_list)}
            except Exception as json_error:
                logger.error(f"Erreur lors de la sérialisation JSON: {str(json_error)}")
                logger.error(traceback.format_exc())
                return {"error": str(json_error)}
                
        except Exception as e:
            logger.error(f"Erreur: {str(e)}")
            logger.error(traceback.format_exc())
            return {"error": str(e)}

if __name__ == '__main__':
    logger.info("=== TEST DE L'API DES COMMANDES ===")
    test_orders_api()
    
    logger.info("\n=== TEST DE SÉRIALISATION DIRECTE ===")
    test_direct_serialization()