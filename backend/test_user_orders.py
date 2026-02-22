from src.main_fixed import app
from src.extensions import db
from flask import jsonify, request
import traceback
import json
import logging
from flask_jwt_extended import create_access_token

# Configuration du logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('test_user_orders')

def test_user_orders_route():
    with app.app_context():
        try:
            # Importer les modèles nécessaires
            from src.models.user import User
            
            logger.info("Début du test de la route /api/orders")
            
            # Vérifier l'utilisateur admin
            admin = User.query.filter_by(email='admin@samurai-nutrition.com').first()
            logger.info(f"Admin trouvé: {admin.id if admin else 'Non trouvé'}")
            
            # Créer un token JWT pour l'admin
            access_token = create_access_token(identity=admin.id)
            logger.info(f"Token créé")
            
            # Tester directement avec le client de test Flask
            logger.info("Test avec le client de test Flask")
            with app.test_client() as client:
                # Faire la requête avec le token
                headers = {'Authorization': f'Bearer {access_token}'}
                
                # Tester la route /api/orders
                logger.info("Test de la route /api/orders")
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

if __name__ == '__main__':
    logger.info("=== TEST DE LA ROUTE /api/orders ===")
    test_user_orders_route()